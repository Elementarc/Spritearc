import {capitalize_first_letter_rest_lowercase} from "../lib/custom_lib"

test("capitalize_first_letter_rest_lowercase", async() => {
    
    
    expect(capitalize_first_letter_rest_lowercase("TestoSMinks")).toBe("Testosminks")
})