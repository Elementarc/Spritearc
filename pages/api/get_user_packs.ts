import { NextApiRequest, NextApiResponse } from "next";
import {MongoClient, ObjectId} from "mongodb"
import { get_released_packs_by_user } from "../../lib/mongo_lib";
import { Pack } from "../../types";

const client = new MongoClient("mongodb://localhost:27017")

export default async function get_pack(req: NextApiRequest, res: NextApiResponse) {
    const pack_id_arr = req.body as string[]

    if(req.method === "GET") {
        
        try {

            const packs = await get_released_packs_by_user(pack_id_arr)
            
            res.status(200).send(packs)

        } catch ( err ) {

            console.log(err)
            
            res.status(500).send("something went wrong!")

        }

    } else {
        res.status(400).end()
    }
}