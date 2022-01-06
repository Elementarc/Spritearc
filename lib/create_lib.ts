import { Create_pack_frontend, User } from "../types"
import { Public_user } from "../types";

//Default user
export function create_default_user(username: string, email: string, password: string, salt: string, occasional_emails: boolean): User {
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

//Return public_user obj from username.
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

//Creating a FormData that is used to send a pack files and infos to backend.
export function create_form_data(pack: Create_pack_frontend): FormData | null {
    if(!pack.license) return null
    if(!pack.content) return null
    if(!pack.title) return null
    if(!pack.description) return null
    if(!pack.preview.preview_asset) return null
    if(!pack.tags) return null
    
    let pack_content: {section_name: string, section_assets: File[]}[] = []

    for(let [key, value] of pack.content.entries()) {
        pack_content.push({
            section_name: key,
            section_assets: value.section_assets 
        })
    }

    const form_data = new FormData()

    form_data.set("title", pack.title)
    form_data.set("description", pack.description)
    form_data.set("license", pack.license)
    form_data.set("preview", pack.preview.preview_asset, `preview`)
    form_data.set("tags", JSON.stringify(pack.tags))


    for(let section of pack_content) {
        
        for(let i = 0; i < section.section_assets.length; i ++) {
            console.log(section.section_assets[i])
            form_data.append(section.section_name.toLowerCase(), section.section_assets[i], `${section.section_name.toLowerCase()}_${i}`)
        }
        
    }
    
    return form_data

}
