import { NextApiRequest, NextApiResponse } from "next";
import { get_released_packs_by_user } from "../../lib/mongo_lib";
import { create_number_from_page_query } from "../../lib/custom_lib";

export default async function api_request(req: NextApiRequest, res: NextApiResponse) {

    if(req.method === "POST") {
        
        const packs_per_page = 8
        try {
            
            const page = req.query.page
            const page_int = create_number_from_page_query(page)
            if(typeof page_int !== "number") return res.status(400)

            const pack_id_arr = JSON.parse(req.body) as string[]
            const packs = await get_released_packs_by_user(pack_id_arr)
            const max_page = Math.ceil(packs.length / packs_per_page)

            res.status(200).send({packs: packs.slice(0, packs_per_page * page_int), max_page: max_page})

        } catch ( err ) {

            console.log(err)
            console.log(err)
            res.status(500).send("something went wrong!")

        }

    } else {
        res.status(400).end()
    }
}