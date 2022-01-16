import express from "express"
import {parse} from "url"
import next from "next"
import { create_number_from_page_query } from "../lib/custom_lib"
import { create_user, add_pack_to_user, delete_pack, get_user_by_email, email_available, get_pack, get_packs_collection_size, get_pack_by_tag, get_public_user, get_recent_packs, get_released_packs_by_user, get_title_pack, username_available, validate_user_credentials, create_account_verification_token, verify_user_account, report_pack, rate_pack, update_user_profile_picture, update_user_profile_banner } from "../lib/mongo_lib"
import { validate_formidable_files, validate_pack_tags, validate_license, validate_pack_description, validate_pack_section_name, validate_pack_tag, validate_pack_title, validate_single_formidable_file, validate_pack_report_reason, validate_profile_image } from "../lib/validate_lib"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import { Public_user , Pack, Pack_content, Formidable_files, Formidable_file} from "../types"
import cookie from "cookie"
import { ObjectId } from "mongodb"
import formidable from "formidable"
import { SHA256 } from "crypto-js"
import fs from "fs"
import del from "del"
import { create_default_user } from "../lib/create_lib"
import { send_email_verification } from "../lib/nodemailer_lib"

const dev = process.env.NODE_ENV !== "production"
const server = express()
const app = next({dev})
const handle = app.getRequestHandler()

//Middlewares
function parse_url(req: any, res:any, next:any) {
    const parsed_url = parse(req.url, true)
    const {pathname, query} = parsed_url
    req.parsed_url = {pathname, query}

    next()
}
function with_auth(req:any, res: any, next: any) {

    try {

        const cookies = req.cookies
        if(!cookies.user) return res.status(403).send("Not authorized!")

        const user = jwt.verify(cookies.user, `${process.env.JWT_PRIVATE_KEY}`)
        if(!user) return res.status(403).send("Not authorized!")
        
        //adding user property to req stream
        req.user = user as Public_user
        req.token = cookies.user
        next()
    } catch ( err ) {

        console.log(err)
        res.status(500).send("Invalid secret")

    }
    
}

server.use(parse_url)
server.use(cookieParser())
server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use(express.static("./dynamic_public"))
server.use("/user/*", with_auth)


const password_regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,32}$/)

async function main() {
    await app.prepare()
    server.listen(3000, () => {console.log("Server port: 3000")})

    //User actions. User routes are protected by middleware withauth.
    server.post("/user/delete_pack", async(req: any,res) => {

        try { 
            const user = req.user as Public_user
            const pack_id = req.query.id as string
            const pack_directory = `./dynamic_public/packs/${pack_id}`

            const delete_res = await delete_pack(new ObjectId(pack_id), user)

            if(!delete_res) throw "Couldnt delete file"

            const deleted_paths = await del([pack_directory])
            
            res.status(200).send({message: "Successfully deleted pack!"})

        } catch (err) {

            console.log(err)
            res.status(500).send("Something went wrong!")

        }

    })
    server.post("/user/create_pack", async(req: any,res) => {
        //Creating an object id
        const id = new ObjectId()
        //Directory where the packs will be created at
        const pack_directory = `./dynamic_public/packs/${id}`

        //Req user that initiated the create pack request
        const public_user: Public_user = req.user
        
        try {
            //Handles multiple files form.
            const form = new formidable.IncomingForm({multiples: true, maxFileSize: 150 * 1024, allowEmptyFiles: false});
            
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
                            file.filepath = `${pack_directory}/preview.${file.originalFilename.split(".")[1]}`
                        } else {
                            //Creating extention
                            file.filepath = `${pack_directory}/preview.${file.mimetype?.split("/")[1].toLowerCase()}`
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
            
            try{

                await new Promise((resolve, reject) => {

                    try {
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
                                            let new_tags = []
    
                                            for(let tag of tags_none_json) {
                                                new_tags.push(tag.toLowerCase())
                                            } 
    
                                            return new_tags
    
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
                                        tags: tags,
                                        downloads: 0,
                                        content: pack_content,
                                        ratings: []
                                    } 
    
                                    //Creating database entry for a pack.
                                    await add_pack_to_user(pack)
                                    
                                    //create_user_pack()
                                    
                                    resolve(true)
    
                                } catch( err ) {
                                    return reject(err)
                                }
                            }
    
                            await handle_body()
                        })
                    } catch(err) {
                        console.log(err)
                    }
                })
                res.status(200).send({success: true, message: "Successfully created a pack!", pack_id: id})
            } catch(err) {
                console.log(err)
                res.status(500).send("Something went wrong while trying to create your pack! Sorry")
            }

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
    })
    server.post("/user/logout", async(req: any, res) => {
        const user = req.user

        if(!user) return res.status(400).send("Please login to logout.")

        res.setHeader("Set-Cookie", cookie.serialize("user", "", {
            maxAge: -1,
            path: "/",
            httpOnly: true
        }))
        
        res.status(200).send("Successfully logged out!")
    })
    server.post("/user/is_auth", async(req: any, res) => {
        try {
            const user = req.user
            
            res.status(200).send({auth: true, ...user})

        } catch ( err ) {
            res.status(400).send("Wrong secret")
        }
        
    })
    server.post("/user/rate_pack", async(req:any, res) => {
        const {rating} = req.body as {rating: number} // 0 - 4
        const pack_id = req.query.pack_id as string | string[] | undefined
        const user = req.user as Public_user
        if(rating <= 0) return res.status(400).end()
        if(rating > 5) return res.status(400).end()
        if(!pack_id) return res.status(400).end()
        if(typeof pack_id !== "string") return res.status(400).end()

        const response = await rate_pack(pack_id, rating, user.username) 
        if(!response) return res.status(400).end()
        if(typeof response === "string") return res.status(400).send(response)
        console.log(user.username, rating)
        return res.status(200).send(JSON.stringify({user: user.username, rating: rating}))
    })
    server.post("/user/change_profile_image", async(req: any, res) =>{
        const directory = "./dynamic_public/profile_pictures"
        console.log("Changing profile image")
        try {
            const files_dir = fs.readdirSync(directory)
            const files_length = files_dir.length + 1
            const form = new formidable.IncomingForm({maxFileSize: 1000 * 1024, allowEmptyFiles: false});
            
            form.on("fileBegin", (key, file) => {
                
                const valid_profile_file = validate_profile_image(file)
                if(typeof valid_profile_file === "string") return
                if(!file.mimetype) return
                

                file.filepath = `${directory}/${req.user.username.toLowerCase()}.${file.mimetype.split("/")[1]}`
            })

            try {

                await new Promise((resolve,reject) => {
                    try {
    
                        form.parse(req, async(err, fields, files) => {
                            if(err) return reject(err);
        
                            const file = files.file as Formidable_file | null
                            if(!file) return resolve(false)
                            if(!file.mimetype) return resolve(false)
        
                            const valid_profile_file = validate_profile_image(file)
                            if(typeof valid_profile_file === "string") return resolve(false)
        
                            
                            const updated_response = await update_user_profile_picture(req.user as Public_user, `${req.user.username.toLowerCase()}.${file.mimetype.split("/")[1]}`)
                            
                            resolve(true)
                        })
    
                    } catch( err ) {
                        console.log(err)
                    }
                })
                
                res.status(200).send({success:true, message: "Successfully changed profile picture"})
            } catch(err) {
                res.status(400).send({success: false, message: "Something went wrong while trying to upload your profile picture."})
            }
            
        } catch( err ) {
            console.log(err)
        }
        
    })
    server.post("/user/change_profile_banner", async(req: any, res) =>{
        const directory = "./dynamic_public/profile_banners"
        console.log("Changing profile banner")
        try {
            const files_dir = fs.readdirSync(directory)
            const files_length = files_dir.length + 1
            const form = new formidable.IncomingForm({maxFileSize: 1000 * 1024, allowEmptyFiles: false});
            
            form.on("fileBegin", (key, file) => {
                
                const valid_profile_file = validate_profile_image(file)
                if(typeof valid_profile_file === "string") return
                if(!file.mimetype) return
                

                file.filepath = `${directory}/${req.user.username.toLowerCase()}.${file.mimetype.split("/")[1]}`
            })

            try {

                await new Promise((resolve,reject) => {
                    try {
    
                        form.parse(req, async(err, fields, files) => {
                            if(err) return reject(err);
        
                            const file = files.file as Formidable_file | null
                            if(!file) return resolve(false)
                            if(!file.mimetype) return resolve(false)
        
                            const valid_profile_file = validate_profile_image(file)
                            if(typeof valid_profile_file === "string") return resolve(false)
        
                            console.log("TEst")
                            const updated_response = await update_user_profile_banner(req.user as Public_user, `${req.user.username.toLowerCase()}.${file.mimetype.split("/")[1]}`)
                            
                            resolve(true)
                        })
    
                    } catch( err ) {
                        console.log(err)
                    }
                })
                
                res.status(200).send({success:true, message: "Successfully changed profile picture"})
            } catch(err) {
                res.status(400).send({success: false, message: "Something went wrong while trying to upload your profile picture."})
            }
            
        } catch( err ) {
            console.log(err)
        }
        
    })
    //Login
    server.post("/login", async(req, res) => {
        const cookies = req.cookies
        if(cookies.user) return res.status(400).send("Please logout before login")
        //user is not logged in

        
        //Getting user Credentials from user
        const { email, password } = req.body as {email: string, password: string}
        

        try {
            if(!email) return res.status(400).send("Couldn't find Email")
            if(!password) return res.status(400).send("Couldn't find password")

            const user = await validate_user_credentials(email, password)

            if(typeof user === "string") return res.status(400).send(user)
            if(!user.verified) return res.status(401).send({verified: false, email: user.email})
            //User exists in db.
            
            if(!user) return res.status(400).send("Something went wrong")
            
                
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
            
        } catch ( err ) {

            res.status(500).send("Couldn't log you in. something went wrong!")

        }
    })

    //Signup account
    server.post("/signup/validate_email", async(req,res) => {
        const email = req.body.email
        if(!email) return res.status(400).send("Couldnt find email in body")

        try {

            const e_available = await email_available(email)
            
            
            if(e_available) {

                res.status(200).send({available: true})

            } else {
                
                res.status(400).send("Can't use that email.")

            }

        } catch ( err ) {

            console.log(err)
            res.status(500).send("Something went wrong")

        }
    })
    server.post("/signup/validate_username", async(req,res) => {
        const username = req.body.username
        if(!username) res.status(400).send("Couldnt find username in body.")

        try {

            const u_available = await username_available(username)

            if(u_available) {

                res.status(200).send({available: true})

            } else {
                
                res.status(400).send("Can't use that username.")

            }

        } catch ( err ) {

            console.log(err)
            res.status(500).send("Something went wrong")

        }
    })
    server.post("/signup/send_account_verification", async(req,res) => {
        //Verification send with signup page.
        const { username, email, password, legal, occasional_emails } =  req.body as {username: string, email: string, password: string, legal: string | boolean, occasional_emails: string | boolean}
        let legal_init = false
        let ocassional_emails_init = false
        if(typeof legal === "string") legal_init = legal.toLowerCase() === "true" ? true : false
        if(typeof legal === "boolean") legal_init = legal ? true : false
        if(typeof occasional_emails === "string") ocassional_emails_init = occasional_emails.toLowerCase() === "true" ? true : false
        if(typeof occasional_emails === "boolean") ocassional_emails_init = occasional_emails ? true : false
        
        //Checking if signup object properties exist.
        if(!username || !email || !password || !legal_init) return res.status(400).send("Missing credentials!")
        
        //Validating userinputs. Also making call to backend to check if it already exists.
        const e_available = await email_available(email)
        const u_available = await username_available(username)
        const password_valid = password_regex.test(password)
        
        //Validating inputs
        if(!e_available || !u_available || !password_valid) return res.status(403).send("Credentials didn't pass validations!")
       
        //Passed all tests

        //Creating salt to hash password
        let salt = ""
        const ascii_string= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        for(let i = 0; i < 32; i ++) {
            const random_number = Math.floor(Math.random() * ascii_string.length - 1)
            
            salt += ascii_string.charAt(random_number)
        }
        
        const hashed_password = SHA256(password + salt).toString()


        
        try {
            //Creating user_obj from user input
            const user_obj =  create_default_user(username, email, hashed_password, salt, ocassional_emails_init)
        
            const user_res = await create_user(user_obj)

            if(typeof user_res === "string") return res.status(500).send(user_res)

            
            
            res.status(200).send("Successfully created your account!")

        } catch ( err ) {

            console.log(err)
            res.status(500).send("Something went wrong while trying to create your account.")

        }

    })
    server.post("/signup/resend_email_confirmation", async(req,res) => {
        //Getting user email
        const { email } =  req.body as {email: string}

        //Connecting to database
        try {
            
            const user = await get_user_by_email(email) 
            if(typeof user === "string") return user
            
            const token_res = await create_account_verification_token(user._id)
            if(typeof token_res === "string") return token_res
            
            const email_res = await send_email_verification(user.email, `Hey please confirm your email address by clicking on this link: ${process.env.FULL_DOMAIN}/verify_account?token=${token_res.token}`)
            if(!email_res) return res.status(400).send("Could'nt send email verification")
            res.status(200).send("Successfully send an email!")

        } catch ( err ) {

            console.log(err)
            res.status(500).send("Something went wrong while trying to create your account.")

        }

    })
    server.post("/signup/verify_account", async(req,res) => {
        const {token} = req.body
        //0 = successfull 1 = token expires string = error
        const response = await verify_user_account(token as string)

        console.log("response: ", response)
        if(typeof response === "string") return res.status(400).send(response)
        if(response === 0) return res.status(200).send({success: true, message: "Successfully verified account."})
        if(response === 1) return res.status(200).send({success: false, message: "Token Expired!"})
    })

    //Packs
    server.post("/search/:search_query", async(req, res) => {
        try {
            const packs_per_page = 8
            const user_search = req.params.search_query
            const page = req.query.page
            if(typeof user_search !== "string") return res.status(400).end()
            if(typeof page !== "string") return res.status(400).end()

            const valid_tag = validate_pack_tag(user_search)

            if(typeof valid_tag === "string") return res.status(400).send("didnt pass validation")
            const found_packs_obj =  await get_pack_by_tag(user_search.toLowerCase())

            if(!found_packs_obj) return res.status(200).send({packs: [], max_page: 0})

            const max_page = Math.ceil(found_packs_obj.collection_size / packs_per_page)

            res.status(200).send({packs: found_packs_obj.packs_found.slice(0, packs_per_page * parseInt(page)), max_page: max_page})

        } catch( err ) {
            res.status(500).send("Something went wrong!")
        }
    })
    server.post("/recent_packs", async(req, res) => {
        
        try {
            const page = req.query.page
            const packs_per_page = 8
            const page_int = create_number_from_page_query(page as any)
            if(typeof page_int !== "number") return res.status(400)
            
            //gettings packs from db
            const packs = await get_recent_packs(packs_per_page * page_int)
            const collection_count = await get_packs_collection_size()
            
            if(!packs) return res.status(200).send({packs: [], max_page: 0})
            if(typeof collection_count !== "number") return res.status(500).end()

            const max_page = Math.ceil(collection_count / packs_per_page)
            res.status(200).send({packs: packs, max_page: max_page})

        } catch (err) {

            console.log(err)
            res.status(500).send("Something went wrong!")

        }
    })
    server.post("/title_pack", async(req,res) => {

        try {
            
            const title_pack: Pack | null = await get_title_pack()
            
            if(!title_pack) return res.status(500).end()
            
            if(!title_pack) return res.status(200).send({body: []})

            res.status(200).send({pack: title_pack})

        } catch (err) {

            console.log(err)
            res.status(500).send("Something went wrong!")

        }
    })
    server.post("/user_packs", async(req,res) => {
        const packs_per_page = 8

        try {
            
            const page = req.query.page as string
            const page_int = create_number_from_page_query(page)
            if(typeof page_int !== "number") return res.status(400)

            const pack_id_arr = req.body as string[]
            const packs = await get_released_packs_by_user(pack_id_arr)
            const max_page = Math.ceil(packs.length / packs_per_page)

            res.status(200).send({packs: packs.slice(0, packs_per_page * page_int), max_page: max_page})

        } catch ( err ) {

            console.log(err)
            res.status(500).send("something went wrong!")

        }
    })
    server.post("/report_pack", async(req, res) => {
        
        try {
            const pack_id = req.query.pack_id
            const {reason}: {reason: string} = req.body
            const valid_reason = validate_pack_report_reason(reason)
            
            if(!valid_reason) return res.status(400).end()
            if(!pack_id) return res.status(400).end()
            if(typeof pack_id !== "string") return res.status(400).end()

            const report_pack_response = await report_pack(pack_id, reason)

            if(typeof report_pack_response === "string") return res.status(400).send({success: false, message: report_pack_response})
            return res.status(200).send({success: true, message: "Successfully reported this pack!"})

        } catch (err) {

            console.log(err)
            res.status(500).send("Something went wrong!")

        }
    })

    //App
    server.get("/", (req, res) => {
        console.log("Got request /")
        app.render(req,res, "/index")
    })
    server.get("/news", (req,res) => {
        app.render(req,res, "/news")
    })
    server.get("/news/:patchId", (req:any,res) => {
        app.render(req,res, "/news/patchId", req.params, req.parsed_url.query)
    })
    server.get("/browse", (req,res) => {
        app.render(req,res, "/browse")
    })
    server.get("/pack", (req: any, res) => {

        app.render(req,res, "/pack", req.parsed_url.query)
    })
    server.get("/search", (req,res) => {
        app.render(req,res, "/search")
    })
    server.get("/login", (req,res) => {

        app.render(req,res,"/login")
    })
    server.get("/account", (req: any,res) => {
        const user = req.user

        app.render(req,res, "/account")
    })
    server.get("/signup", (req,res) => {
        app.render(req,res, "/signup")
    })
    server.get("/create_pack", (req,res) => {
        app.render(req,res,"/create_pack")
    })
    server.get("/profile", (req: any,res) => {
        app.render(req,res, "/profile", req.parsed_url.query)
    })
    server.get("/verify_account", (req: any,res) => {
        app.render(req,res, "/verify_account", req.parsed_url.query)
    })
    server.all("*", (req,res) => {
        const parsed_url = parse(req.url, true)
        return handle(req, res, parsed_url)
    })

}

main()