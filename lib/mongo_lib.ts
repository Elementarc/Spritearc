import { MongoClient, ObjectId } from 'mongodb';
import { Public_user, User } from '../types';
import { Pack } from '../types';
import { SHA256 } from 'crypto-js';
import { send_email_verification } from './nodemailer_lib';
import { delete_directory, delete_file } from './node_lib';
import logger from './logger';

const client = new MongoClient("mongodb://localhost:27017")
const DATABASE = "spritearc"

const email_regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
const username_regex = new RegExp(/^(?=.{3,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)

//DB actions
export async function create_root_user() {
    
    try {
        await client.connect()
        const username = process.env.MONGO_ROOT_USERNAME
        const password = process.env.MONGO_ROOT_PASSWORD
        if(!username) throw new Error("Couldnt find a username for mongo root user")
        if(!password) throw new Error("Couldnt find a password for mongo root user")
        const db = client.db("admin")

        await db.addUser(username,  password, {roles: ["root"]})
        logger.info("Successfully created root db user")
    } catch(err) {
        
        logger.warn(err)
    }
}

//Validations
export async function email_available(email: string): Promise<boolean> {

    try {

        if(typeof email !== "string") return false
        if(email_regex.test(email) === false) return false
    
        await client.connect()
        const collection = client.db(DATABASE).collection("users")
    
        const aggregated_response = await collection.aggregate([
            {
                $project: {
                    email: { $toUpper: "$email" },
                },
            },
            {
                $match: {email: email.toUpperCase()}
            }
        ]).toArray()
        
        if(aggregated_response.length > 0) {
            return false
        } else {
            return true
        }

    } catch ( err ){
        logger.error(err)
        return false
    }


}
export async function username_available(username: string): Promise<boolean> {

    try {
        const username_regex = new RegExp(/^(?=.{3,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)

        if(typeof username !== "string") return false
        if(username_regex.test(username) === false) return false
    
    
        await client.connect()
        const collection = client.db(DATABASE).collection("users")
        const aggregated_response = await collection.aggregate([
            {
                $project: {
                    username: { $toUpper: "$username" },
                },
            },
            {
                $match: {username: username.toUpperCase()}
            }
            
        ]).toArray()
        
        if(aggregated_response.length > 0) {
            return false
        } else {
            return true
        }
    } catch ( err ) {
        throw err;
    }



}
export async function user_exists_in_db(username: string): Promise<{verified: boolean} | string> {
    try {
        await  client.connect()
        const users_collection = client.db(DATABASE).collection("users")
        const user = (await users_collection.findOne({username: username}) as unknown) as User | null
        if(!user) return "Couldnt find existing user"

        return {verified: user.verified}
    } catch(err) {
        logger.error(err)
        return "Something went wrong while trying to check if user exists"
    }
    
}
export async function validate_user_credentials(email: string, password: string): Promise<string | User> {

    try {
        if(!email) return "Coulnd't find an email input"
        if(!password) return "Coulnd't find an password input"
        
        await client.connect()
        const collection = client.db(DATABASE).collection("users")
        const user_arr = await collection.aggregate([
            {
                $project: {
                    username: "$username",
                    verified: "$verified",
                    created_at: "$created_at",
                    description: "$description",
                    profile_picture: "$profile_picture",
                    profile_banner: "$profile_banner",
                    email: {$toUpper: "$email"},
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
        ]).toArray()
        
        if(user_arr.length === 0) return "Couldn't find Account"
        //User exists in db.

        const user = user_arr[0] as User
        
        //User is verified
        const hashed_password = SHA256(password + user.salt).toString()
        
        if(hashed_password === user.password) {
            
            return user

        } else {
            return "Wrong credentials"
        }

        
    } catch ( err ) {

        return "Something went wrong"

    }
}
export async function validate_user_credentials_by_username(username: string, password: string): Promise<string | User> {

    try {
        if(!username) return "Coulnd't find an username input"
        if(!password) return "Coulnd't find an password input"
        
        await client.connect()
        const collection = client.db(DATABASE).collection("users")
        const user_arr = await collection.aggregate([
            {
                $project: {
                    username: {$toUpper: "$username"},
                    verified: "$verified",
                    created_at: "$created_at",
                    description: "$description",
                    profile_picture: "$profile_picture",
                    profile_banner: "$profile_banner",
                    email: "$email",
                    password: "$password",
                    salt: "$salt",
                    followers: "$followers",
                    following: "$following",
                    released_packs: "$released_packs",
                }
            },
            {
                $match: {
                    username: username.toUpperCase()
                }
            }
        ]).toArray()
        
        if(user_arr.length === 0) return "Couldn't find Account"
        //User exists in db.

        const user = user_arr[0] as User
        
        //User is verified
        const hashed_password = SHA256(password + user.salt).toString()
        
        if(hashed_password === user.password) {
            
            return user

        } else {
            return "Wrong credentials"
        }

        
    } catch ( err ) {

        return "Something went wrong"

    }
}

//Get user actions
export async function get_public_user(username: string): Promise<Public_user | null> {

    try {
        await client.connect()
        const db = client.db(DATABASE)
        const collection = db.collection("users")
    
        const user = await collection.aggregate([
            {
                $project: {
                    username_uppercase: {$toUpper: "$username"},
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
        ]).toArray()
    
        //No user with that username exists
        if(user.length === 0) return null
        
        //User exists
        const public_user_obj = {...user[0]}
        delete public_user_obj.username_uppercase
        delete public_user_obj._id
        const public_user = {...public_user_obj as Public_user}
        
        return public_user as Public_user
    } catch ( err ) {

        logger.error(err)
        return null
    }
    
}
export async function get_user_by_email(email: string): Promise<string | {_id: ObjectId, email: string, verfied: boolean}> {
    if(!email_regex.test(email)) return "Not a valid email"

    try {
        await client.connect();
        const collection = client.db(DATABASE).collection("users")
        const user_arr = await collection.aggregate([
            {
                $project: {
                    _id: "$_id",
                    email: {$toUpper: "$email"},
                    verified: "$verified"
                }
            },
            {
                $match: {
                    email: email.toUpperCase()
                }
            }
        ]).toArray()

        if(user_arr.length === 0) return "Couldn't find an Account with that email"


        return user_arr[0] as {_id: ObjectId, email: string, verfied: boolean}


    } catch( err ) {
        return "Something went wrong!"
    }
}

//Profile actions
export async function update_user_about(public_user: Public_user, description: string): Promise<boolean | string> {

    try {
        await client.connect()

        const user_collection = client.db(DATABASE).collection("users")

        const update_response = await user_collection.updateOne({username: public_user.username}, {$set: {description: description}})

        if(update_response.acknowledged) return true

        return "Couldnt Update about"
    } catch(err) {
        logger.error(err)
        return "Something went wrong while trying to update about section of a user."
    }
    

    

    
}
export async function update_user_profile_picture(public_user: Public_user, filename: string): Promise<boolean> {
    try {
        await client.connect()

        const user_collection = client.db(DATABASE).collection("users")

        const response = await user_collection.updateOne({username: public_user.username}, {$set: {profile_picture: filename.toLowerCase()}})
        
        return response.acknowledged
        
    } catch(err) {
        logger.error(err)
        return false
    }
}
export async function update_user_profile_banner(public_user: Public_user, filename: string): Promise<boolean> {

    try {
        await client.connect()

        const user_collection = client.db(DATABASE).collection("users")

        const response = await user_collection.updateOne({username: public_user.username}, {$set: {profile_banner: filename.toLowerCase()}})
        
        return response.acknowledged
        
    } catch(err) {
        logger.error(err)
        return false
    }
}

//Account actions
export async function create_user_account(user: User): Promise<string | boolean> {
    try {

        await client.connect()
            
        const users_collection = client.db(DATABASE).collection("users")
        users_collection.createIndex({username: 1}, {unique: true})
        await users_collection.insertOne(user)

        //Getting created user from db
        const user_db = await users_collection.findOne({username: user.username})
        if(! user_db) throw new Error("Could not find username in database")

        const user_id =  user_db._id.toString()

        const account_verification_token_collection = client.db(DATABASE).collection("account_verification_tokens")
        account_verification_token_collection.createIndex({date: 1}, {expireAfterSeconds: 3600})
        const token = SHA256(user_id).toString()

        //Creating token in db to verify account
        account_verification_token_collection.insertOne({
            date: new Date(),
            token: token,
            user_id: user_id,
        })

        await send_email_verification(user.email, `Hey please confirm your email address by clicking on this link: ${process.env.FULL_DOMAIN}/verify_account?token=${token}`)
        
        return true
    } catch ( err ) {
    
        logger.error(err)
        return "Something went wrong while trying to create your acccount"

    }
}
export async function delete_user_account(username: string): Promise<boolean|string> {
    try {
        await client.connect()

        const users_collection = client.db(DATABASE).collection("users")

        const user = (await users_collection.findOne({username}) as unknown) as User | null
        if(!user) return "Couldnt find user to delete"
        
        //Deleting profile_img and profile_banner
        if(user.profile_picture !== "default.png") {
            delete_file(`${process.cwd()}/dynamic_public/profile_pictures/${user.profile_picture}`)
        }
        if(user.profile_banner !== "default.png") {
            delete_file(`${process.cwd()}/dynamic_public/profile_banners/${user.profile_banner}`)
        }
        //Deleting files from filesystem
        const user_packs = (await client.db(DATABASE).collection("packs").find({username: username}).toArray() as unknown) as Pack[]
        for(let user_pack of user_packs) {
            delete_directory(`${process.cwd()}/dynamic_public/packs/${user_pack._id.toString()}`)
            delete_file(`${process.cwd()}/pack_zips/${user_pack._id.toString()}.zip`)
        }

        
        //Deleting user from db
        const user_deleted = await users_collection.deleteOne({username: username})
        if(!user_deleted.acknowledged) return "couldnt delete user"
        
        //Deleting packs from user from db
        const delete_response = await delete_all_user_packs(username)
        if(typeof delete_response === "string") return delete_response

        return true

    } catch(err) {
        logger.error(err)
        return "Couldn't delete account"
    }
}
export async function verify_user_account(token: string): Promise<string|number> {
    try {
        
        await client.connect()
        const token_collection = client.db(DATABASE).collection("account_verification_tokens")
        
        const found_token = await token_collection.findOne({token: token})

        if(!found_token) return "Couldn't find the token!"
        //Token exists in database.
        const token_date = new Date(found_token.date)
        
        //function that checks if token is expired
        function check_token_expired(token_time: number): boolean {
            const current_time = new Date().getTime()
            const one_hour = 1000 * 60 * 60
            const token_alife = current_time - token_time 
            
            if(token_alife > one_hour) {
                return true
            } else {
                return false
            }
        }
        
        const token_expired = check_token_expired(token_date.getTime())
        
        if(token_expired) {
            await token_collection.deleteOne({token: token})
            return 1
        }

        //Token is not expired
        const user_collection = client.db(DATABASE).collection("users")

        const user_found = await user_collection.find({_id: new ObjectId(found_token.user_id)}).toArray()
        if(user_found.length === 0) return "Did not find account to verify"

        //user found & verifieng user
        user_collection.updateOne({_id: new ObjectId(found_token.user_id)}, {$set: {verified: true}}, async(err) => {
            if( err ) throw err;
        })

        await token_collection.deleteOne({token: token})

        return 0
        
    } catch ( err ) {

        logger.error(err)
        return "Something went wrong!"
    }
}
export async function create_account_verification_token(user_id: ObjectId): Promise<string | {token: string}> {
    try {

        const account_verification_token_collection = client.db(DATABASE).collection("account_verification_tokens")
        account_verification_token_collection.createIndex({date: 1}, {expireAfterSeconds: 3600})
        const token = SHA256(user_id.toString()).toString()

        const verification_tokens = await account_verification_token_collection.find({token: token}).toArray()
        if(verification_tokens.length > 0) return "There already is an token!"
        //Token does not already exist.

        //Creating token in db to verify account
        account_verification_token_collection.insertOne({
            date: new Date(),
            token: token,
            user_id: user_id,
        })

        return {
            token: token
        }
    } catch(err) {
        return "something went wrong while trying to create an account verification token."
    }
}

//Pack actions
export async function report_pack(pack_id: string, reason: string): Promise<string | boolean> {
    
    try {
        const valid_id = ObjectId.isValid(pack_id)
        if(!valid_id) return "Please enter a valid Pack id"

        await client.connect()

        const packs_collection = client.db(DATABASE).collection("packs")

        const pack = (packs_collection.findOne({_id: new ObjectId(pack_id)}) as unknown) as Pack | null

        if(!pack) return "Couldnt find a pack with that id."

        const pack_reports_collection = client.db(DATABASE).collection("pack_reports")

        await pack_reports_collection.insertOne({
            pack_id: pack_id,
            date: new Date(),
            reason: reason
        })

        return true
    } catch(err) {
        logger.error(err)
        return "Something went wrong while trying to create a report"
    }
}
export async function rate_pack(pack_id: string, rating: number, username: string) {

    try {

        await client.connect()

        const packs_collection = client.db(DATABASE).collection("packs")
        const pack = (await packs_collection.findOne({_id: new ObjectId(pack_id)}) as unknown) as Pack | null

        if(!pack) return "Couldnt find pack to rate"

        let user_already_rated = false
        for(let rating of pack.ratings) {
            
            if(rating.user.toLowerCase() === username.toLowerCase()) {
                user_already_rated = true
                break
            }
        }
        
        if(user_already_rated) return "Already rated this pack"
        if(pack.username === username) return "You can't rate your own pack."
        //User can rate
        await packs_collection.updateOne({_id: new ObjectId(pack_id)}, {$push: {ratings: {user: username, rating: rating}}})

        return {success: true, message: "Successfully added rating to pack"}
    } catch(err) {
        logger.error(err)
        return "Something went wrong while trying to rate a pack"
    }
    
}
export async function update_pack_download_count(pack_id: ObjectId): Promise<string | boolean> {
    try {
        await client.connect()

        const packs_collection = client.db(DATABASE).collection("packs")
        
        const response = await packs_collection.updateOne({_id: pack_id}, {$inc: {downloads: +1}})

        if(!response.acknowledged) return false
        return true
    } catch(err) {
        logger.error(err)
        return "Something went wrong while trying to increase download count"
    }
}
export async function create_user_pack(pack: Pack): Promise<string | boolean> {

    try {

        await client.connect()
        
        const packs_collection = client.db(DATABASE).collection("packs")
        const users_collection = client.db(DATABASE).collection("users")
        
        await users_collection.updateOne({username: pack.username}, {$push: {released_packs: pack._id.toString()}})
        
        const inserted_res = await packs_collection.insertOne(pack)

        if(!inserted_res.acknowledged) return "couldnt add pack to db"

        return true
    } catch( err ) {
       
        logger.error(err)
        return "Something went wrong while trying to create your pack"

    }

}
export async function delete_user_pack(pack_id: ObjectId, signed_user: Public_user): Promise<boolean> {

    try {
        await client.connect()
        const user_collection = client.db(DATABASE).collection("users")
        const packs_collection = client.db(DATABASE).collection("packs")
        
        const user = await (user_collection.findOne({username: signed_user.username}) as unknown) as User
        if(!user) return false
        const pack = await packs_collection.findOne({_id: pack_id}) as Pack | null
    
        if(!pack) return false
        if(signed_user.username === pack.username || user.role === "admin") {
            //Deleting pack
            await packs_collection.deleteOne({_id: pack_id})

            //Updating released_packs from user Obj
            const users_collection = client.db(DATABASE).collection("users")

            await users_collection.updateOne({username: signed_user.username}, {$pull: {"released_packs": pack_id.toString()}})

            return true
        } else {
            return false
        }
       

    } catch ( err ) {
        logger.error(err)
        return false
    }

}
export async function delete_all_user_packs(username: string): Promise<string | boolean> {
    try {
        await client.connect()
        const packs_collection = client.db(DATABASE).collection("packs")

        const delete_results = await packs_collection.deleteMany({username: username})

        if(!delete_results.acknowledged) return "couldnt delete packs"
        return true

    } catch(err) {
        logger.error(err)
        return "Somethign went wrong while trying to delete your packs"
    }
}
export async function get_packs_collection_size() {

    try {
        await client.connect()

        const collection = client.db(DATABASE).collection("packs")

        return await collection.countDocuments()

    } catch ( err ) {

        return "Something went wrong while trying to connecto to database"

    }

}
export async function get_pack(pack_id: ObjectId): Promise<Pack | null> {

    try {

        //Checking if query pack id is a valid ObjectId
        await client.connect();
        const packs_collection = client.db(DATABASE).collection("packs")
        const pack = (await packs_collection.findOne({_id: new ObjectId(`${pack_id}`)}) as unknown) as Pack
        
        if(!pack) return null

        return pack as Pack

    } catch ( err ) {

        throw err;

    }

        
}
export async function get_released_packs_by_user(pack_id_arr: string[]): Promise<Pack[]>  {

    try {

        await client.connect()
        const packs_collection = client.db(DATABASE).collection("packs")
    
        const user_packs: Pack[] = []
        for(let pack_id of pack_id_arr) {
            const pack_id_valid = ObjectId.isValid(pack_id)
    
            if(pack_id_valid) {
                const pack = (await packs_collection.findOne({_id: new ObjectId(pack_id)}) as unknown) as Pack
                
                if(pack) {
                    user_packs.push(pack)
                }
            }
            
        }
        
        return user_packs

    } catch ( err ) {

        throw err;

    }

    
}
export async function get_title_pack(): Promise<Pack | null> {
    
    try {
        await client.connect()

        const collection = client.db(DATABASE).collection("packs")
    
        const pack = await collection.aggregate([
            {
                $sample: {size: 1}
            }
        ]).toArray()

        return pack[0] as Pack
        
    } catch ( err ) {
        logger.error(err)
        return null
    }
    

    
}
export async function get_recent_packs(number_of_returns: number): Promise<Pack[] | null> {

    try {
        //Connecting to database
        await client.connect()

        //Choosing db
        const db = client.db(DATABASE);

        //Returning 12 Packs Ordered by Date.
        const recent_packs = (await db.collection("packs").find({}).sort({date: -1}).limit(number_of_returns).toArray() as unknown) as Pack[]

        
        if(recent_packs.length > 0) {

            return recent_packs

        } else {

            return null

        }
    } catch( err ) {

        throw err;

    }

    
}
export async function get_pack_by_tag(tag: string) {
    try {
        //Connecting to database
        await client.connect()

        //Choosing db
        const db = client.db(DATABASE);

        const packs_found = await db.collection("packs").find({tags: tag}).toArray() as Pack[]


        if(packs_found.length > 0) {

            return {packs_found, collection_size: packs_found.length}

        } else {

            return null

        }

    } catch( err ) {

        throw err;

    }
}