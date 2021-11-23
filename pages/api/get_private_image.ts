import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import AdmZip from "adm-zip";

export default async function get_private_images(req: NextApiRequest, res: NextApiResponse) {

    if(req.method === "GET") {
        fs.writeFileSync("text.txt", "Heya")
        const zip = new AdmZip()
        console.log("test")
        zip.writeZip("test.zip")
        res.status(200).end()
    } else {
        
    }
    
}