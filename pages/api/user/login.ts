import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import { SHA256 } from "crypto-js";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { Public_user } from "../../../types";
import { get_public_user } from "../../../lib/mongo_lib";
const client = new MongoClient(`${process.env.MONGO_DB}`)


async function api_request(req: NextApiRequest | any, res: NextApiResponse) {
    
    if(req.method === "POST") {
        const cookies = req.cookies
        if(cookies.user) return res.status(400).send("Please logout before login")
        //user is not logged in

        //Getting user Credentials from user
        const { email, password } = req.body as {email: string, password: string}
        
        try {
            if(!email) return res.status(400).send("Couldn't find Email")
            if(!password) return res.status(400).send("Couldn't find password")
            
            await client.connect()
            const collection = client.db("pixels").collection("users")
            const user_arr = await collection.aggregate([
                {
                    $project: {
                        username: "$username",
                        verified: "$verified",
                        created_at: "$created_at",
                        description: "$description",
                        profile_picture: "$profile_picture",
                        profile_banner: "$profile_banner",
                        email: {$toUpper: "$email"},
                        password: "$password",
                        salt: "$salt",
                        followers: "$followers",
                        following: "$following",
                        released_packs: "$released_packs",
                    }
                },
                {
                    $match: {
                        email: email.toUpperCase()
                    }
                }
            ]).toArray()
            
            
            if(user_arr.length === 0) return res.status(400).send("Couldn't find Account")
            //User exists in db.

            const user = user_arr[0]
            if(!user.verified) return res.status(401).send({verified: false, email: user.email})
            //User is verified
            const hashed_password = SHA256(password + user.salt).toString()
            
            if(hashed_password === user.password) {
                
                //Getting public userobj by username from database
                const public_user: Public_user | null = await get_public_user(user.username)
                
                if(!public_user) return res.status(401).send("Couldn't find user")
                //Creating token
                const token = jwt.sign(public_user, process.env.JWT_PRIVATE_KEY as string)

                //Setting cookie with token as value
                res.setHeader('Set-Cookie', cookie.serialize('user', token, {
                    httpOnly: true,
                    path: "/",
                    sameSite: "strict",
                    maxAge: 60 * 60
                }));
                
                res.status(200).send(public_user)

            } else {
                res.status(403).send("Wrong credentials")
            }
    
            
        } catch ( err ) {

            res.status(500).send("Couldn't log you in. something went wrong!")

        }


    } else {
        res.status(400).send("Please use POST method.")
    }

}

export default api_request
