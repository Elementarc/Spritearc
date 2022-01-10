import type { NextApiRequest, NextApiResponse } from 'next'
import { create_number_from_page_query } from '../../lib/custom_lib';
import {  get_title_pack } from '../../lib/mongo_lib';
import { Pack } from '../../types';

export default async function api_request(req: NextApiRequest, res: NextApiResponse) {

    if(req.method === "GET") {

        try {
            
            const title_pack: Pack | null = await get_title_pack()
            
            if(!title_pack) res.status(500).end()
            
            if(!title_pack) return res.status(200).send({body: []})

            res.status(200).send({pack: title_pack})

        } catch (err) {

            console.log(err)
            res.status(500).send("Something went wrong!")

        }

    } else {

        res.status(400).end()

    }
    
}