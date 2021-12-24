import { NextApiRequest, NextApiResponse } from "next";
import {MongoClient, ObjectId} from "mongodb"
const client = new MongoClient("mongodb://localhost:27017")

export default async function get_pack(req: NextApiRequest, res: NextApiResponse) {
    const pack_id = req.query.id

    if(req.method === "GET") {
        if(typeof pack_id !== "string") return res.status(400).end()
        
        //Checking if query pack id is a valid ObjectId
        if(ObjectId.isValid(`${pack_id}`) === true) {

            await client.connect();
            const packs_collection = client.db("pixels").collection("packs")
            const pack = await packs_collection.findOne({_id: new ObjectId(`${pack_id}`)})
            
            if(!pack) return res.status(404).send("Could not find a pack with the given id.")

            res.status(200).send(pack)
            
        } else {
            //Id is not correct
            res.status(400).send("Please check the id of the pack")
        }

    } else {
        res.status(400).end()
    }
}