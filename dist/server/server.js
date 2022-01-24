"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const url_1 = require("url");
const next_1 = __importDefault(require("next"));
const custom_lib_1 = require("../lib/custom_lib");
const mongo_lib_1 = require("../lib/mongo_lib");
const validate_lib_1 = require("../lib/validate_lib");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("cookie"));
const mongodb_1 = require("mongodb");
const formidable_1 = __importDefault(require("formidable"));
const crypto_js_1 = require("crypto-js");
const fs_1 = __importDefault(require("fs"));
const del_1 = __importDefault(require("del"));
const create_lib_1 = require("../lib/create_lib");
const nodemailer_lib_1 = require("../lib/nodemailer_lib");
const adm_zip_1 = __importDefault(require("adm-zip"));
require('dotenv').config();
const dev = process.env.NODE_ENV !== "production";
const server = express_1.default();
const app = next_1.default({ dev });
const handle = app.getRequestHandler();
//Middlewares
function parse_url(req, res, next) {
    const parsed_url = url_1.parse(req.url, true);
    const { pathname, query } = parsed_url;
    req.parsed_url = { pathname, query };
    next();
}
function with_auth(req, res, next) {
    try {
        const cookies = req.cookies;
        if (!cookies.user)
            return res.status(403).send("Not authorized!");
        const user = jsonwebtoken_1.default.verify(cookies.user, `${process.env.JWT_PRIVATE_KEY}`);
        if (!user)
            return res.status(403).send("Not authorized!");
        //adding user property to req stream
        req.user = user;
        req.token = cookies.user;
        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Invalid secret");
    }
}
//middleware that increases expire date of token
async function refresh_token(req, res, next) {
    const cookies = req.cookies;
    if (!cookies.user)
        return next();
    const user = jsonwebtoken_1.default.verify(cookies.user, `${process.env.JWT_PRIVATE_KEY}`);
    if (!user)
        return next();
    /* const public_user = await get_public_user(user.username)
    if(!public_user) return next()
    const refreshed_token = jwt.sign(public_user, process.env.JWT_PRIVATE_KEY as string) */
    //Setting cookie with token as value
    res.setHeader('Set-Cookie', cookie_1.default.serialize('user', cookies.user, {
        expires: new Date(Date.now() + 1000 * 60 * 15),
        httpOnly: true,
        path: "/",
        sameSite: "strict",
    }));
    next();
}
//function that updates user token.
async function update_token(req, res) {
    const cookies = req.cookies;
    if (!cookies.user)
        return false;
    const user = jsonwebtoken_1.default.verify(cookies.user, `${process.env.JWT_PRIVATE_KEY}`);
    if (!user)
        return false;
    const public_user = await mongo_lib_1.get_public_user(user.username);
    if (!public_user)
        return false;
    const refreshed_token = jsonwebtoken_1.default.sign(public_user, process.env.JWT_PRIVATE_KEY);
    res.setHeader('Set-Cookie', cookie_1.default.serialize('user', refreshed_token, {
        expires: new Date(Date.now() + 1000 * 60 * 15),
        httpOnly: true,
        path: "/",
        sameSite: "strict",
    }));
    return true;
}
server.use(parse_url);
server.use(cookie_parser_1.default());
server.use(express_1.default.json());
server.use(express_1.default.urlencoded({ extended: true }));
server.use(express_1.default.static("./dynamic_public"));
server.use("*", refresh_token);
server.use("/user/*", with_auth);
const password_regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,32}$/);
async function main() {
    //Creating a root user for a mongodb instance
    await mongo_lib_1.create_root_user();
    await app.prepare();
    server.listen(3000, () => { console.log("Server port: 3000"); });
    //User actions. User routes are protected by middleware withauth.
    server.post("/user/delete_pack", async (req, res) => {
        try {
            const user = req.user;
            const pack_id = req.query.id;
            const pack_directory = `./dynamic_public/packs/${pack_id}`;
            const pack_zip_file = `./pack_zips/${pack_id}.zip`;
            const delete_res = await mongo_lib_1.delete_pack(new mongodb_1.ObjectId(pack_id), user);
            if (!delete_res)
                throw "Couldnt delete file";
            const deleted_pack = await del_1.default([pack_directory]);
            fs_1.default.unlinkSync(pack_zip_file);
            res.status(200).send({ message: "Successfully deleted pack!" });
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong!");
        }
    });
    server.post("/user/create_pack", async (req, res) => {
        //Creating an object id
        const id = new mongodb_1.ObjectId();
        //Directory where the packs will be created at
        const pack_directory = `./dynamic_public/packs/${id}`;
        //Req user that initiated the create pack request
        const public_user = req.user;
        try {
            //Generator that is used for file names.
            function* id_generator() {
                let index = 0;
                while (true) {
                    yield index++;
                }
            }
            const id_gen = id_generator();
            let pack_content_map = new Map();
            let pack_info = {};
            await new Promise((resolve, reject) => {
                //Handles multiple files form.
                const form = new formidable_1.default.IncomingForm({ multiples: true, maxFileSize: 150 * 1024, allowEmptyFiles: false });
                form.parse(req, (err) => {
                    if (err)
                        return reject(err);
                });
                //Event that validates & creates files in the correct directory with the correct strutcure based of the pack content
                form.on("fileBegin", (section_name, file) => {
                    var _a;
                    try {
                        //Validating file
                        const valid_file = validate_lib_1.validate_single_formidable_file(file);
                        const valid_section_name = validate_lib_1.validate_pack_section_name(section_name);
                        if (valid_file === true && valid_section_name === true) {
                            //Checking if pack_directory already exists.
                            const exists = fs_1.default.existsSync(pack_directory);
                            //Creating directory when directory is not exisiting.
                            if (!exists)
                                fs_1.default.mkdirSync(pack_directory);
                            //Creating files in the correct sturcture.
                            if (section_name.toLowerCase() === "preview") {
                                function upload_file() {
                                    var _a, _b;
                                    if (!file.originalFilename)
                                        return;
                                    if (file.originalFilename.split(".").length > 2)
                                        return;
                                    //Using given extention
                                    if (file.originalFilename.includes(".")) {
                                        file.filepath = `${pack_directory}/preview.${file.originalFilename.split(".")[1]}`;
                                    }
                                    else {
                                        //Creating extention
                                        file.filepath = `${pack_directory}/preview.${(_a = file.mimetype) === null || _a === void 0 ? void 0 : _a.split("/")[1].toLowerCase()}`;
                                    }
                                    pack_content_map.set(`${section_name}`, `preview.${(_b = file.mimetype) === null || _b === void 0 ? void 0 : _b.split("/")[1].toLowerCase()}`);
                                }
                                upload_file();
                            }
                            else {
                                //Getting the extention from the file
                                const file_extention = `${(_a = file.mimetype) === null || _a === void 0 ? void 0 : _a.split("/")[1].toLowerCase()}`;
                                //Checking if directory exists with section_name
                                if (!fs_1.default.existsSync(`${pack_directory}/${section_name}`)) {
                                    //Creating directory when no directory with given section name exists
                                    fs_1.default.mkdirSync(`${pack_directory}/${section_name}`);
                                }
                                function upload_file() {
                                    const file_id = id_gen.next().value;
                                    if (!file.originalFilename)
                                        return;
                                    if (file.originalFilename.split(".").length > 2)
                                        return;
                                    file.filepath = `${pack_directory}/${section_name.toLowerCase()}/${section_name.toLowerCase()}_${file_id}.${file_extention}`;
                                    const section_images = pack_content_map.get(section_name);
                                    if (section_images) {
                                        pack_content_map.set(`${section_name}`, [...section_images, `${section_name.toLowerCase()}_${file_id}.${file_extention}`]);
                                    }
                                    else {
                                        pack_content_map.set(`${section_name}`, [`${section_name.toLowerCase()}_${file_id}.${file_extention}`]);
                                    }
                                }
                                upload_file();
                            }
                        }
                        else {
                            console.log(`File: ${file.originalFilename} did not pass validations.`);
                        }
                    }
                    catch (err) {
                        reject(err);
                    }
                });
                form.on("field", (name, value) => {
                    try {
                        const is_json = custom_lib_1.check_if_json(value);
                        if (is_json) {
                            pack_info[name] = JSON.parse(value);
                        }
                        else {
                            pack_info[name] = value;
                        }
                    }
                    catch (err) {
                        reject(err);
                    }
                });
                form.on("end", async () => {
                    try {
                        if (pack_content_map.size < 2)
                            throw new Error("Pack needs to contain atleast 1 Preview & 1 Section");
                        //Validating pack info
                        if (!pack_info.title)
                            throw new Error("No Title found!");
                        if (!pack_info.description)
                            throw new Error("No Description found!");
                        if (!pack_info.tags)
                            throw new Error("No Tags found!");
                        if (!pack_info.license)
                            throw new Error("No License found!");
                        const valid_title = validate_lib_1.validate_pack_title(pack_info.title);
                        const valid_description = validate_lib_1.validate_pack_description(pack_info.description);
                        const valid_license = validate_lib_1.validate_license(pack_info.license);
                        const valid_tags = validate_lib_1.validate_pack_tags(pack_info.tags);
                        if (typeof valid_title === "string")
                            throw new Error(`${valid_title}`);
                        if (typeof valid_description === "string")
                            throw new Error(`${valid_description}`);
                        if (typeof valid_tags === "string")
                            throw new Error(`${valid_tags}`);
                        if (typeof valid_license === "string")
                            throw new Error(`${valid_license}`);
                        //Pack info is valid
                        let pack_content = [];
                        for (let [section_name, section_images] of pack_content_map.entries()) {
                            const valid_section_name = validate_lib_1.validate_pack_section_name(section_name);
                            if (typeof valid_section_name === "string")
                                throw valid_section_name;
                            if (section_name !== "preview") {
                                pack_content.push({
                                    section_name: section_name,
                                    section_images: section_images
                                });
                            }
                        }
                        if (!pack_content_map.get("preview"))
                            throw new Error("Pack needs to contain a preview");
                        const pack = {
                            _id: id,
                            username: public_user.username,
                            preview: pack_content_map.get("preview"),
                            title: pack_info.title,
                            description: pack_info.description,
                            license: pack_info.license,
                            date: new Date(),
                            tags: pack_info.tags,
                            downloads: 0,
                            content: pack_content,
                            ratings: []
                        };
                        await mongo_lib_1.create_user_pack(pack);
                        //Pack got created!
                        //Creating Downlaodable zip file
                        const pack_zip = new adm_zip_1.default();
                        pack_zip.addLocalFolder(pack_directory);
                        pack_zip.writeZip(`./pack_zips/${id}.zip`);
                        resolve(true);
                    }
                    catch (err) {
                        console.log(err);
                        reject(err);
                    }
                });
            }).catch((err) => {
                throw err;
            });
            res.status(200).send({ success: true, message: "Successfully created a pack!", pack_id: id });
        }
        catch (err) {
            const error = err;
            //Deleting pack entry if something fails
            try {
                const pack_zip_file = `./pack_zips/${id}.zip`;
                //Checking if part of the pack was created. Removing pack folder from filesystem.
                if (fs_1.default.existsSync(pack_directory))
                    del_1.default([pack_directory]);
                fs_1.default.unlinkSync(pack_zip_file);
                const pack = await mongo_lib_1.get_pack(id);
                if (pack)
                    await mongo_lib_1.delete_pack(id, public_user);
                res.status(400).send({ success: false, message: `${error.message}` });
            }
            catch (err) {
                console.log(err);
                res.status(500).send({ success: false, message: "Internal server issue." });
            }
        }
    });
    server.post("/user/logout", async (req, res) => {
        const user = req.user;
        if (!user)
            return res.status(400).send("Please login to logout.");
        res.setHeader("Set-Cookie", cookie_1.default.serialize("user", "", {
            maxAge: -1,
            path: "/",
            httpOnly: true
        }));
        res.status(200).send("Successfully logged out!");
    });
    server.post("/user/is_auth", async (req, res) => {
        try {
            const user = req.user;
            res.status(200).send(Object.assign({ auth: true }, user));
        }
        catch (err) {
            res.status(400).send("Wrong secret");
        }
    });
    server.post("/user/rate_pack", async (req, res) => {
        try {
            const { rating } = req.body; // 0 - 4
            const pack_id = req.query.pack_id;
            const user = req.user;
            if (rating <= 0)
                return res.status(400).end();
            if (rating > 5)
                return res.status(400).end();
            if (!pack_id)
                return res.status(400).end();
            if (typeof pack_id !== "string")
                return res.status(400).end();
            const response = await mongo_lib_1.rate_pack(pack_id, rating, user.username);
            if (!response)
                return res.status(400).end();
            if (typeof response === "string")
                return res.status(400).send(response);
            return res.status(200).send(JSON.stringify({ user: user.username, rating: rating }));
        }
        catch (err) {
            console.log(err);
            return res.status(500).send("Something went wrong");
        }
    });
    server.post("/user/update_profile_image", async (req, res) => {
        const directory = "./dynamic_public/profile_pictures";
        try {
            const files_dir = fs_1.default.readdirSync(directory);
            const files_length = files_dir.length + 1;
            const form = new formidable_1.default.IncomingForm({ maxFileSize: 1000 * 1024, allowEmptyFiles: false });
            form.on("fileBegin", (key, file) => {
                const valid_profile_file = validate_lib_1.validate_profile_image(file);
                if (typeof valid_profile_file === "string")
                    return;
                if (!file.mimetype)
                    return;
                file.filepath = `${directory}/${req.user.username.toLowerCase()}.${file.mimetype.split("/")[1]}`;
            });
            try {
                await new Promise((resolve, reject) => {
                    try {
                        form.parse(req, async (err, fields, files) => {
                            if (err)
                                return reject(err);
                            const file = files.file;
                            if (!file)
                                return resolve(false);
                            if (!file.mimetype)
                                return resolve(false);
                            const valid_profile_file = validate_lib_1.validate_profile_image(file);
                            if (typeof valid_profile_file === "string")
                                return resolve(false);
                            const updated_response = await mongo_lib_1.update_user_profile_picture(req.user, `${req.user.username.toLowerCase()}.${file.mimetype.split("/")[1]}`);
                            resolve(true);
                        });
                    }
                    catch (err) {
                        console.log(err);
                    }
                });
                await update_token(req, res);
                res.status(200).send({ success: true, message: "Successfully changed profile picture" });
            }
            catch (err) {
                res.status(400).send({ success: false, message: "Something went wrong while trying to upload your profile picture." });
            }
        }
        catch (err) {
            console.log(err);
        }
    });
    server.post("/user/update_profile_banner", async (req, res) => {
        const directory = "./dynamic_public/profile_banners";
        console.log("Changing profile banner");
        try {
            const files_dir = fs_1.default.readdirSync(directory);
            const files_length = files_dir.length + 1;
            const form = new formidable_1.default.IncomingForm({ maxFileSize: 1000 * 1024, allowEmptyFiles: false });
            form.on("fileBegin", (key, file) => {
                const valid_profile_file = validate_lib_1.validate_profile_image(file);
                if (typeof valid_profile_file === "string")
                    return;
                if (!file.mimetype)
                    return;
                file.filepath = `${directory}/${req.user.username.toLowerCase()}.${file.mimetype.split("/")[1]}`;
            });
            try {
                await new Promise((resolve, reject) => {
                    try {
                        form.parse(req, async (err, fields, files) => {
                            if (err)
                                return reject(err);
                            const file = files.file;
                            if (!file)
                                return resolve(false);
                            if (!file.mimetype)
                                return resolve(false);
                            const valid_profile_file = validate_lib_1.validate_profile_image(file);
                            if (typeof valid_profile_file === "string")
                                return resolve(false);
                            const updated_response = await mongo_lib_1.update_user_profile_banner(req.user, `${req.user.username.toLowerCase()}.${file.mimetype.split("/")[1]}`);
                            resolve(true);
                        });
                    }
                    catch (err) {
                        console.log(err);
                    }
                });
                await update_token(req, res);
                res.status(200).send({ success: true, message: "Successfully changed profile picture" });
            }
            catch (err) {
                res.status(400).send({ success: false, message: "Something went wrong while trying to upload your profile picture." });
            }
        }
        catch (err) {
            console.log(err);
        }
    });
    server.post("/user/update_user_description", async (req, res, next) => {
        try {
            const { description } = req.body;
            const valid_description = validate_lib_1.validate_user_description(description);
            if (typeof valid_description === "string")
                return res.status(400).send(valid_description);
            const response = await mongo_lib_1.update_user_about(req.user, description);
            if (typeof response === "string")
                return res.status(500).send("Something went wrong while trying to update your about");
            await update_token(req, res);
            return res.status(200).send({ success: true, message: "Successfully updated about." });
        }
        catch (err) {
            console.log(err);
            res.status(500).send("We had problems to update your about");
        }
    });
    //Login
    server.post("/login", async (req, res) => {
        const cookies = req.cookies;
        if (cookies.user)
            return res.status(400).send("Please logout before login");
        //user is not logged in
        //Getting user Credentials from user
        const { email, password } = req.body;
        try {
            if (!email)
                return res.status(400).send("Couldn't find Email");
            if (!password)
                return res.status(400).send("Couldn't find password");
            const user = await mongo_lib_1.validate_user_credentials(email, password);
            if (typeof user === "string")
                return res.status(400).send(user);
            if (!user.verified)
                return res.status(401).send({ verified: false, email: user.email });
            //User exists in db.
            if (!user)
                return res.status(400).send("Something went wrong");
            //Getting public userobj by username from database
            const public_user = await mongo_lib_1.get_public_user(user.username);
            if (!public_user)
                return res.status(401).send("Couldn't find user");
            //Creating token
            const token = jsonwebtoken_1.default.sign(public_user, process.env.JWT_PRIVATE_KEY);
            //Setting cookie with token as value
            res.setHeader('Set-Cookie', cookie_1.default.serialize('user', token, {
                expires: new Date(Date.now() + 1000 * 60 * 60),
                httpOnly: true,
                path: "/",
                sameSite: "strict",
            }));
            res.status(200).send(public_user);
        }
        catch (err) {
            res.status(500).send("Couldn't log you in. something went wrong!");
        }
    });
    //Signup account
    server.post("/signup/validate_email", async (req, res) => {
        const email = req.body.email;
        if (!email)
            return res.status(400).send("Couldnt find email in body");
        try {
            const e_available = await mongo_lib_1.email_available(email);
            if (e_available) {
                res.status(200).send({ available: true });
            }
            else {
                res.status(400).send("Can't use that email.");
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
        }
    });
    server.post("/signup/validate_username", async (req, res) => {
        const username = req.body.username;
        if (!username)
            res.status(400).send("Couldnt find username in body.");
        try {
            const u_available = await mongo_lib_1.username_available(username);
            if (u_available) {
                res.status(200).send({ available: true });
            }
            else {
                res.status(400).send("Can't use that username.");
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
        }
    });
    server.post("/signup/send_account_verification", async (req, res) => {
        //Verification send with signup page.
        const { username, email, password, legal, occasional_emails } = req.body;
        let legal_init = false;
        let ocassional_emails_init = false;
        if (typeof legal === "string")
            legal_init = legal.toLowerCase() === "true" ? true : false;
        if (typeof legal === "boolean")
            legal_init = legal ? true : false;
        if (typeof occasional_emails === "string")
            ocassional_emails_init = occasional_emails.toLowerCase() === "true" ? true : false;
        if (typeof occasional_emails === "boolean")
            ocassional_emails_init = occasional_emails ? true : false;
        //Checking if signup object properties exist.
        if (!username || !email || !password || !legal_init)
            return res.status(400).send("Missing credentials!");
        //Validating userinputs. Also making call to backend to check if it already exists.
        const e_available = await mongo_lib_1.email_available(email);
        const u_available = await mongo_lib_1.username_available(username);
        const password_valid = password_regex.test(password);
        //Validating inputs
        if (!e_available || !u_available || !password_valid)
            return res.status(403).send("Credentials didn't pass validations!");
        //Passed all tests
        //Creating salt to hash password
        let salt = "";
        const ascii_string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 32; i++) {
            const random_number = Math.floor(Math.random() * ascii_string.length - 1);
            salt += ascii_string.charAt(random_number);
        }
        const hashed_password = crypto_js_1.SHA256(password + salt).toString();
        try {
            //Creating user_obj from user input
            const user_obj = create_lib_1.create_default_user(username, email, hashed_password, salt, ocassional_emails_init);
            const user_res = await mongo_lib_1.create_user(user_obj);
            if (typeof user_res === "string")
                return res.status(500).send(user_res);
            res.status(200).send("Successfully created your account!");
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong while trying to create your account.");
        }
    });
    server.post("/signup/resend_email_confirmation", async (req, res) => {
        //Getting user email
        const { email } = req.body;
        //Connecting to database
        try {
            const user = await mongo_lib_1.get_user_by_email(email);
            if (typeof user === "string")
                return user;
            const token_res = await mongo_lib_1.create_account_verification_token(user._id);
            if (typeof token_res === "string")
                return token_res;
            const email_res = await nodemailer_lib_1.send_email_verification(user.email, `Hey please confirm your email address by clicking on this link: ${process.env.FULL_DOMAIN}/verify_account?token=${token_res.token}`);
            if (!email_res)
                return res.status(400).send("Could'nt send email verification");
            res.status(200).send("Successfully send an email!");
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong while trying to create your account.");
        }
    });
    server.post("/signup/verify_account", async (req, res) => {
        const { token } = req.body;
        //0 = successfull 1 = token expires string = error
        const response = await mongo_lib_1.verify_user_account(token);
        console.log("response: ", response);
        if (typeof response === "string")
            return res.status(400).send(response);
        if (response === 0)
            return res.status(200).send({ success: true, message: "Successfully verified account." });
        if (response === 1)
            return res.status(200).send({ success: false, message: "Token Expired!" });
    });
    //Packs
    server.post("/search/:search_query", async (req, res) => {
        try {
            const packs_per_page = 8;
            const user_search = req.params.search_query;
            const page = req.query.page;
            if (typeof user_search !== "string")
                return res.status(400).end();
            if (typeof page !== "string")
                return res.status(400).end();
            const valid_tag = validate_lib_1.validate_pack_tag(user_search);
            if (typeof valid_tag === "string")
                return res.status(400).send("didnt pass validation");
            const found_packs_obj = await mongo_lib_1.get_pack_by_tag(user_search.toLowerCase());
            if (!found_packs_obj)
                return res.status(200).send({ packs: [], max_page: 0 });
            const max_page = Math.ceil(found_packs_obj.collection_size / packs_per_page);
            res.status(200).send({ packs: found_packs_obj.packs_found.slice(0, packs_per_page * parseInt(page)), max_page: max_page });
        }
        catch (err) {
            res.status(500).send("Something went wrong!");
        }
    });
    server.post("/recent_packs", async (req, res) => {
        try {
            const page = req.query.page;
            const packs_per_page = 8;
            const page_int = custom_lib_1.create_number_from_page_query(page);
            if (typeof page_int !== "number")
                return res.status(400);
            //gettings packs from db
            const packs = await mongo_lib_1.get_recent_packs(packs_per_page * page_int);
            const collection_count = await mongo_lib_1.get_packs_collection_size();
            if (!packs)
                return res.status(200).send({ packs: [], max_page: 0 });
            if (typeof collection_count !== "number")
                return res.status(500).end();
            const max_page = Math.ceil(collection_count / packs_per_page);
            res.status(200).send({ packs: packs, max_page: max_page });
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong!");
        }
    });
    server.post("/title_pack", async (req, res) => {
        try {
            const title_pack = await mongo_lib_1.get_title_pack();
            if (!title_pack)
                return res.status(500).end();
            if (!title_pack)
                return res.status(200).send({ body: [] });
            res.status(200).send({ pack: title_pack });
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong!");
        }
    });
    server.post("/user_packs", async (req, res) => {
        const packs_per_page = 8;
        try {
            const page = req.query.page;
            const page_int = custom_lib_1.create_number_from_page_query(page);
            if (typeof page_int !== "number")
                return res.status(400);
            const pack_id_arr = req.body;
            const packs = await mongo_lib_1.get_released_packs_by_user(pack_id_arr);
            const max_page = Math.ceil(packs.length / packs_per_page);
            res.status(200).send({ packs: packs.slice(0, packs_per_page * page_int), max_page: max_page });
        }
        catch (err) {
            console.log(err);
            res.status(500).send("something went wrong!");
        }
    });
    server.post("/report_pack", async (req, res) => {
        try {
            const pack_id = req.query.pack_id;
            const { reason } = req.body;
            const valid_reason = validate_lib_1.validate_pack_report_reason(reason);
            if (!valid_reason)
                return res.status(400).end();
            if (!pack_id)
                return res.status(400).end();
            if (typeof pack_id !== "string")
                return res.status(400).end();
            const report_pack_response = await mongo_lib_1.report_pack(pack_id, reason);
            if (typeof report_pack_response === "string")
                return res.status(400).send({ success: false, message: report_pack_response });
            return res.status(200).send({ success: true, message: "Successfully reported this pack!" });
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong!");
        }
    });
    server.get("/download_pack", async (req, res) => {
        const pack_id = req.query.pack_id;
        try {
            if (!pack_id)
                return res.status(400).send("No Pack_id found");
            if (!mongodb_1.ObjectId.isValid(pack_id))
                return res.status(400).send("Invalid pack id");
            const pack_directory = `./pack_zips/${pack_id}.zip`;
            await mongo_lib_1.update_pack_download_count(new mongodb_1.ObjectId(pack_id));
            res.download(pack_directory);
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong while trying to start your download");
        }
    });
    //App
    server.get("/", (req, res) => {
        console.log("Got request /");
        app.render(req, res, "/index");
    });
    server.get("/news", (req, res) => {
        app.render(req, res, "/news");
    });
    server.get("/news/:patchId", (req, res) => {
        app.render(req, res, "/news/patchId", req.params, req.parsed_url.query);
    });
    server.get("/browse", (req, res) => {
        app.render(req, res, "/browse");
    });
    server.get("/pack", (req, res) => {
        app.render(req, res, "/pack", req.parsed_url.query);
    });
    server.get("/search", (req, res) => {
        app.render(req, res, "/search");
    });
    server.get("/login", (req, res) => {
        app.render(req, res, "/login");
    });
    server.get("/account", (req, res) => {
        const user = req.user;
        app.render(req, res, "/account");
    });
    server.get("/signup", (req, res) => {
        app.render(req, res, "/signup");
    });
    server.get("/create_pack", (req, res) => {
        app.render(req, res, "/create_pack");
    });
    server.get("/profile", (req, res) => {
        app.render(req, res, "/profile", req.parsed_url.query);
    });
    server.get("/verify_account", (req, res) => {
        app.render(req, res, "/verify_account", req.parsed_url.query);
    });
    server.get("/tos", (req, res) => {
        app.render(req, res, "/tos");
    });
    server.all("*", (req, res) => {
        const parsed_url = url_1.parse(req.url, true);
        return handle(req, res, parsed_url);
    });
}
main();
