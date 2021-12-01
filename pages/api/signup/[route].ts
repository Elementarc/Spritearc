import { NextApiRequest, NextApiResponse } from "next";
import {MongoClient, ObjectId} from "mongodb"
const client = new MongoClient("mongodb://localhost:27017")

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
    
    if(req.method === "POST") {
        
        //Checking if username exists
        if(req.query.route === "validate_username") {
            const username = req.body.username

            if(!username) return res.status(400).end()

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
                    res.status(200).send({available: false})
                } else {
                    res.status(200).send({available: true})
                }

            } catch ( err ) {

                console.log(err)
                res.status(500).end()

            }
            
            
        } else if(req.query.route === "validate_email") {
            const email = req.body.email
            
            if(!email) return res.status(400).end();

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
                    res.status(200).send({available: false})
                } else {
                    res.status(200).send({available: true})
                }

            } catch ( err ) {

                console.log(err)
                res.status(500).end()

            }
            
        } else if(req.query.route === "create_account") {
            const { username, email, password, legal, occasional_emails } =  req.body.signup_obj
            
            
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