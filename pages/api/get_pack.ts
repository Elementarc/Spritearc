import { NextApiRequest, NextApiResponse } from "next";
import { get_pack_by_id } from "../../lib/mongo_lib";
import { ObjectId } from "mongodb"

export default async function api_request(req: NextApiRequest, res: NextApiResponse) {
    const pack_id = req.query.id

    if(req.method === "GET") {
        if(typeof pack_id !== "string") return res.status(400).end()
        
        try {

            //Checking if query pack id is a valid ObjectId
            if(ObjectId.isValid(`${pack_id}`) === true) {

                const pack = await get_pack_by_id(new ObjectId(pack_id))

                if(!pack) res.status(400).send("Could not find pack with given id")

                res.status(200).send(pack)
                
            } else {

                //Id is not correct
                res.status(400).send("Please check the id of the pack")
                
            }

        } catch ( err ) {

            console.log(err)
            res.status(500).send("Something went wrong!")
            
        }


    } else {
        res.status(400).end()
    }
}