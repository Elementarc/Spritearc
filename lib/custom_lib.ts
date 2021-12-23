
export function capitalize_first_letter_rest_lowercase(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

//return true if blob type is valid
export function validate_blob(blob: Blob): boolean | string {
    
    //Checking if type of dropped files are jpg / png / jpeg
    if(blob.type === "image/jpg" || blob.type === "image/png" || blob.type === "image/jpeg" || blob.type === "image/gif") {

        if(blob.size <= 150000) {
            return true
        } else {
            return "File is to big! max. 150kb per file"
        }
        

    } else {

        return "Supported types: JPG, PNG, JPEG, GIF"
    }

}