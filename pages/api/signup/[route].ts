import { NextApiRequest, NextApiResponse } from "next";
import {MongoClient, ObjectId} from "mongodb"
import { ServerSignUp, SignUp } from "../../../types";
import { SHA256 } from "crypto-js";
const username_regex = new RegExp(/^(?=.{3,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)
const email_regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
const password_regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,32}$/)

const client = new MongoClient("mongodb://localhost:27017")

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

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
    
    if(req.method === "POST") {
        
        //Checking if username exists
        if(req.query.route === "validate_username") {
            const username = req.body.username

            const username_available = await validate_username(username)
            
            if(username_available) {
                res.status(200).send({available: true})
            } else {
                res.status(200).send({available: false})
            }
            
        } else if(req.query.route === "validate_email") {
            const email = req.body.email
            
            const email_available = await validate_email(email)

            if(email_available) {
                res.send({available: true})
            } else {
                res.send({available: false})
            }
            
        } else if(req.query.route === "create_account") {
            const { username, email, password, legal, occasional_emails } =  req.body.signup_obj as SignUp
            if(!username) return res.status(400).end()
            if(!email) return res.status(400).end()
            if(!password) return res.status(400).end()
            if(!legal) return res.status(400).end()
            
            const email_available = await validate_email(email)
            const username_available = await validate_username(username)
            const password_valid = password_regex.test(password)
            
            console.log(email_available, username_available, password_valid)
            if(!email_available) return res.status(400).end()
            if(!username_available) return res.status(400).end()
            if(!password_valid) return res.status(400).end()
            
            //Creating salt
            let salt = ""
            for(let i = 0; i < 32; i ++) {
                const random_number = Math.floor(Math.random() * 88) + 33
                
                salt += String.fromCharCode(random_number)
            }
            
            const hashed_password = SHA256(password + salt).toString()
            await client.connect()
            const collection = client.db("pixels").collection("users")

            collection.insertOne({
                username: username,
                email: email,
                hashed_password: hashed_password,
                salt: salt,
                date: new Date(),
                about: "",
                socials: [],
                profile_image: "image.png",
                released_packs: [],
                occasional_emails: occasional_emails,
            })
            res.send({successful: true})
        } else {
            //console.log("couldn't find correct route")
            res.status(400).end()
        }
        
        
    } else {
        //Request is not a POST Request
        res.status(400).end()
    }
    
}