import { NextApiRequest, NextApiResponse } from "next";
import {MongoClient, ObjectId} from "mongodb"
import { Pack_info } from "../../types";

const client = new MongoClient("mongodb://localhost:27017")

export default async function get_pack(req: NextApiRequest, res: NextApiResponse) {
    const pack_id_arr = req.body as string[]

    if(req.method === "GET") {
        
        try {

            await client.connect()
            const packs_collection = client.db("pixels").collection("packs")
    
            const user_packs: Pack_info[] = []
            for(let pack_id of pack_id_arr) {
                const pack_id_valid = ObjectId.isValid(pack_id)
    
                if(pack_id_valid) {
                    const pack = await packs_collection.findOne({_id: new ObjectId(pack_id)}) as Pack_info
                    
                    if(pack) {
                        user_packs.push(pack)
                    }
                }
                
            }
            
            res.status(200).send(user_packs)
        } catch ( err ) {
            console.log(err)
            res.status(500).send("something went wrong!")
        }

    } else {
        res.status(400).end()
    }
}