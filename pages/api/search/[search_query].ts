import { NextApiRequest, NextApiResponse } from "next";
import { get_pack_by_tag } from "../../../lib/mongo_lib";
import { validate_pack_tag } from "../../../lib/validate_lib";

export default async function name(req: NextApiRequest, res: NextApiResponse) {
    

    if(req.method === "POST") {
        try {
            const packs_per_page = 8
            const user_search = req.query.search_query
            const page = req.query.page

            if(typeof user_search !== "string") return res.status(400).end()
            if(typeof page !== "string") return res.status(400).end()

            const valid_tag = validate_pack_tag(user_search)

            if(typeof valid_tag === "string") return res.status(400).send("didnt pass validation")
            const found_packs_obj =  await get_pack_by_tag(user_search.toLowerCase())

            if(!found_packs_obj) return res.status(200).send({packs: [], max_page: 0})

            const max_page = Math.ceil(found_packs_obj.collection_size / packs_per_page)

            res.status(200).send({packs: found_packs_obj.packs_found.slice(0, packs_per_page * parseInt(page)), max_page: max_page})

        } catch( err ) {
            res.status(500).send("Something went wrong!")
        }
    } else {
        res.status(400).send("Please use POST method")
    }
}