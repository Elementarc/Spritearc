import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs"
import del from "del"

import withAuth from '../../../middleware/withAuth'
import { Public_user, Pack, Pack_content, Formidable_files } from '../../../types'
// @ts-ignore: Unreachable code error
import formidable from 'formidable';
import { ObjectId } from 'mongodb'
import { create_user_pack, delete_pack, get_pack } from '../../../lib/mongo_lib';
import { validate_files, validate_formidable_files, validate_single_formidable_file } from '../../../lib/validate_lib';

async function api_request(req: any, res: NextApiResponse) {

    if(req.method === "POST") {
        
        try { 
            const user = req.user as Public_user
            const pack_id = req.query.id as string
            const pack_directory = `${process.cwd()}/public/packs/${pack_id}`

            const delete_res = await delete_pack(new ObjectId(pack_id), user)

            if(!delete_res) throw "Couldnt delete file"

            const deleted_paths = await del([pack_directory])
            
            res.status(200).send("successfully deleted pack")

        } catch (err) {

            console.log(err)
            res.status(500).send("Something went wrong!")

        }

    } else {

        res.status(400).send("Please use POST method.")

    }
    
}

export const config = {
    api: {
        bodyParser: false,
    }
}

export default withAuth(api_request)
