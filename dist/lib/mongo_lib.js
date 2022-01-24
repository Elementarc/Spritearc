"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.report_pack = exports.rate_pack = exports.validate_user_credentials = exports.verify_user_account = exports.create_account_verification_token = exports.get_user_by_email = exports.update_pack_download_count = exports.create_user_pack = exports.create_user = exports.get_packs_collection_size = exports.get_pack_by_tag = exports.get_recent_packs = exports.get_title_pack = exports.get_pack = exports.update_user_about = exports.update_user_profile_banner = exports.update_user_profile_picture = exports.delete_pack = exports.username_available = exports.email_available = exports.get_released_packs_by_user = exports.get_public_user = exports.create_root_user = exports.SORT_ACTIONS = void 0;
const mongodb_1 = require("mongodb");
const crypto_js_1 = require("crypto-js");
const nodemailer_lib_1 = require("./nodemailer_lib");
const client = new mongodb_1.MongoClient("mongodb://localhost:27017");
const DATABASE = "spritearc";
exports.SORT_ACTIONS = {
    BY_RATING: "BY_RATING",
    BY_DOWNLOADS: "BY_DOWNLOADS",
    BY_DATE: "BY_DATE"
};
async function create_root_user() {
    try {
        await client.connect();
        const username = process.env.MONGO_ROOT_USERNAME;
        const password = process.env.MONGO_ROOT_PASSWORD;
        if (!username)
            throw new Error("Couldnt find a username for mongo root user");
        if (!password)
            throw new Error("Couldnt find a password for mongo root user");
        const db = client.db("admin");
        await db.addUser(username, password, { roles: ["root"] });
        console.log("successfully created root user");
    }
    catch (err) {
        console.log(err);
    }
}
exports.create_root_user = create_root_user;
const email_regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
const username_regex = new RegExp(/^(?=.{3,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/);
//Function that returns a public user obj from db. Null if given username wasnt found
async function get_public_user(username) {
    try {
        await client.connect();
        const db = client.db(DATABASE);
        const collection = db.collection("users");
        const user = await collection.aggregate([
            {
                $project: {
                    username_uppercase: { $toUpper: "$username" },
                    username: "$username",
                    description: "$description",
                    created_at: "$created_at",
                    role: "$role",
                    profile_picture: "$profile_picture",
                    profile_banner: "$profile_banner",
                    followers: "$followers",
                    following: "$following",
                    released_packs: "$released_packs"
                }
            },
            {
                $match: {
                    username_uppercase: username.toUpperCase()
                }
            }
        ]).toArray();
        //No user with that username exists
        if (user.length === 0)
            return null;
        //User exists
        const public_user_obj = Object.assign({}, user[0]);
        delete public_user_obj.username_uppercase;
        delete public_user_obj._id;
        const public_user = Object.assign({}, public_user_obj);
        return public_user;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}
exports.get_public_user = get_public_user;
async function get_released_packs_by_user(pack_id_arr) {
    try {
        await client.connect();
        const packs_collection = client.db(DATABASE).collection("packs");
        const user_packs = [];
        for (let pack_id of pack_id_arr) {
            const pack_id_valid = mongodb_1.ObjectId.isValid(pack_id);
            if (pack_id_valid) {
                const pack = await packs_collection.findOne({ _id: new mongodb_1.ObjectId(pack_id) });
                if (pack) {
                    user_packs.push(pack);
                }
            }
        }
        return user_packs;
    }
    catch (err) {
        throw err;
    }
}
exports.get_released_packs_by_user = get_released_packs_by_user;
async function email_available(email) {
    try {
        if (typeof email !== "string")
            return false;
        if (email_regex.test(email) === false)
            return false;
        await client.connect();
        const collection = client.db(DATABASE).collection("users");
        const aggregated_response = await collection.aggregate([
            {
                $project: {
                    email: { $toUpper: "$email" },
                },
            },
            {
                $match: { email: email.toUpperCase() }
            }
        ]).toArray();
        if (aggregated_response.length > 0) {
            return false;
        }
        else {
            return true;
        }
    }
    catch (err) {
        throw err;
    }
}
exports.email_available = email_available;
async function username_available(username) {
    try {
        const username_regex = new RegExp(/^(?=.{3,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/);
        if (typeof username !== "string")
            return false;
        if (username_regex.test(username) === false)
            return false;
        await client.connect();
        const collection = client.db(DATABASE).collection("users");
        const aggregated_response = await collection.aggregate([
            {
                $project: {
                    username: { $toUpper: "$username" },
                },
            },
            {
                $match: { username: username.toUpperCase() }
            }
        ]).toArray();
        if (aggregated_response.length > 0) {
            return false;
        }
        else {
            return true;
        }
    }
    catch (err) {
        throw err;
    }
}
exports.username_available = username_available;
async function delete_pack(pack_id, signed_user) {
    try {
        await client.connect();
        const user_collection = client.db(DATABASE).collection("users");
        const packs_collection = client.db(DATABASE).collection("packs");
        const user = await user_collection.findOne({ username: signed_user.username });
        if (!user)
            return false;
        const pack = await packs_collection.findOne({ _id: pack_id });
        if (!pack)
            return false;
        if (signed_user.username === pack.username || user.role === "admin") {
            //Deleting pack
            await packs_collection.deleteOne({ _id: pack_id });
            //Updating released_packs from user Obj
            const users_collection = client.db(DATABASE).collection("users");
            await users_collection.updateOne({ username: signed_user.username }, { $pull: { "released_packs": pack_id.toString() } });
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
exports.delete_pack = delete_pack;
async function update_user_profile_picture(public_user, filename) {
    try {
        await client.connect();
        const user_collection = client.db(DATABASE).collection("users");
        const response = await user_collection.updateOne({ username: public_user.username }, { $set: { profile_picture: filename.toLowerCase() } });
        return response.acknowledged;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
exports.update_user_profile_picture = update_user_profile_picture;
async function update_user_profile_banner(public_user, filename) {
    console.log("Updating user banner");
    try {
        await client.connect();
        const user_collection = client.db(DATABASE).collection("users");
        const response = await user_collection.updateOne({ username: public_user.username }, { $set: { profile_banner: filename.toLowerCase() } });
        console.log(response);
        return response.acknowledged;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
exports.update_user_profile_banner = update_user_profile_banner;
async function update_user_about(public_user, description) {
    try {
        await client.connect();
        const user_collection = client.db(DATABASE).collection("users");
        const update_response = await user_collection.updateOne({ username: public_user.username }, { $set: { description: description } });
        console.log(update_response);
        if (update_response.acknowledged)
            return true;
        return "Couldnt Update about";
    }
    catch (err) {
        console.log(err);
        return "Something went wrong while trying to update about section of a user.";
    }
}
exports.update_user_about = update_user_about;
async function get_pack(pack_id) {
    try {
        //Checking if query pack id is a valid ObjectId
        await client.connect();
        const packs_collection = client.db(DATABASE).collection("packs");
        const pack = await packs_collection.findOne({ _id: new mongodb_1.ObjectId(`${pack_id}`) });
        if (!pack)
            return null;
        return pack;
    }
    catch (err) {
        throw err;
    }
}
exports.get_pack = get_pack;
async function get_title_pack() {
    try {
        await client.connect();
        const collection = client.db(DATABASE).collection("packs");
        const pack = await collection.aggregate([
            {
                $sample: { size: 1 }
            }
        ]).toArray();
        return pack[0];
    }
    catch (err) {
        console.log(err);
        return null;
    }
}
exports.get_title_pack = get_title_pack;
async function get_recent_packs(number_of_returns, sort_action) {
    try {
        //Connecting to database
        await client.connect();
        //Choosing db
        const db = client.db(DATABASE);
        //Returning 12 Packs Ordered by Date.
        const recent_packs = await db.collection("packs").find({}).sort({ date: -1 }).limit(number_of_returns).toArray();
        if (recent_packs.length > 0) {
            return recent_packs;
        }
        else {
            return null;
        }
    }
    catch (err) {
        throw err;
    }
}
exports.get_recent_packs = get_recent_packs;
async function get_pack_by_tag(tag) {
    try {
        //Connecting to database
        await client.connect();
        //Choosing db
        const db = client.db(DATABASE);
        const packs_found = await db.collection("packs").find({ tags: tag }).toArray();
        if (packs_found.length > 0) {
            return { packs_found, collection_size: packs_found.length };
        }
        else {
            return null;
        }
    }
    catch (err) {
        throw err;
    }
}
exports.get_pack_by_tag = get_pack_by_tag;
async function get_packs_collection_size() {
    try {
        await client.connect();
        const collection = client.db(DATABASE).collection("packs");
        return await collection.countDocuments();
    }
    catch (err) {
        return "Something went wrong while trying to connecto to database";
    }
}
exports.get_packs_collection_size = get_packs_collection_size;
async function create_user(user) {
    try {
        await client.connect();
        const users_collection = client.db(DATABASE).collection("users");
        await users_collection.insertOne(user);
        //Getting created user from db
        const user_db = await users_collection.findOne({ username: user.username });
        if (!user_db)
            throw new Error("Could not find username in database");
        const user_id = user_db._id.toString();
        const account_verification_token_collection = client.db(DATABASE).collection("account_verification_tokens");
        account_verification_token_collection.createIndex({ date: 1 }, { expireAfterSeconds: 3600 });
        const token = crypto_js_1.SHA256(user_id).toString();
        //Creating token in db to verify account
        account_verification_token_collection.insertOne({
            date: new Date(),
            token: token,
            user_id: user_id,
        });
        await nodemailer_lib_1.send_email_verification(user.email, `Hey please confirm your email address by clicking on this link: ${process.env.FULL_DOMAIN}/verify_account?token=${token}`);
        return true;
    }
    catch (err) {
        console.log(err);
        return "Something went wrong while trying to create your acccount";
    }
}
exports.create_user = create_user;
async function create_user_pack(pack) {
    try {
        await client.connect();
        const packs_collection = client.db(DATABASE).collection("packs");
        const user_collection = client.db(DATABASE).collection("users");
        await user_collection.updateOne({ username: pack.username }, { $push: { released_packs: pack._id.toString() } });
        packs_collection.insertOne(pack);
    }
    catch (err) {
        console.log("LOL");
        throw err;
    }
}
exports.create_user_pack = create_user_pack;
async function update_pack_download_count(pack_id) {
    try {
        await client.connect();
        const packs_collection = client.db(DATABASE).collection("packs");
        const response = await packs_collection.updateOne({ _id: pack_id }, { $inc: { downloads: +1 } });
        if (!response.acknowledged)
            return false;
        return true;
    }
    catch (err) {
        console.log(err);
        return "Something went wrong while trying to increase download count";
    }
}
exports.update_pack_download_count = update_pack_download_count;
async function get_user_by_email(email) {
    if (!email_regex.test(email))
        return "Not a valid email";
    try {
        await client.connect();
        const collection = client.db(DATABASE).collection("users");
        const user_arr = await collection.aggregate([
            {
                $project: {
                    _id: "$_id",
                    email: { $toUpper: "$email" },
                    verified: "$verified"
                }
            },
            {
                $match: {
                    email: email.toUpperCase()
                }
            }
        ]).toArray();
        if (user_arr.length === 0)
            return "Couldn't find an Account with that email";
        return user_arr[0];
    }
    catch (err) {
        return "Something went wrong!";
    }
}
exports.get_user_by_email = get_user_by_email;
async function create_account_verification_token(user_id) {
    try {
        const account_verification_token_collection = client.db(DATABASE).collection("account_verification_tokens");
        account_verification_token_collection.createIndex({ date: 1 }, { expireAfterSeconds: 3600 });
        const token = crypto_js_1.SHA256(user_id.toString()).toString();
        const verification_tokens = await account_verification_token_collection.find({ token: token }).toArray();
        if (verification_tokens.length > 0)
            return "There already is an token!";
        //Token does not already exist.
        //Creating token in db to verify account
        account_verification_token_collection.insertOne({
            date: new Date(),
            token: token,
            user_id: user_id,
        });
        return {
            token: token
        };
    }
    catch (err) {
        return "something went wrong while trying to create an account verification token.";
    }
}
exports.create_account_verification_token = create_account_verification_token;
async function verify_user_account(token) {
    try {
        await client.connect();
        const token_collection = client.db(DATABASE).collection("account_verification_tokens");
        const found_token = await token_collection.findOne({ token: token });
        if (!found_token)
            return "Couldn't find the token!";
        //Token exists in database.
        const token_date = new Date(found_token.date);
        //function that checks if token is expired
        function check_token_expired(token_time) {
            const current_time = new Date().getTime();
            const one_hour = 1000 * 60 * 60;
            const token_alife = current_time - token_time;
            if (token_alife > one_hour) {
                return true;
            }
            else {
                return false;
            }
        }
        const token_expired = check_token_expired(token_date.getTime());
        if (token_expired) {
            await token_collection.deleteOne({ token: token });
            return 1;
        }
        //Token is not expired
        const user_collection = client.db(DATABASE).collection("users");
        const user_found = await user_collection.find({ _id: new mongodb_1.ObjectId(found_token.user_id) }).toArray();
        if (user_found.length === 0)
            return "Did not find account to verify";
        //user found & verifieng user
        user_collection.updateOne({ _id: new mongodb_1.ObjectId(found_token.user_id) }, { $set: { verified: true } }, async (err) => {
            if (err)
                throw err;
        });
        await token_collection.deleteOne({ token: token });
        return 0;
    }
    catch (err) {
        console.log(err);
        return "Something went wrong!";
    }
}
exports.verify_user_account = verify_user_account;
async function validate_user_credentials(email, password) {
    try {
        if (!email)
            return "Coulnd't find an email input";
        if (!password)
            return "Coulnd't find an password input";
        await client.connect();
        const collection = client.db(DATABASE).collection("users");
        const user_arr = await collection.aggregate([
            {
                $project: {
                    username: "$username",
                    verified: "$verified",
                    created_at: "$created_at",
                    description: "$description",
                    profile_picture: "$profile_picture",
                    profile_banner: "$profile_banner",
                    email: { $toUpper: "$email" },
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
        ]).toArray();
        if (user_arr.length === 0)
            return "Couldn't find Account";
        //User exists in db.
        const user = user_arr[0];
        //User is verified
        const hashed_password = crypto_js_1.SHA256(password + user.salt).toString();
        if (hashed_password === user.password) {
            return user;
        }
        else {
            return "Wrong credentials";
        }
        return user;
    }
    catch (err) {
        return "Something went wrong";
    }
}
exports.validate_user_credentials = validate_user_credentials;
async function rate_pack(pack_id, rating, username) {
    try {
        await client.connect();
        const packs_collection = client.db(DATABASE).collection("packs");
        const pack = await packs_collection.findOne({ _id: new mongodb_1.ObjectId(pack_id) });
        if (!pack)
            return "Couldnt find pack to rate";
        let user_already_rated = false;
        for (let rating of pack.ratings) {
            if (rating.user.toLowerCase() === username.toLowerCase()) {
                user_already_rated = true;
                break;
            }
        }
        console.log(pack.username, username);
        if (user_already_rated)
            return "Already rated this pack";
        if (pack.username === username)
            return "You can't rate your own pack.";
        //User can rate
        await packs_collection.updateOne({ _id: new mongodb_1.ObjectId(pack_id) }, { $push: { ratings: { user: username, rating: rating } } });
        return { success: true, message: "Successfully added rating to pack" };
    }
    catch (err) {
        console.log(err);
        return "Something went wrong while trying to rate a pack";
    }
}
exports.rate_pack = rate_pack;
async function report_pack(pack_id, reason) {
    try {
        const valid_id = mongodb_1.ObjectId.isValid(pack_id);
        if (!valid_id)
            return "Please enter a valid Pack id";
        await client.connect();
        const packs_collection = client.db(DATABASE).collection("packs");
        const pack = packs_collection.findOne({ _id: new mongodb_1.ObjectId(pack_id) });
        if (!pack)
            return "Couldnt find a pack with that id.";
        const pack_reports_collection = client.db(DATABASE).collection("pack_reports");
        await pack_reports_collection.insertOne({
            pack_id: pack_id,
            date: new Date(),
            reason: reason
        });
        return true;
    }
    catch (err) {
        console.log(err);
        return "Something went wrong while trying to create a report";
    }
}
exports.report_pack = report_pack;
