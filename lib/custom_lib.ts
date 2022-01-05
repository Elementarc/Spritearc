//Function that returns a string with first letter as uppercase and rest lowercase
export function capitalize_first_letter_rest_lowercase(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


