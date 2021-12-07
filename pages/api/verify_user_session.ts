import {NextApiRequest, NextApiResponse} from "next"
import jwt from "jsonwebtoken"
import cookie from "cookie"

export default async function signup(req: NextApiRequest, res: NextApiResponse) { 

    if(req.method === "POST") {

        const cookies = req.cookies
        if(!cookies) return res.status(200).send({authenticated: false})
        if(!cookies.user) return res.status(200).send({authenticated: false})
        const user = jwt.verify(cookies.user, "shhh")
        
        setTimeout(() => {
            res.status(200).send(user) 
        }, 1000);
        


    } else {
        //Wrong method
        res.status(400).end()
    }

}