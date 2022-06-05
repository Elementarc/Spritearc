import { Pack } from "../types";

export const SORT_ACTIONS = {
    BY_RATING: "rating",
    BY_DOWNLOADS: "downloads",
    BY_RECENT: "recent",
    REMOVE_SORT: null
}

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

export function sortPacks(packs: Pack[], sort_action: string | null){
    if(!sort_action) return packs
    if(!packs) return []
    //Used to not mutate array that got inputted
    const new_packs_arr = [...packs]
    
    switch( sort_action ) {

        case SORT_ACTIONS.BY_DOWNLOADS : {

            const sorted_packs = new_packs_arr.sort((a, b) => {

                return b.downloads - a.downloads
            })

            return sorted_packs
        }

        case SORT_ACTIONS.BY_RECENT : {
            const sorted_packs = new_packs_arr.sort((a, b) => {
                
                return   new Date(b.date).getTime() - new Date(a.date).getTime()
            })
            return sorted_packs
        }

        case SORT_ACTIONS.BY_RATING : {
            const sorted_packs = new_packs_arr.sort((a, b) => {
                let a_ratings = 0
                let b_ratings = 0
                for(let rating of a.ratings) {
                    a_ratings = a_ratings + rating.rating
                }
                for(let rating of b.ratings) {
                    b_ratings = b_ratings + rating.rating
                }
                let a_avg_rating = a_ratings / 5
                let b_avg_rating = b_ratings / 5

                return b_avg_rating - a_avg_rating
            })

            return sorted_packs
        }

        default : {
            return packs
        }
    }
}

export function check_if_json(value: any): boolean {
    
    try {
        JSON.parse(value)

        return true
    } catch(err) {
        return false
    }
}

export function generate_random_string(length: number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
        charactersLength));
    }
    return result;
}
