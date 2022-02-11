import { Formidable_file , Formidable_files} from "./types"

export const LICENSE_TYPES = {
    opensource: "opensource",
    attribution: "attribution"
}

//account
const email_regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
const username_regex = new RegExp(/^(?=.{3,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Zäüö0-9\.\_\-]+(?<![_.])$/)
const password_regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,32}$/)

//profile
const user_description = new RegExp(/^(?!(?:\S*\s){12})([a-zA-Z0-9 \.\:\?\!\,\_\-]+)$/)

//Pack
const description_regex = new RegExp(/^[a-zA-Z0-9\.\,\-\!\?\_\&\:\ -]{100,500}$/)
const tag_regex = new RegExp(/^[a-zA-Z0-9]{2,12}$/)
const title_regex = new RegExp(/^(?!(?:\S*\s){3})([a-zA-Z0-9 ]{3,25})$/)
const section_name_regex = new RegExp(/^[a-zA-Z0-9]{3,16}$/)
const report_input_regex = new RegExp(/^[a-zA-Z0-9\.\,\-\_?! ]{25,250}$/)

export function validate_email(email: string): boolean | string {
    if(email_regex.test(email) === true) return true
    return "Please use a corretly formatted email!"
}
export function validate_username(username: string): boolean | string {
    const beginning_regex = new RegExp(/^[\.\_]+/)
    const end_regex = new RegExp(/[\.\_]+$/)
    const look_double_special_characters_regex = new RegExp(/(?<=[\.\_])[\.\_]/)

    if(username.length < 3) return "Username is to short!"
    if(username.length > 16) return "Username is to long!"
    if(beginning_regex.test(username) === true || end_regex.test(username) === true) return "You cannot use special characters at the beginning or at the end of your username!"
    if(look_double_special_characters_regex.test(username) === true) return "Username cannot contain 2 special characters after each other."
    if(!username_regex.test(username)) return "You can't use that username!"
    
    return true
}
export function validate_password(password: string): boolean | string {
    if(password.length < 8) return "Password is to short!"
    if(password.length > 32) return "Password is to long!"
    if(!password_regex.test(password)) return "Your password is not safe enough! Make sure it atleast contains: 1 Uppercase and 1 number character!"
        
    return true
    
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
    if(title_regex.test(title) === false) return "Max. 3 words allowed and title can only contain letters from a-z and number between 0-9"

    return true
}
export function validate_pack_description(description: string): boolean | string {
    

    if(description.length < 100) return "Min. 100 characters."
    if(description.length > 500) return "Max. 500 characters."
    if(description_regex.test(description) === false) return "Allowed special characters: . , - ! ? _ & :"

    return true
}
export function validate_user_description(description: string): boolean | string {

    if(!user_description.test(description)) return "description didnt pass validation. Allowed are 12 words and special characters: . : , ! ? _ -"
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
    if(tag_name.length > 12) return "Max. 12 characters"
    else {
        if(tag_regex.test(tag_name) === false) {
            return "Allowed characters: a-z A-Z 0-9"
        } else {
            return true
        }
    }
    
}
export function validate_pack_tags(tags: string[]): boolean | string {

    if(tags.length === 0) return ""
    if(tags.length < 3) return "Min. 3 Tags"
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