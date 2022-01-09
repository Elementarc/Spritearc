import type { NextApiResponse } from 'next'
import del from "del"
import withAuth from '../../../middleware/withAuth'
import { Public_user} from '../../../types'
import { ObjectId } from 'mongodb'
import { delete_pack } from '../../../lib/mongo_lib';

async function api_request(req: any, res: NextApiResponse) {

    if(req.method === "POST") {
        
        try { 
            const user = req.user as Public_user
            const pack_id = req.query.id as string
            const pack_directory = `${process.cwd()}/public/packs/${pack_id}`

            const delete_res = await delete_pack(new ObjectId(pack_id), user)

            if(!delete_res) throw "Couldnt delete file"

            const deleted_paths = await del([pack_directory])
            
            res.status(200).send({message: "Successfully deleted pack!"})

        } catch (err) {

            console.log(err)
            res.status(500).send("Something went wrong!")

        }

    } else {

        res.status(400).send("Please use POST method.")

    }
    
}

export default withAuth(api_request)
