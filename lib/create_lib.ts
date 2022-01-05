import { Create_pack_frontend, Pack_content, User } from "../types"
import { Public_user } from "../types";

//Returning a user obj
export function create_user(username: string, email: string, password: string, salt: string, occasional_emails: boolean): User {
    const user_obj: User = {
        username,
        email,
        password,
        salt,
        verified: false,
        role: "member",
        occasional_emails: occasional_emails,
        description: "Hey! Im new here :)",
        profile_picture: "default.png",
        profile_banner: "default.png",
        created_at: new Date(),
        notifications: [],
        following: [],
        followers: [],
        released_packs: [],
    }

    return user_obj
}

//Returning a public user obj
export function create_default_public_user(username: string): Public_user {
    
    const public_user_obj: Public_user = {
        username: username,
        description: "Hey! Im new here :)",
        profile_picture: "default.png",
        profile_banner: "default.png",
        created_at: new Date(),
        following: [],
        followers: [],
        released_packs: [],
    }

    return public_user_obj
}

export function create_sendable_pack(pack: Create_pack_frontend) {
    if(!pack.license) return null
    if(!pack.content) return null
    if(!pack.title) return null
    if(!pack.description) return null
    if(!pack.preview.preview_asset) return null
    if(!pack.tags) return null

    
}