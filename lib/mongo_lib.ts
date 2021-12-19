import { MongoClient, ObjectId } from 'mongodb';
import { Public_user } from '../types';
const client = new MongoClient("mongodb://localhost:27017")


//Function that returns a public user obj from db. Null if given username wasnt found
export async function get_public_user(username: string): Promise<Public_user | null> {

    try {

        await client.connect()
        const db = client.db("pixels")
        const collection = db.collection("users")

        const users = await collection.aggregate([
            {
                $project: {
                    username: {$toUpper: "$username"},
                }
            },
            {
                $match: {
                    username: username.toUpperCase()
                }
            }
        ]).toArray()

        if(users.length === 0) return null

        const public_user_db = await collection.aggregate([
            {
                $project: {
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
                    _id: new ObjectId(users[0]._id)
                }
            }

        ]).toArray()
        
        if(public_user_db.length === 0) return null

        const public_user_with_id = {...public_user_db[0]}
        //removing id prop from public_user obj
        delete public_user_with_id._id
        const public_user_without_id = {...public_user_with_id}
        
        return public_user_without_id as Public_user
    } catch ( err ) {

        console.log(err)
        return null

    }
}