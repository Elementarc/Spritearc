import {validate_blob, capitalize_first_letter_rest_lowercase} from "../lib/custom_lib"
import { Blob } from "buffer"

test("validate_blob", async() => {
    const blob = new Blob([""], {type: "image/png"})
    
    expect(validate_blob(blob as any)).toBe(true)
})

test("capitalize_first_letter_rest_lowercase", async() => {
    
    
    expect(capitalize_first_letter_rest_lowercase("TestoSMinks")).toBe("Testosminks")
})