import {validate_files} from "../lib/validate_lib"

test("validate_blob", async() => {
    const blob = new Blob([""], {type: "image/png"})
    
    expect(validate_files([blob as any])).toBe(true)
})