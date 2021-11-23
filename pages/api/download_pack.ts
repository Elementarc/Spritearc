import { NextApiRequest, NextApiResponse } from "next";
import {MongoClient, ObjectId} from "mongodb"
const client = new MongoClient("mongodb://localhost:27017")

export default async function get_pack(req: NextApiRequest, res: NextApiResponse) {
    
    if(req.method === "GET") {
       
        
    } else {
        //Request is not a GET Request
        res.status(400).end()
    }
    
}