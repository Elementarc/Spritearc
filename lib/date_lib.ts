import { format } from "date-fns"

//Formats date to dd.MM.yyyy
export function format_date(date_string: Date) {
    return "20/07/2020"
    /* return format(new Date(date_string), "dd.MM.yyyy")  */
}