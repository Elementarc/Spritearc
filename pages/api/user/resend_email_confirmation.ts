import { SHA256 } from "crypto-js";
import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
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

const client = new MongoClient("mongodb://localhost:27017")

async function send_verification(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const { email } =  req.body as {email: string}

        //Connecting to database
        try {

            function send_verification_mail(): Promise<boolean> {
                return new Promise(async(resolve) =>{

                    try {
                        await client.connect();
                        const collection = client.db("pixels").collection("users")
                        const user_arr = await collection.aggregate([
                            {
                                $project: {
                                    email: {$toUpper: "$email"},
                                    verified: "$verified"
                                }
                            },
                            {
                                $match: {
                                    email: email.toUpperCase()
                                }
                            }
                        ]).toArray()

                        if(user_arr.length === 0) return res.status(400).send("Couldn't find an Account with that email")
                        const user_id = user_arr[0]._id.toString()

                        if(user_arr[0].verified === true) return res.status(400).send("Account already is verified!")
                        

                        const account_verification_token_collection = client.db("pixels").collection("account_verification_tokens")
                        account_verification_token_collection.createIndex({date: 1}, {expireAfterSeconds: 3600})
                        const token = SHA256(user_id).toString()

                        const verification_tokens = await account_verification_token_collection.find({token: token}).toArray()
                        if(verification_tokens.length > 0) return res.status(400).send("There already is an token!")
                        //Creating token in db to verify account
                        account_verification_token_collection.insertOne({
                            date: new Date(),
                            token: token,
                            user_id: user_id,
                        })

                        
                        
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
            

            res.status(200).send("Successfully send an email!")

        } catch ( err ) {

            console.log(err)
            res.status(500).send("Something went wrong while trying to create your account.")

        }
            
    } else {
        res.status(400).send("Please use POST method.")
    }
}

export default send_verification