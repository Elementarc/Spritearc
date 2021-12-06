import {NextApiRequest, NextApiResponse} from "next"
import cookie from "cookie"
export default async function signup(req: NextApiRequest, res: NextApiResponse) { 

    if(req.method === "POST") {
        console.log(req.cookies)



    } else {
        //Wrong method
        res.status(400).end()
    }

}