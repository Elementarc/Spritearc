import { NextApiRequest, NextApiResponse } from "next";
import {MongoClient, ObjectId} from "mongodb"
const client = new MongoClient("mongodb://localhost:27017")

export default async function get_pack(req: NextApiRequest, res: NextApiResponse) {
    const query = req.query
    const pack_id = query.id
    if(req.method === "GET") {
        if(typeof pack_id === "string") {
            
            if(ObjectId.isValid(`${pack_id}`) === true) {
                await client.connect();
                const packs_collection = client.db("pixels").collection("packs")
                const pack = await packs_collection.findOne({_id: new ObjectId(`${pack_id}`)})
                
                if(pack) {
                    
                    //Successfully found a pack and send to the server!
                    res.status(200).send(pack)
                } else {
                    //Couldnt find a pack with given id
                    res.status(404).send("Could not find a pack with the given id.")
                }
            } else {
                //Id is not correct
                res.status(400).send("Please check the id of the pack")
            }

        } else {
            //Query is not a string
            res.status(400).end()
        }
        
    } else {
        //Request is not a GET Request
        res.status(400).end()
    }
    
}