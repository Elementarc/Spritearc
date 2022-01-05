import type { NextApiRequest, NextApiResponse } from 'next'
import { create_user_pack } from '../../../lib/mongo_lib'
import { validate_files, validate_pack_description, validate_pack_title } from '../../../lib/validate_lib'
import withAuth from '../../../middleware/withAuth'
import { Public_user } from '../../../types'

async function api_request(req: any, res: NextApiResponse) {

    if(req.method === "POST") {

        try {
            const user_pack = JSON.parse(req.body)
            const public_user = req.user 

            console.log(user_pack)
            
            res.status(200).send("Successfully created a pack")
            

        } catch (err) {

            console.log(err)
            res.status(500).send("Something went wrong!")

        }

    } else {

        res.status(400).end()

    }
    
}

export default withAuth(api_request)
