import {NextApiRequest, NextApiResponse} from "next"
import jwt from "jsonwebtoken"
import cookie from "cookie"

export default async function signup(req: NextApiRequest, res: NextApiResponse) { 

    if(req.method === "POST") {
        const cookies = req.cookies
        
        if(!cookies.user) res.status(200).send({authorized: false, username: null})
        else {
            
            res.status(200).send({authorized: true, username: "Hamit"})
        }
        
    } else {
        //Wrong method
        res.status(400).end()
    }

}