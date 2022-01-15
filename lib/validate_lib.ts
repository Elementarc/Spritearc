import { Formidable_file , Formidable_files} from "../types"

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

export function validate_pack_section_name(section_name: string): boolean | string {
    const section_name_regex = new RegExp(/^[a-zA-Z0-9]{3,12}$/)

    if(!section_name_regex.test(section_name)) return "section name did'nt pass validations"

    return true
    
}

export function validate_pack_tag(tag_name: string): boolean | string {
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

export function validate_pack_tags(tags: string[]): boolean | string {
    const tag_regex = new RegExp(/^[a-zA-Z]{3,10}$/)

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
    
    if(license === "opensource") {
        return true
    } else {
        return "License is not supported"
    }
}

export function validate_username(username: string): boolean | string {
    const username_regex = new RegExp(/^(?=.{3,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)

    if(username_regex.test(username) === true) {
        return true
    } else {
        return "Username didnt pass validation"
    }
    
}

export function validate_pack_report_reason(reason: string) {
    const report_input_regex = new RegExp(/^[a-zA-Z0-9\.\,\-\_?! ]{25,250}$/)

    const valid_reason = report_input_regex.test(reason)

    if(!valid_reason) return false
    return true
}