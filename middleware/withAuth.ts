import jwt from "jsonwebtoken"

const withAuth = (handler: any) => {
    return async (req: any, res: any) => {
        try {

            const cookies = req.cookies
            if(req.method !== "POST") return res.status(400).send("Please use POST method.")
            if(!cookies.user) return res.status(401).send("Please login to get access")
    
            const user = jwt.verify(cookies.user, `${process.env.JWT_PRIVATE_KEY}`)
            if(!user) return res.status(403).send("Couldn't find a user")
            
            return handler(req, res)

        } catch ( err ) {

            console.log(err)
            res.status(500).send("Invalid secret")

        }
        
    }

}

export default withAuth