import { NextApiRequest, NextApiResponse } from "next";
import {MongoClient, ObjectId} from "mongodb"
const client = new MongoClient("mongodb://localhost:27017")

export default async function get_pack(req: NextApiRequest, res: NextApiResponse) {
    const query = req.query
    const pack_id = query.toString()
    if(req.method === "GET") {
        await client.connect();
        const packs_collection = client.db("pixels").collection("packs")
        const pack = await packs_collection.findOne({_id: new ObjectId("618a662ae6b319b07e20a246")})
        res.send(pack)
    } else {
        
    }
    
}