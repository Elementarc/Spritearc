import type { NextApiResponse } from 'next'
import fs from "fs"
import withAuth from '../../../middleware/withAuth'
import { Public_user, Pack, Pack_content, Formidable_files } from '../../../types'
// @ts-ignore: Unreachable code error
import formidable from 'formidable';
import { ObjectId } from 'mongodb'
import { create_user_pack, delete_pack, get_pack } from '../../../lib/mongo_lib';
import { validate_files, validate_formidable_files, validate_single_formidable_file } from '../../../lib/validate_lib';

async function api_request(req: any, res: NextApiResponse) {

    if(req.method === "POST") {
        //Creating an object id
        const id = new ObjectId()
        //Directory where the packs will be created at
        const pack_directory = `${process.cwd()}/public/packs/${id}`

        //Req user that initiated the create pack request
        const public_user: Public_user = req.user
        
        try {
            
            
            //Handles multiple files form.
            const form = new formidable.IncomingForm({multiples: true});
            
            //Event that validates & creates files in the correct directory with the correct strutcure based of the pack content
            form.on("fileBegin", (section_name, file) => {

                //Validating file
                const valid_file = validate_single_formidable_file(file)

                if(valid_file === true) {

                    //Checking if pack_directory already exists.
                    const exists = fs.existsSync(pack_directory)

                    //Creating directory when directory is not exisiting.
                    if(!exists) fs.mkdirSync(pack_directory)

                    //Creating files in the correct sturcture.
                    if(section_name.toLowerCase() === "preview") {

                        file.filepath = `${pack_directory}/${file.originalFilename?.toLowerCase()}.${file.mimetype?.split("/")[1].toLowerCase()}`
    
                    } else {
                        
                        //Getting the extention from the file
                        const file_extention = `${file.mimetype?.split("/")[1].toLowerCase()}`

                        //Checking if directory exists with section_name
                        if(!fs.existsSync(`${pack_directory}/${section_name}`)) {
                            //Creating directory when no directory with given section name exists
                            fs.mkdirSync(`${pack_directory}/${section_name}`)
                        }
                        
                        //Creating file in given path.
                        file.filepath = `${pack_directory}/${section_name.toLowerCase()}/${file.originalFilename?.toLowerCase()}.${file_extention}`
                    }

                }

             
            })
            
            //Function that creates a database entry
            function enter_pack_to_db(): Promise<void> {
                return new Promise((resolve, reject) => {

                    //Parsing FromData Files & Fields
                    form.parse(req, async(err, fields, files) => {
                        if(err) reject(err)
                        const pack_files = files as unknown
                        const valid_files = validate_formidable_files(pack_files as Formidable_files)

                        if(typeof valid_files === "string") throw `${valid_files}`

                        //Preview file
                        const preview_file: any = files.preview

                        //Array that will be the content of a pack.
                        let pack_content: Pack_content[] = []
                        
                        //Looping through FormData Obj Files.
                        for(let key in files) {
                            
                            //Logic for sections besides preview.
                            if(key.toLocaleLowerCase() !== "preview") {

                                //Creating an array with directories to specific file in the public folder.
                                const section_images: string[] = []

                                //Looping through files of specific object property
                                for(let file of files[key] as any) {

                                    section_images.push(`${file.originalFilename?.toLowerCase()}.${file.mimetype?.split("/")[1].toLowerCase()}`)
                                }

                                //Pushing content to pack_content arr. that will be used
                                pack_content.push({
                                    section_name: key.toLowerCase(),
                                    section_images: section_images
                                })
                                
                            }
                            
                        }

                        //Creating a pack obj. That will be created in database
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

                        //Creating database entry for a pack.
                        await create_user_pack(pack)

                        //create_user_pack()
                        
                        resolve()
                    })
                })
            }
            
            await enter_pack_to_db()
            
            res.status(200).send("Successfully created a pack!")

        } catch (err) {

            try {

                //Checking if part of the pack was created. Removing pack folder from filesystem.
                if(fs.existsSync(pack_directory)) fs.rmdirSync(pack_directory)
                const pack = await get_pack(id)

                if(pack) await delete_pack(id, public_user)

                console.log(err)
                res.status(500).send("Something went wrong!")

            } catch( err ) {

                console.log(err)
                res.status(500).send("Something went wrong!")

            }

        }

    } else {

        res.status(400).send("Please use POST method.")

    }
    
}

export const config = {
    api: {
        bodyParser: false,
    }
}

export default withAuth(api_request)
