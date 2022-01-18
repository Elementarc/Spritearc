//Function that returns a string with first letter as uppercase and rest lowercase
export function capitalize_first_letter_rest_lowercase(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function create_number_from_page_query(string: string | string[]): boolean | number {
    try {
        if(typeof string !== "string") return false
        const page_int = parseInt(string)
    
        return page_int

    } catch ( err ) {

        return false
        
    }
    
}


export function check_if_json(value: string): boolean {
    
    try {
        JSON.parse(value)

        return true
    } catch(err) {
        return false
    }
}