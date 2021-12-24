import { NextApiRequest, NextApiResponse } from "next";
import { get_released_packs_by_user } from "../../lib/mongo_lib";

export default async function api_request(req: NextApiRequest, res: NextApiResponse) {
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