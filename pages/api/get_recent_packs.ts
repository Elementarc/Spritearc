// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient } from 'mongodb'
import { Pack_info } from "../../types"
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

export default async function get_recent_packs(req: NextApiRequest, res: NextApiResponse) {

    if(req.method === "GET") {
        try {
            //Connecting to database
            await client.connect()
            //Choosing db
            const db = client.db("pixels");
            //Returning 12 Packs Ordered by Date.
            const recent_packs = await db.collection("packs").find({}).sort({date: -1}).limit(12).toArray() as Pack_info[]

            res.setHeader("Content-type", "application/json")
            if(recent_packs.length > 0) {
                res.status(200).send({body: recent_packs})
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


/* export default async function getRecentPacks(req: NextApiRequest, res: NextApiResponse) {

    if(req.method === "GET") {
        const query = req.query
        const currentPage = checkIfRequestHasValidPageQuery(query.page)
        const maxPacksPerPage = 2
        try {
            //Connecting to database
            await client.connect()
            //Choosing db
            const db = client.db("pixels");
            //Returning packs
            const allRecentPacks = await db.collection("packs").find({}).sort({date: -1}).toArray() as Pack[]
            const lastPage = Math.ceil(allRecentPacks.length / maxPacksPerPage)
            //Getting the correct packs based on currentPage query.
            const specificPartOfRecentPacks = allRecentPacks.slice((currentPage * maxPacksPerPage) - maxPacksPerPage ,currentPage * maxPacksPerPage)
            const recentPacksRes: RecentPacksResponse = {
                packs: specificPartOfRecentPacks,
                lastPage: lastPage
            }
            res.setHeader("Content-type", "application/json")
            res.send(JSON.stringify(recentPacksRes))

        } catch (err) {
            console.log(err)
            res.status(500).end()
        }
    } else {
        res.status(400).end()
    }
    
} */
