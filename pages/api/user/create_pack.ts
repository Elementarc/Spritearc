import type { NextApiResponse } from 'next'
import fs from "fs"
import withAuth from '../../../middleware/withAuth'
import { Public_user, Pack, Pack_content, Formidable_files } from '../../../types'
// @ts-ignore: Unreachable code error
import formidable from 'formidable';
import del from 'del';
import { ObjectId } from 'mongodb'
import { create_user_pack, delete_pack, get_pack } from '../../../lib/mongo_lib';
import { validate_formidable_files, validate_license, validate_pack_description, validate_pack_section_name, validate_pack_tags, validate_pack_title, validate_single_formidable_file } from '../../../lib/validate_lib';


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
                const valid_section_name = validate_pack_section_name(section_name)

                if(valid_file === true && valid_section_name === true) {

                    //Checking if pack_directory already exists.
                    const exists = fs.existsSync(pack_directory)

                    //Creating directory when directory is not exisiting.
                    if(!exists) fs.mkdirSync(pack_directory)

                    //Creating files in the correct sturcture.
                    if(section_name.toLowerCase() === "preview") {

                        //Using given extention
                        if(file.originalFilename?.includes(".")) {
                            file.filepath = `${pack_directory}/${file.originalFilename?.toLowerCase()}`
                        } else {
                            console.log(file)
                            //Creating extention
                            file.filepath = `${pack_directory}/${file.originalFilename?.toLowerCase()}.${file.mimetype?.split("/")[1].toLowerCase()}`
                        }
                        
    
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

                } else {
                    console.log(`File: ${file.originalFilename} did not pass validations.`)
                }
             
            })
            
            //Function that creates a database entry
            function enter_pack_to_db(): Promise<boolean | string> {
                return new Promise((resolve, reject) => {

                    //Parsing FromData Files & Fields
                    form.parse(req, async(err, fields, files) => {
                        if(err) return reject(err);
                        
                        async function handle_body() {
                            
                            try {

                                if(! fields.title) throw new Error("No Title found!")
                                if(! fields.description) throw new Error("No Description found!")
                                if(! fields.tags) throw new Error("No Tags found!")
                                if(! fields.license) throw new Error("No License found!")
                                if(! files.preview ) throw new Error("No preview file found!")

                                
                                if(typeof fields.title !== "string") throw new Error("Only 1 title allowed!")
                                if(typeof fields.description !== "string") throw new Error("Only 1 description allowed!")
                                if(typeof fields.tags !== "string") throw new Error("Only 1 tag key allowed!")
                                if(typeof fields.license !== "string") throw new Error("Only 1 license allowed!")
                                if(Array.isArray(files.preview)) throw new Error("Only 1 preview allowed!")
                                //Validated body

                                const preview_file: any = files.preview
                                const tags = (()=> {
                                    try {
                                        let tags_none_json = (JSON.parse(fields.tags as string)as string[])
                                        return tags_none_json
                                    } catch ( err ) {
                                        return null
                                    }
                                    
                                })();

                                if(!tags) throw new Error("Please use a valid JSON Form")

                                const pack_files = files as unknown

                                const valid_files = validate_formidable_files(pack_files as Formidable_files)
                                const valid_title = validate_pack_title(fields.title as string)
                                const valid_description = validate_pack_description(fields.description as string)
                                const valid_license = validate_license(fields.license as string)
                                const valid_tags = validate_pack_tags(tags)

                                if(typeof valid_files === "string") throw new Error(`${valid_files}`)
                                if(typeof valid_title === "string") throw new Error(`${valid_title}`)
                                if(typeof valid_description === "string") throw new Error(`${valid_description}`)
                                if(typeof valid_tags === "string") throw new Error(`${valid_tags}`)
                                if(typeof valid_license === "string") throw new Error(`${valid_license}`)
                                //Passed validations

                                //Array that will be the content of a pack.
                                let pack_content: Pack_content[] = []
                                
                                //Checking how many props files obj has
                                let object_props = 0
                                for(let key in files) {
                                    object_props ++
                                }

                                if(object_props < 2) throw new Error("Object has not enough sections")
                                //Looping through FormData Obj Files.

                                for(let key in files) {
                                    
                                    //Checkign if object has preview property.
                                    const has_preview = files.hasOwnProperty("preview")
                                    if(!has_preview) throw new Error("Couldn't find preview file")

                                    const valid_section_name = validate_pack_section_name(key)

                                    if(typeof valid_section_name === "string") throw new Error("Sectionname didnt pass validations")

                                    
                                    //Logic for sections besides preview.
                                    if(key.toLocaleLowerCase() !== "preview") {

                                        //Creating an array with directories to specific file in the public folder.
                                        const section_images: string[] = []

                                        const files_arr: any = files[key]
                                        
                                        if(files_arr.length < 1) throw new Error("Pack needs to have atleast 1 assets!")
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
                                
                                resolve(true)

                            } catch( err ) {
                                return reject(err)
                            }
                        }

                        await handle_body()
                    })
                    

                })
            }
            
            await enter_pack_to_db()
            
            res.status(200).send({success: true, message: "Successfully created a pack!", pack_id: id})

        } catch (err) {
            const error: any = err
            //Deleting pack entry if something fails
            try {

                //Checking if part of the pack was created. Removing pack folder from filesystem.
                if(fs.existsSync(pack_directory)) del([pack_directory]);
                const pack = await get_pack(id)

                if(pack) await delete_pack(id, public_user)

                res.status(400).send({success: false, message:`${error.message}`})
                console.log(error.message)

            } catch( err ) {

                console.log(err)
                res.status(500).send({success: false, message:"Internal server issue."})

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
