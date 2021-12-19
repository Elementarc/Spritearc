import { MongoClient, ObjectId } from 'mongodb';
import { Public_user } from '../types';
import { Pack_info } from '../types';
const client = new MongoClient("mongodb://localhost:27017")

//Function that returns a public user obj from db. Null if given username wasnt found
export async function get_public_user(username: string): Promise<Public_user | null> {

    try {

        await client.connect()
        const db = client.db("pixels")
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

        console.log(err)
        return null

    }
}


export async function get_user_packs(pack_id_arr: string[])  {

    try {

        await client.connect()
        const packs_collection = client.db("pixels").collection("packs")

        const user_packs: Pack_info[] = []
        for(let pack_id of pack_id_arr) {
            const pack_id_valid = ObjectId.isValid(pack_id)

            if(pack_id_valid) {
                const pack = await packs_collection.findOne({_id: new ObjectId(pack_id)}) as Pack_info
                
                if(pack) {
                    user_packs.push(pack)
                }
            }
            
        }
        
        return user_packs
    } catch ( err ) {
        console.log(err)
        return null
    }
}