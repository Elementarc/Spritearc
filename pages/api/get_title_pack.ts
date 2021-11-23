import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from 'mongodb'
const db_url = 'mongodb://localhost:27017';
const client = new MongoClient(db_url);

export default async function get_title_pack(req: NextApiRequest, res: NextApiResponse) {

    if(req.method === "GET") {
        try {
            //Connecting to database
            await client.connect()
            //Choosing db
            const db = client.db("pixels");
            const title_pack = await db.collection("packs").find({}).toArray()
            
            res.setHeader("Content-type", "application/json")
            if(title_pack.length > 0) {
                res.status(200).send({body: title_pack[0]})
            } else {
                res.status(200).send({body: null})
            }

        } catch (err) {
            console.log(err)
            res.status(500).end()
        }
    } else {
        res.status(400).end()
    }
    
}