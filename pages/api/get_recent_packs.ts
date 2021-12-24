import type { NextApiRequest, NextApiResponse } from 'next'
import { get_recent_packs } from '../../lib/mongo_lib';

export default async function api_request(req: NextApiRequest, res: NextApiResponse) {

    if(req.method === "GET") {

        try {

            //gettings packs from db
            const packs = await get_recent_packs(12)

            if(!packs) return res.status(200).send({body: null})

            res.status(200).send({body: packs})

        } catch (err) {

            console.log(err)
            res.status(500).send("Something went wrong!")

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
