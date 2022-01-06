import { MongoClient, ObjectId, WithId } from 'mongodb';
import { Public_user } from '../types';
import { Pack } from '../types';

const client = new MongoClient("mongodb://localhost:27017")
const DATABASE = "pixels"

//Function that returns a public user obj from db. Null if given username wasnt found
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
        throw err;
    }
    
}

//Function that returns spec
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

//Function that checks if email exists in database. and has proper structure
export async function email_available(email: string): Promise<boolean> {

    try {

        const email_regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
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

        throw err;

    }


}

//Function that checks if username exists in database. and has proper structure
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

//returns a pack Obj from database.
export async function get_pack_by_id(pack_id: ObjectId): Promise<Pack | null> {

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

//Returns
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

export async function create_user_pack(pack: Pack) {

    try {

        await client.connect()

        const packs_collection = client.db(DATABASE).collection("packs")

        packs_collection.insertOne(pack)

    } catch( err ) {

        throw err

    }

}