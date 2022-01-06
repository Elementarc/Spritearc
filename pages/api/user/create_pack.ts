import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs"
import withAuth from '../../../middleware/withAuth'
import { Public_user, Pack, Pack_content } from '../../../types'
// @ts-ignore: Unreachable code error
import formidable from 'formidable';

import { ObjectId } from 'mongodb'
import { create_user_pack } from '../../../lib/mongo_lib';

async function api_request(req: any, res: NextApiResponse) {

    if(req.method === "POST") {

        try {
            const public_user: Public_user = req.user
            const id = new ObjectId()
            const pack_directory = `${process.cwd()}/public/packs/${id}`
            
            console.log(pack_directory)

            const form = new formidable.IncomingForm({multiples: true});
            
            form.on("fileBegin", (name, file) => {
                const exists = fs.existsSync(pack_directory)
                if(!exists) fs.mkdirSync(pack_directory)


                if(name.toLowerCase() === "preview") {

                    file.filepath = `${pack_directory}/${file.originalFilename?.toLowerCase()}.${file.mimetype?.split("/")[1].toLowerCase()}`

                } else {
                    const section_name = file.originalFilename?.split("_")[0]

                    if(!fs.existsSync(`${pack_directory}/${section_name}`)) {
                        fs.mkdirSync(`${pack_directory}/${section_name}`)
                    }
    
                    file.filepath = `${pack_directory}/${section_name?.toLowerCase()}/${file.originalFilename?.toLowerCase()}.${file.mimetype?.split("/")[1].toLowerCase()}`
                }
             
            })
            

            function enter_pack_to_db(): Promise<void> {
                return new Promise((resolve, reject) => {
                    form.parse(req, async(err, fields, files) => {
                        if(err) reject(err)
                        const preview_file: any = files.preview
                        const content_files: any = files.content

                        let pack_content: Pack_content[] = []
                        for(let key in files) {

                            if(key !== "preview") {

                                const section_images: string[] = []
                                for(let file of files[key] as any) {

                                    section_images.push(`${file.originalFilename?.toLowerCase()}.${file.mimetype?.split("/")[1].toLowerCase()}`)
                                }

                                pack_content.push({
                                    section_name: key.toLowerCase(),
                                    section_images: section_images
                                })
                                
                            }
                            
                        }
                        const pack: Pack = {
                            _id: id,
                            username: public_user.username,
                            preview: `preview.${preview_file.mimetype.split("/")[1].toLowerCase()}`,
                            title: fields.title as string,
                            description: fields.description as string,
                            license: fields.license as string,
                            date: new Date(),
                            tags: JSON.parse(fields.tags as string),
                            downloads: 0,
                            content: pack_content,
                            ratings: []
                        } 

                        await create_user_pack(pack)

                        //create_user_pack()
                        
                        resolve()
                    })
                })
            }
            
            await enter_pack_to_db()

            
            res.status(200).send("")

        } catch (err) {

            console.log(err)
            res.status(500).send("Something went wrong!")

        }

    } else {

        res.status(400).end()

    }
    
}

export const config = {
    api: {
        bodyParser: false,
    }
}

export default withAuth(api_request)
