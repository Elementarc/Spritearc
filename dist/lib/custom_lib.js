"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check_if_json = exports.sort_packs_section = exports.create_number_from_page_query = exports.capitalize_first_letter_rest_lowercase = exports.SORT_ACTIONS = void 0;
exports.SORT_ACTIONS = {
    BY_RATING: "BY_RATING",
    BY_DOWNLOADS: "BY_DOWNLOADS",
    BY_RECENT: "BY_RECENT",
    REMOVE_SORT: null
};
function capitalize_first_letter_rest_lowercase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
exports.capitalize_first_letter_rest_lowercase = capitalize_first_letter_rest_lowercase;
function create_number_from_page_query(string) {
    try {
        if (typeof string !== "string")
            return false;
        const page_int = parseInt(string);
        return page_int;
    }
    catch (err) {
        return false;
    }
}
exports.create_number_from_page_query = create_number_from_page_query;
function sort_packs_section(packs, sort_action) {
    if (!sort_action)
        return packs;
    if (!packs)
        return null;
    //Used to not mutate array that got inputted
    const new_packs_arr = [...packs];
    switch (sort_action) {
        case exports.SORT_ACTIONS.BY_DOWNLOADS: {
            const sorted_packs = new_packs_arr.sort((a, b) => {
                return b.downloads - a.downloads;
            });
            return sorted_packs;
        }
        case exports.SORT_ACTIONS.BY_RECENT: {
            const sorted_packs = new_packs_arr.sort((a, b) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
            return sorted_packs;
        }
        case exports.SORT_ACTIONS.BY_RATING: {
            const sorted_packs = new_packs_arr.sort((a, b) => {
                let a_ratings = 0;
                let b_ratings = 0;
                for (let rating of a.ratings) {
                    a_ratings = a_ratings + rating.rating;
                }
                for (let rating of b.ratings) {
                    b_ratings = b_ratings + rating.rating;
                }
                let a_avg_rating = a_ratings / 5;
                let b_avg_rating = b_ratings / 5;
                return b_avg_rating - a_avg_rating;
            });
            return sorted_packs;
        }
        default: {
            return packs;
        }
    }
}
exports.sort_packs_section = sort_packs_section;
function check_if_json(value) {
    try {
        JSON.parse(value);
        return true;
    }
    catch (err) {
        return false;
    }
}
exports.check_if_json = check_if_json;
