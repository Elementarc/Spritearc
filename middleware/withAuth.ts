

const withAuth = (handler: any) => {
    return async (req: any, res: any) => {
        const cookies = req.cookies
        if(req.method !== "POST") return res.status(400).send("Please use POST method.")
        if(!cookies.user) return res.status(401).send("Please login to get access")


        return handler(req, res)
    }

}

export default withAuth