import { NextApiRequest, NextApiResponse } from "next";
import {MongoClient, ObjectId} from "mongodb"
const client = new MongoClient("mongodb://localhost:27017")

export default async function get_pack(req: NextApiRequest, res: NextApiResponse) {
    
    if(req.method === "GET") {
        
        //Checking if username exists
        if(req.query.route === "validate_username") {
            console.log(req.query.username)
            await client.connect()
            const collection = client.db("pixels").collection("users")
            
            const result = await collection.find({username: req.query.username}).toArray()
            if(result.length > 0) {
                res.send({available: false})
            } else {
                res.send({available: true})
            }
            
        }
        //Checking if E-Mail exist
        else if(req.query.route === "validate_email") {

        }
        
    } else {
        //Request is not a GET Request
        res.status(400).end()
    }
    
}