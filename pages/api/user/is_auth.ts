import { NextApiRequest, NextApiResponse } from "next";
import withAuth from "../../../middleware/withAuth";

function is_auth(req: NextApiRequest | any, res: NextApiResponse) {
    

    if(req.method === "POST") {
        
        try {
            const user = req.user
            
            res.status(200).send({auth: true, ...user})

        } catch ( err ) {
            res.status(400).send("Wrong secret")
        }
        
    } else {
        res.status(400).send("Please use POST method.")
    }
}

export default withAuth(is_auth)


