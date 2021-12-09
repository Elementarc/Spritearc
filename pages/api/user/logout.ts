import { NextApiRequest, NextApiResponse } from "next";

import cookie from "cookie";
import withAuth from "../../../middleware/withAuth";

async function logout(req: NextApiRequest, res: NextApiResponse) {
    
    if(req.method === "POST") {
        res.setHeader("Set-Cookie", cookie.serialize("user", "", {
            maxAge: -1,
            path: "/"
        }))
        
        res.status(200).send("Successfully logged out!")

    } else {
        res.status(400).send("Please use POST method.")
    }

}

export default withAuth(logout)