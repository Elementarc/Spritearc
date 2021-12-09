import { NextApiRequest, NextApiResponse } from "next";
import {MongoClient} from "mongodb"
import { SignUp } from "../../../../types";
import { SHA256 } from "crypto-js";
const nodemailer = require("nodemailer")
//Creating email transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'eriberto.shields32@ethereal.email',
        pass: 'svrEs7YJuAcsyHxy41'
    }
});

const username_regex = new RegExp(/^(?=.{3,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)
const email_regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
const password_regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,32}$/)

const client = new MongoClient("mongodb://localhost:27017")


export default async function signup(req: NextApiRequest, res: NextApiResponse) {
    
    //Function that validates an email.
    async function validate_email(email: string | string[] | null) {
        if(typeof email !== "string") return false
        if(email_regex.test(email) === false) return false
    
        try {
            await client.connect()
            const collection = client.db("pixels").collection("users")
    
            const aggregated_response = await collection.aggregate([
                {
                    $project: {
                        email: { $toUpper: "$email" },
                    },
                },
                {
                    $match: {email: email.toUpperCase()}
                }
            ]).toArray()
            
            if(aggregated_response.length > 0) {
                return false
            } else {
                return true
            }
    
        } catch ( err ) {
            console.log(err)
            return false
        }
    }
    //Function that validates an username.
    async function validate_username(username: string | string[] | null) {
        if(typeof username !== "string") return false
        if(username_regex.test(username) === false) return false
    
        try {
    
            await client.connect()
            const collection = client.db("pixels").collection("users")
            const aggregated_response = await collection.aggregate([
                {
                    $project: {
                        username: { $toUpper: "$username" },
                    },
                },
                {
                    $match: {username: username.toUpperCase()}
                }
                
            ]).toArray()
            
            if(aggregated_response.length > 0) {
                return false
            } else {
                return true
            }
    
        } catch ( err ) {
    
            console.log(err)
            return false
        }
    }

    //POST Method
    if(req.method === "POST") {
        if(typeof req.query.route !== "string") return res.status(400).end()

        //Validating username only.
        if(req.query.route === "validate_username") {
            const username = req.body.username

            const username_available = await validate_username(username)
            
            if(username_available) {
                res.status(200).end()
            } else {
                res.status(403).send("Can't use that username")
            }
            
        }
        //Validating email only.
        else if(req.query.route === "validate_email") {
            const email = req.body.email
            const email_available = await validate_email(email)

            if(email_available) {

                res.status(200).send({available: true})

            } else {
                
                res.status(403).send("Can't use that email.")

            }
            
        } 
        //Validating whole signup request. Sending verification to email.
        else if(req.query.route === "send_verification") {
            //Verification send with signup page.
            
            const { username, email, password, legal, occasional_emails } =  req.body as {username: string, email: string, password: string, legal: string | boolean, occasional_emails: string | boolean}
            let legal_init = false
            let ocassional_emails_init = false
            if(typeof legal === "string") legal_init = legal.toLowerCase() === "true" ? true : false
            if(typeof legal === "boolean") legal_init = legal ? true : false
            if(typeof occasional_emails === "string") ocassional_emails_init = occasional_emails.toLowerCase() === "true" ? true : false
            if(typeof occasional_emails === "boolean") ocassional_emails_init = occasional_emails ? true : false
            
            //Checking if signup object properties exist.
            if(!username || !email || !password || !legal_init) return res.status(400).send("Missing credentials!")
            
            //Validating userinputs. Also making call to backend to check if it already exists.
            const email_available = await validate_email(email)
            const username_available = await validate_username(username)
            const password_valid = password_regex.test(password)
            
            //Validating inputs
            if(!email_available || !username_available || !password_valid) return res.status(403).send("Credentials didn't pass validations!")
           
            //Passed all tests

            //Creating salt to hash password
            let salt = ""
            const ascii_string= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
            for(let i = 0; i < 32; i ++) {
                const random_number = Math.floor(Math.random() * ascii_string.length - 1)
                
                salt += ascii_string.charAt(random_number)
            }
            
            const hashed_password = SHA256(password + salt).toString()


            //Connecting to database
            try {

                await client.connect()
            
                const users_collection = client.db("pixels").collection("users")
                
                //Creating a new user instance for user.
                await users_collection.insertOne({
                    username: username,
                    email: email,
                    password: hashed_password,
                    salt: salt,
                    verified: false,
                    description: "",
                    picture: "image.png",
                    created_at: new Date(),
                    occasional_emails: ocassional_emails_init,
                    notifications: [],
                    following: [],
                    followers: [],
                    released_packs: [],
                })
                
                const user = await users_collection.findOne({username: username})
                if(! user) throw new Error("Could not find username in database")
                //User exists in database

                const user_id =  user._id.toString()

                const account_verification_token_collection = client.db("pixels").collection("account_verification_tokens")
                account_verification_token_collection.createIndex({date: 1}, {expireAfterSeconds: 3600})
                const token = SHA256(user_id).toString()

                //Creating token in db to verify account
                account_verification_token_collection.insertOne({
                    date: new Date(),
                    token: token,
                    user_id: user_id,
                })

                function send_verification_mail(): Promise<boolean> {
                    return new Promise(async(resolve) =>{
                        try {
                        
                            
                            
                            await transporter.sendMail({
                                from: 'Arctale.work@gmail.com', // sender address
                                to: `arctale.gaming@gmail.com`, // list of receivers
                                subject: "E-mail confirmation", // Subject line
                                text: `Hey please confirm your email address by clicking on this link: ${process.env.FULL_DOMAIN}/verify_account?token=${token}`, // plain text body
                            }, (err: any, info: any) => {
                                if(err) throw err
                                resolve(true)
                            });
                            
                        } catch ( err ) {

                            console.log(err)
                            resolve(false)

                        }
                        
                    })
                }
                await send_verification_mail()
                

                res.status(200).send("Successfully created your account!")

            } catch ( err ) {

                console.log(err)
                res.status(500).send("Something went wrong while trying to create your account.")

            }
            

        } 
        //Could'nt find correct route.
        else {
            //console.log("couldn't find correct route")
            res.status(400).end()
        }
        
    } 
    else {
        //Wrong mehtod
        res.status(400).send("Please use POST method.")
    }
    
}