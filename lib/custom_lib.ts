import { Public_user } from "../types";
import { User } from "../types"

//Function that returns a string with first letter as uppercase and rest lowercase
export function capitalize_first_letter_rest_lowercase(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

//return true if blob type & size is valid
export function validate_files(files: File[]): boolean | string {
    
    let passed_validation: boolean | string = false

    for(let file of files) {
        
        //Checking if type of dropped files are jpg / png / jpeg
        if(file.type === "image/jpg" || file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/gif") {

            if(file.size <= 150000) {
                passed_validation = true
            } else {
                passed_validation = `The file: '${file.name}' is to big! max. 150kb per file`
                break
            }

        } else {

            passed_validation = "Supported types: JPG, PNG, JPEG, GIF"
            break
        }

    }
    
    return passed_validation

}

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
export function create_public_user(username: string): Public_user {
    
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