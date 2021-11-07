// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient } from 'mongodb'
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);


export default async function packs_handler(req: NextApiRequest,res: NextApiResponse) {
    await client.connect()
    const db = client.db("pixelpackage");
    const collection  = await db.collection("packages").find({}).toArray()
    res.send(JSON.stringify(collection))
}
