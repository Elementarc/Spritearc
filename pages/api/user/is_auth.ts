import { NextApiRequest, NextApiResponse } from "next";
import withAuth from "../../../middleware/withAuth";
import jwt from "jsonwebtoken";

function is_auth(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST") {
        const cookies = req.cookies
        if(!cookies.user) return res.status(404).send("Not authorized")

        try {
            const token_payload: any = jwt.verify(cookies.user, `${process.env.JWT_PRIVATE_KEY}`)

            
            res.status(200).send({auth: true, username: token_payload.username, description: token_payload.description, created_at: token_payload.created_at, picture: token_payload.picture})

        } catch ( err ) {
            res.status(400).send("Wrong secret")
        }
        
    } else {
        res.status(400).send("Please use POST method.")
    }
}

export default withAuth(is_auth)


