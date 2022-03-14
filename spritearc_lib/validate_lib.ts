import { Formidable_file , Formidable_files} from "./types"


export const LICENSE_TYPES = {
    opensource: "opensource",
    attribution: "attribution"
}

const contains_uppercase = new RegExp(/[A-ZÖÄÜ]/)
const contains_lowercase = new RegExp(/[a-zöäü]/)
const contains_number = new RegExp(/[0-9]/)

const special_character_regex = new RegExp(/^[ \.\_]{1}$/)
//account
const email_regex = new RegExp(/^[a-zA-Z0-9\.\-\_]{3,25}@[a-zA-Z]{3,25}.[a-zA-Z]{2,5}$/)
const username_regex = new RegExp(/^[a-zA-Z0-9\.\_]{3,20}$/)
const password_regex = new RegExp(/^[a-zA-Z0-9\§\*\.\!\/\@\#\$\%\^\&\(\)\{\}\:\;\<\>\,\.\?\|\~\+\-\=\~\_]{8,100}$/)

//profile
const user_description_regex = new RegExp(/^[a-zA-Z0-9äöüÄÖÜ\-()\/,:;_+?'!%&#*<> \.]{2,100}$/)

//Pack
const pack_description_regex = new RegExp(/^[a-zA-Z0-9äöüÄÖÜ\-()\/,:;_+?'!%&#*<> \.]{50,500}$/)
const tag_regex = new RegExp(/^[a-zA-Z0-9äöüÄÖÜ]{2,15}$/)
const title_regex = new RegExp(/^[a-zA-Z0-9öäüÖÄÜ\-\']{1,25}$/)
const section_name_regex = new RegExp(/^[a-zA-Z0-9äöüÄÖÜ\-]{3,16}$/)
const report_input_regex = new RegExp(/^[a-zA-Z0-9äöüÄÖÜ\-()\/,:;_+?'!%&#*<> \.]{3,500}$/)
const social_regex = new RegExp(/^[a-zA-Z0-9äöüÄÖÜ\.\_\-]{0,20}$/)
const search_query = new RegExp(/^[a-zA-Z0-9äöüÄÖÜ\.\_\-]{2,20}$/)
const paypal_donation_link_regex = new RegExp(/^https:\/\/www.paypal.com\/donate\/\?hosted_button_id=[a-zA-Z0-9]{5,30}$/)

export function validate_paypal_donation_link(link: string | null | undefined): boolean | string {
    if(!link) return true
    if(link.length === 0) return true
    if(paypal_donation_link_regex.test(link) === false) return "Donation Link is not valid!"
    return true
}
export function validate_search_query(query: string): boolean | string {
    
    if(search_query.test(query) === false) return "Please enter a valid search query!"
    return true
}
export function validate_email(email: string): boolean | string {
    if(email_regex.test(email) === true) return true
    return "Please use a corretly formatted email!"
}
export function validate_username(username: string): boolean | string {
    if(username.length < 3) return "Username is to short!"
    if(username.length > 20) return "Username is to long!"


    
    for(let i = 0; i < username.length; i++) {
        if(special_character_regex.test(username[i])) {
            if(special_character_regex.test(username[i + 1])) {
                return "Username cannot contain 2 special characters after each other."
            }
        }
    }

    if(special_character_regex.test(username[0])) return "You cannot use special characters at the beginning or at the end of your username!"
    if(special_character_regex.test(username[username.length - 1])) return "You cannot use special characters at the beginning or at the end of your username!"
    
    
    if(!username_regex.test(username)) return "You can't use that username!"
    
    return true
}
export function validate_password(password: string): boolean | string {
    if(password.length < 8) return "Password is to short!"
    if(password.length > 100) return "Password is to long!"

    if(!contains_uppercase.test(password)) return "Password needs to contain atleast one uppercase character!"
    if(!contains_lowercase.test(password)) return "Password needs to contain atleast one lowercase character!"
    if(!contains_number.test(password)) return "Password needs to contain atleast one number!"

    if(!password_regex.test(password)) return "Your password is not safe enough! Make sure it atleast contains: 1 Uppercase and 1 number character!"
        
    return true
    
}
export function validate_social(social: string): boolean | string {
    if(social_regex.test(social) === true) return true
    return "Social is not valid"
}

//return true if blob type & size is valid
export function validate_files(files: File[]): boolean | string {
    
    let passed_validation: boolean | string = "Failed"

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
export function validate_formidable_files(files: Formidable_files): boolean | string {
    
    let passed_validation: boolean | string = false

    
    for(let key in files) {
        files[key]

        if(Array.isArray(files[key]) === true) {
            
            const file_arr = files[key] as Formidable_file[]
            for(let file of file_arr) {
                //Checking if type of dropped files are jpg / png / jpeg
                if(file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/gif") {

                    if(file.size <= 150000) {
                        passed_validation = true
                    } else {
                        passed_validation = `The file: '${file.originalFilename}' is to big! max. 150kb per file`
                        break
                    }

                } else {

                    passed_validation = "Supported types: JPG, PNG, JPEG, GIF"
                    break
                }             
            }

        } else {
            
            const file = files[key] as Formidable_file

            //Checking if type of dropped files are jpg / png / jpeg
            if(file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/gif") {
                
                if(file.size <= 150000) {
                    passed_validation = true
                } else {
                    passed_validation = `The file: '${file.originalFilename}' is to big! max. 150kb per file`
                    break
                }

            } else {

                passed_validation = "Supported types: JPG, PNG, JPEG, GIF"
                break
            }    
        }

    }
    
    return passed_validation

}
export function validate_single_formidable_file(file: Formidable_file): boolean | string {
    
    let passed_validation: boolean | string = false
    
    
    //Checking if type of dropped files are jpg / png / jpeg
    if(file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/gif") {

        if(file.size <= 150000) {
            passed_validation = true
        } else {
            passed_validation = `The file: '${file.originalFilename}' is to big! max. 150kb per file`
        }

    } else {

        passed_validation = "Supported types: JPG, PNG, JPEG, GIF"
    }

    
    return passed_validation

}
export function validate_profile_image(file: Formidable_file): boolean | string {
    
    let passed_validation: boolean | string = false
    
    //Checking if type of dropped files are jpg / png / jpeg
    if(file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jpeg") {

        if(file.size <= 1000 * 1024) {
            passed_validation = true
        } else {
            passed_validation = `The file: '${file.originalFilename}' is to big! max. 1mb per file`
        }

    } else {

        passed_validation = "Supported types: JPG, PNG, JPEG, GIF"
    }

    return passed_validation

}
export function validate_pack_title(title: string): boolean | string {

    if(title.length < 3) return "Min. 3 characters."
    if(title.length > 25) return "Max. 25 characters."
    if(title.split(" ").length > 3) return "Max. allowed words are 3."
    
    if(special_character_regex.test(title[0])) return "You cannot use special characters at the beginning or the end!"
    if(special_character_regex.test(title[title.length - 1])) return "You cannot use special characters at the beginning or the end!"
    
    let valid_title = true
    for(let text of title.split(" ")) {

        if(!title_regex.test(text)){
            valid_title = false
            break
        } 

    }

    if(!valid_title) return "Pack title did not pass validations!"

    return true
}
export function validate_pack_description(description: string): boolean | string {
    

    if(description.length < 50) return "Min. 50 characters."
    if(description.length > 500) return "Max. 500 characters."
    if(pack_description_regex.test(description) === false) return "Allowed special characters: . , - ! ? _ & :"

    return true
}
export function validate_user_description(description: string): boolean | string {
    if(description.length < 2) return "To short!"
    if(description.length > 100) return "To Long!"
    if(!user_description_regex.test(description)) return "Cant use description! Probably using a special character that is not allowed."
    return true
}
export function validate_pack_section_name(section_name: string): boolean | string {

    if(section_name.length < 3) return "Section name is to short!"
    if(section_name.length > 16) return "Section name is to Long!"
    if(!section_name_regex.test(section_name)) return "Sectioname can only contain characters a-z A-Z and number between 0-9"

    return true
}
export function validate_pack_tag(tag_name: string): boolean | string {

    if(tag_name.length === 0) return ""
    if(tag_name.length < 2) return "Min. 2 characters"
    if(tag_name.length > 15) return "Max. 15 characters"
    else {
        if(tag_regex.test(tag_name) === false) {
            return "Allowed characters: a-z A-Z 0-9"
        } else {
            return true
        }
    }
    
}
export function validate_pack_perspective(perspective: string): boolean | string {
    
    switch( perspective.toLowerCase() ) {
        case "top-down" : {
            return true
        }

        case "side-scroller" : {
            return true
        }

        case "isometric" : {
            return true
        }

        default : {
            return "Perspective is not valid"
        }
    }
    
}
export function validate_pack_resolution(resolution: string): boolean | string {

    switch( resolution.toLowerCase() ) {
        case "8x8" : {
            return true
        }

        case "16x16" : {
            return true
        }

        case "32x32" : {
            return true
        }

        case "48x48" : {
            return true
        }

        case "64x64" : {
            return true
        }

        case "80x80" : {
            return true
        }

        case "96x96" : {
            return true
        }

        case "112x112" : {
            return true
        }

        case "128x128" : {
            return true
        }

        case "256x256" : {
            return true
        }

        default : {
            return "Resolution is not valid"
        }
    }
    
}
export function validate_pack_tags(tags: string[]): boolean | string {

    if(tags.length === 0) return ""
    if(tags.length < 3) return "Min. 3 Tags"
    if(tags.length > 5) return "Max. 3 Tags"
    else {
        let passed_test = true
        for(let tag of tags) {

            if(tag_regex.test(tag) === false) {
                passed_test = false
            }
        }
        
        if(passed_test === true) {
            return true
        } else {
            return "Tags didnt pass validation"
        }
    }
    
}
export function validate_license(license: string): boolean | string {
    
    switch(license.toLowerCase()) {
        case LICENSE_TYPES.opensource : {
            return true
        }
        case  LICENSE_TYPES.attribution : {
            return true
        }

        default : {
            return "License is not supported"
        }
    }
    
}
export function validate_pack_report_reason(reason: string) {
    

    const valid_reason = report_input_regex.test(reason)

    if(!valid_reason) return false
    return true
}