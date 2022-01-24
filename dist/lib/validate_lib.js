"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_pack_report_reason = exports.validate_username = exports.validate_license = exports.validate_pack_tags = exports.validate_pack_tag = exports.validate_pack_section_name = exports.validate_user_description = exports.validate_pack_description = exports.validate_pack_title = exports.validate_profile_image = exports.validate_single_formidable_file = exports.validate_formidable_files = exports.validate_files = void 0;
//return true if blob type & size is valid
function validate_files(files) {
    let passed_validation = "Failed";
    for (let file of files) {
        //Checking if type of dropped files are jpg / png / jpeg
        if (file.type === "image/jpg" || file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/gif") {
            if (file.size <= 150000) {
                passed_validation = true;
            }
            else {
                passed_validation = `The file: '${file.name}' is to big! max. 150kb per file`;
                break;
            }
        }
        else {
            passed_validation = "Supported types: JPG, PNG, JPEG, GIF";
            break;
        }
    }
    return passed_validation;
}
exports.validate_files = validate_files;
function validate_formidable_files(files) {
    let passed_validation = false;
    for (let key in files) {
        files[key];
        if (Array.isArray(files[key]) === true) {
            const file_arr = files[key];
            for (let file of file_arr) {
                //Checking if type of dropped files are jpg / png / jpeg
                if (file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/gif") {
                    if (file.size <= 150000) {
                        passed_validation = true;
                    }
                    else {
                        passed_validation = `The file: '${file.originalFilename}' is to big! max. 150kb per file`;
                        break;
                    }
                }
                else {
                    passed_validation = "Supported types: JPG, PNG, JPEG, GIF";
                    break;
                }
            }
        }
        else {
            const file = files[key];
            //Checking if type of dropped files are jpg / png / jpeg
            if (file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/gif") {
                if (file.size <= 150000) {
                    passed_validation = true;
                }
                else {
                    passed_validation = `The file: '${file.originalFilename}' is to big! max. 150kb per file`;
                    break;
                }
            }
            else {
                passed_validation = "Supported types: JPG, PNG, JPEG, GIF";
                break;
            }
        }
    }
    return passed_validation;
}
exports.validate_formidable_files = validate_formidable_files;
function validate_single_formidable_file(file) {
    let passed_validation = false;
    //Checking if type of dropped files are jpg / png / jpeg
    if (file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/gif") {
        if (file.size <= 150000) {
            passed_validation = true;
        }
        else {
            passed_validation = `The file: '${file.originalFilename}' is to big! max. 150kb per file`;
        }
    }
    else {
        passed_validation = "Supported types: JPG, PNG, JPEG, GIF";
    }
    return passed_validation;
}
exports.validate_single_formidable_file = validate_single_formidable_file;
function validate_profile_image(file) {
    let passed_validation = false;
    //Checking if type of dropped files are jpg / png / jpeg
    if (file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
        if (file.size <= 1000 * 1024) {
            passed_validation = true;
        }
        else {
            passed_validation = `The file: '${file.originalFilename}' is to big! max. 1mb per file`;
        }
    }
    else {
        passed_validation = "Supported types: JPG, PNG, JPEG, GIF";
    }
    return passed_validation;
}
exports.validate_profile_image = validate_profile_image;
function validate_pack_title(title) {
    const title_regex = new RegExp(/^(?!(?:\S*\s){3})([a-zA-Z0-9 ]{3,25})$/);
    if (title.length < 3)
        return "Min. 3 characters.";
    if (title.length > 25)
        return "Max. 25 characters.";
    if (title_regex.test(title) === false)
        return "Max. 3 words allowed and title can only contain letters from a-z and number between 0-9";
    return true;
}
exports.validate_pack_title = validate_pack_title;
function validate_pack_description(description) {
    const description_regex = new RegExp(/^[a-zA-Z0-9\.\,\-\!\?\_\&\:\ -]{100,500}$/);
    if (description.length < 100)
        return "Min. 100 characters.";
    if (description.length > 500)
        return "Max. 500 characters.";
    if (description_regex.test(description) === false)
        return "Allowed special characters: . , - ! ? _ & :";
    return true;
}
exports.validate_pack_description = validate_pack_description;
function validate_user_description(description) {
    const title_regex = new RegExp(/^(?!(?:\S*\s){12})([a-zA-Z0-9 \.\:\?\!\,\_\-]+)$/);
    if (!title_regex.test(description))
        return "description didnt pass validation. Allowed are 12 words and special characters: . : , ! ? _ -";
    return true;
}
exports.validate_user_description = validate_user_description;
function validate_pack_section_name(section_name) {
    const section_name_regex = new RegExp(/^[a-zA-Z0-9]{3,12}$/);
    if (!section_name_regex.test(section_name))
        return "section name did'nt pass validations";
    return true;
}
exports.validate_pack_section_name = validate_pack_section_name;
function validate_pack_tag(tag_name) {
    const tag_regex = new RegExp(/^[a-zA-Z]{3,10}$/);
    if (tag_name.length === 0)
        return "";
    if (tag_name.length < 3)
        return "Min. 3 characters";
    if (tag_name.length > 10)
        return "Max. 10 characters";
    else {
        if (tag_regex.test(tag_name) === false) {
            return "Allowed characters: a-z A-Z";
        }
        else {
            return true;
        }
    }
}
exports.validate_pack_tag = validate_pack_tag;
function validate_pack_tags(tags) {
    const tag_regex = new RegExp(/^[a-zA-Z]{3,10}$/);
    if (tags.length === 0)
        return "";
    if (tags.length < 3)
        return "Min. 3 Tags";
    else {
        let passed_test = true;
        for (let tag of tags) {
            if (tag_regex.test(tag) === false) {
                passed_test = false;
            }
        }
        if (passed_test === true) {
            return true;
        }
        else {
            return "Tags didnt pass validation";
        }
    }
}
exports.validate_pack_tags = validate_pack_tags;
function validate_license(license) {
    if (license === "opensource") {
        return true;
    }
    else {
        return "License is not supported";
    }
}
exports.validate_license = validate_license;
function validate_username(username) {
    const username_regex = new RegExp(/^(?=.{3,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/);
    if (username_regex.test(username) === true) {
        return true;
    }
    else {
        return "Username didnt pass validation";
    }
}
exports.validate_username = validate_username;
function validate_pack_report_reason(reason) {
    const report_input_regex = new RegExp(/^[a-zA-Z0-9\.\,\-\_?! ]{25,250}$/);
    const valid_reason = report_input_regex.test(reason);
    if (!valid_reason)
        return false;
    return true;
}
exports.validate_pack_report_reason = validate_pack_report_reason;
