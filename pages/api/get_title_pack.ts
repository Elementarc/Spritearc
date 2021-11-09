import { NextApiRequest, NextApiResponse } from "next";
export default async function get_recent_packs(req: NextApiRequest, res: NextApiResponse) {

    if(req.method === "GET") {
        res.send({lol: "lol"})
    } else {
        
    }
    
}