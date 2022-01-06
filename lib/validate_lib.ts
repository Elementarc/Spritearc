import { User, Formidable_file } from "../types"

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

export function validate_single_file(file: Formidable_file): boolean | string {
    
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

export function validate_pack_title(title: string): boolean | string {
    const title_regex = new RegExp(/^(?!(?:\S*\s){3})([a-zA-Z0-9 ]+)$/)

    if(title.length < 3) return "Min. 3 characters."
    if(title.length > 25) return "Max. 25 characters."
    if(title_regex.test(title) === false) return "Max. 3 words allowed and title can only contain letters from a-z and number between 0-9"

    return true
}

export function validate_pack_description(description: string): boolean | string {
    const description_regex = new RegExp(/^[a-zA-Z0-9\.\,\-\!\?\_\&\:\ -]{100,500}$/)

    if(description.length < 100) return "Min. 100 characters."
    if(description.length > 500) return "Max. 500 characters."
    if(description_regex.test(description) === false) return "Allowed special characters: . , - ! ? _ & :"

    return true
}

export function validate_pack_tag_name(tag_name: string): boolean | string {
    const tag_regex = new RegExp(/^[a-zA-Z]{3,10}$/)

    if(tag_name.length === 0) return ""
    if(tag_name.length < 3) return "Min. 3 characters"
    if(tag_name.length > 10) return "Max. 10 characters"
    else {
        if(tag_regex.test(tag_name) === false) {
            return "Allowed characters: a-z A-Z"
        } else {
            return true
        }
    }
    
}