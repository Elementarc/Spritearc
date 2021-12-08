import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import { SHA256 } from "crypto-js";
import jwt from "jsonwebtoken";
import cookie from "cookie";
const client = new MongoClient(`${process.env.MONGO_DB}`)

async function login(req: NextApiRequest, res: NextApiResponse) {
    
    if(req.method === "POST") {
        const cookies = req.cookies
        if(cookies.user) return res.status(400).send("Please logout before login")
        cookies.user
        //Login request
        const { email, password } = req.body as {email: string, password: string}
        
        try {

            await client.connect()
            const collection = client.db("pixels").collection("users")
            const user_arr = await collection.aggregate([
                {
                    $project: {
                        username: "$username",
                        email: {$toUpper: "$email"},
                        password: "$password",
                        salt: "$salt"
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
    
            const hashed_password = SHA256(password + user.salt).toString()
            
            if(hashed_password === user.password) {

                const token = jwt.sign({username: user.username}, "shhh")
                
                res.setHeader('Set-Cookie', cookie.serialize('user', token, {
                    httpOnly: true,
                    path: "/",
                    sameSite: "strict",
                    maxAge: 60 * 60
                }));
                res.status(200).send({authenticated: true})

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

export default login
