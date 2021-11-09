// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient } from 'mongodb'
import { RecentPacksResponse , Pack} from "../../types"
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

//Function that return the correct page number. Takes in url query.
function checkIfRequestHasValidPageQuery(page: undefined | string | string[]): number {
    if (typeof page === "string") {
        return parseInt(page)
    } else {
        return 1
    }
}

export default async function getRecentPacks(req: NextApiRequest, res: NextApiResponse) {

    if(req.method === "GET") {
        const query = req.query
        const currentPage = checkIfRequestHasValidPageQuery(query.page)
        const maxPacksPerPage = 16
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
    
}
