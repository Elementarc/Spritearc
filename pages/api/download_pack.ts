import { NextApiRequest, NextApiResponse } from "next";


export default async function get_pack(req: NextApiRequest, res: NextApiResponse) {
    
    if(req.method === "GET") {
       
        
    } else {
        //Request is not a GET Request
        res.status(400).end()
    }
    
}