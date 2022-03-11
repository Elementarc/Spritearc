import {validate_profile_image, validate_files,  validate_formidable_files, validate_single_formidable_file, validate_license, validate_email, validate_pack_description, validate_pack_perspective,validate_pack_report_reason,validate_pack_resolution,validate_pack_section_name,validate_pack_tag,validate_pack_tags,validate_pack_title,validate_password,validate_paypal_donation_link,validate_search_query,validate_social,validate_user_description,validate_username} from "../spritearc_lib/validate_lib"

//User tests
test("validate email", async() => {

    expect(validate_email("test@gmail.com")).toBe(true)
    expect(validate_email("testgmail.com")).toBe("Please use a corretly formatted email!")
})
test("validate password", async() => {
    
    expect(validate_password("Insanepassword1")).toBe(true)
    expect(validate_password("omega-Items_1")).toBe(true)
    expect(validate_password("flower")).toBe("Password is to short!")
    expect(validate_password("insanepassword1insanepassword1insanepassword1insanepassword1insanepassword1")).toBe("Password is to long!")
    expect(validate_password("insanepassword1")).toBe("Your password is not safe enough! Make sure it atleast contains: 1 Uppercase and 1 number character!")
    
})
test("validate username", async() => {
    
    expect(validate_username("spritearc")).toBe(true)
    expect(validate_username("spritearc_newest")).toBe(true)
    expect(validate_username("s_i_o_l_a")).toBe(true)
    expect(validate_username("sp")).toBe("Username is to short!")
    expect(validate_username("sprtiearc_new_era_lol")).toBe("Username is to long!")
    expect(validate_username(".spritearc")).toBe("You cannot use special characters at the beginning or at the end of your username!")
    expect(validate_username("spritearc.")).toBe("You cannot use special characters at the beginning or at the end of your username!")
    expect(validate_username("sprit__earc")).toBe("Username cannot contain 2 special characters after each other.")
    expect(validate_username("sprit..earc")).toBe("Username cannot contain 2 special characters after each other.")
})
test("validate user description", async() => {
    
    expect(validate_user_description("testä_21;_test()")).toBe(true)
    expect(validate_user_description("This is my description! It's me! :)")).toBe(true)
    expect(validate_user_description("This is my description! It's me! :)")).toBe(true)
    expect(validate_user_description("This is my description! It's me! :). Maybe help me get good through this!")).toBe("To Long!")
    expect(validate_user_description("t")).toBe("To short!")
    expect(validate_user_description("testä_21;_test()@")).toBe("Cant use description! Probably using a special character that is not allowed.")
})
test("validate donation link", async() => {
    
    expect(validate_paypal_donation_link("https://www.paypal.com/donate/?hosted_button_id=T5UW7WT8JZNCC")).toBe(true)
    expect(validate_paypal_donation_link("")).toBe(true)
    expect(validate_paypal_donation_link("https://www.paypal.com/donate/?hosted_button_id=T")).toBe("Donation Link is not valid!")
    expect(validate_paypal_donation_link("https://www.paypal.com/donate/?hosted_button_id=TT5UW7WT8JZNCCT5UW7WT8JZNCCT5UW7WT8JZNCCT5UW7WT8JZNCC")).toBe("Donation Link is not valid!")
    
})

test("validate search query", async() => {
    
    expect(validate_search_query("Test")).toBe(true)
    expect(validate_search_query("2d")).toBe(true)
    expect(validate_search_query("Test-oh")).toBe(true)
    expect(validate_search_query("2")).toBe("Please enter a valid search query!")
    expect(validate_search_query("Test 2")).toBe("Please enter a valid search query!")
    
    expect(validate_search_query("Testohohohoohoasdasdasdasdasdasdasd")).toBe("Please enter a valid search query!")
    
    
})
test("validate social", async() => {
    
    expect(validate_social("testä")).toBe(true)
    expect(validate_social("testä_21")).toBe(true)
    expect(validate_social("")).toBe(true)
    expect(validate_social("testä_21;")).toBe("Social is not valid")
    expect(validate_social("testä_21_52_newcomer_of_the_year")).toBe("Social is not valid")
    expect(validate_social("testä_'")).toBe("Social is not valid")
})

//PACK TESTS
test("validate license", async() => {

    expect(validate_license("opensource")).toBe(true)
    expect(validate_license("attribution")).toBe(true)
    expect(validate_license("attributions")).toBe("License is not supported")
})
test("validate pack Title", async() => {
    
    expect(validate_pack_title("Title is Awesome")).toBe(true)
    expect(validate_pack_title("Platformer")).toBe(true)
    expect(validate_pack_title("Platformer-Pack")).toBe(true)
    expect(validate_pack_title("Platformer Pack")).toBe(true)
    expect(validate_pack_title("2d")).toBe("Min. 3 characters.")
    expect(validate_pack_title("Platformer-Packeditionnewest")).toBe("Max. 25 characters.")
    expect(validate_pack_title("Title is_Awesome")).toBe("Max. 3 words allowed. Make sure to not use special Characters")
    expect(validate_pack_title("Title is LOL Omega")).toBe("Max. 3 words allowed. Make sure to not use special Characters")
})
test("validate pack description", async() => {

    expect(validate_pack_description("This is pack description")).toBe("Min. 50 characters.")
    expect(validate_pack_description("This is pack description. It is new and gonna be awesome")).toBe(true)
})
test("validate pack perspective", async() => {

    expect(validate_pack_perspective("top-down")).toBe(true)
    expect(validate_pack_perspective("isometric")).toBe(true)
    expect(validate_pack_perspective("side-scroller")).toBe(true)
    expect(validate_pack_perspective("side-scrollers")).toBe("Perspective is not valid")
})
test("validate pack resolution", async() => {
    
    expect(validate_pack_resolution("8x8")).toBe(true)
    expect(validate_pack_resolution("16X16")).toBe(true)
    expect(validate_pack_resolution("32x32")).toBe(true)
    expect(validate_pack_resolution("64x64")).toBe(true)
    expect(validate_pack_resolution("128x128")).toBe(true)
    expect(validate_pack_resolution("256x256")).toBe(true)
    expect(validate_pack_resolution("4x4")).toBe("Resolution is not valid")
    expect(validate_pack_resolution("4x4x")).toBe("Resolution is not valid")
    expect(validate_pack_resolution("500x500")).toBe("Resolution is not valid")
})
test("validate pack report reason", async() => {

    expect(validate_pack_report_reason("This pack has nsfw content included! Please remove.")).toBe(true)
    expect(validate_pack_report_reason("bo")).toBe(false)
})
test("validate pack section name", async() => {

    
    expect(validate_pack_section_name("test-pack")).toBe(true)
    expect(validate_pack_section_name("test-packs")).toBe(true)
    expect(validate_pack_section_name("to")).toBe("Section name is to short!")
    expect(validate_pack_section_name("This-new-section-name")).toBe("Section name is to Long!")
    expect(validate_pack_section_name("Test_pack")).toBe("Sectioname can only contain characters a-z A-Z and number between 0-9")
    expect(validate_pack_section_name("Test_pack")).toBe("Sectioname can only contain characters a-z A-Z and number between 0-9")
})
test("validate pack tag", async() => {
    
    expect(validate_pack_tag("")).toBe("")
    expect(validate_pack_tag("t")).toBe("Min. 2 characters")
    expect(validate_pack_tag("2d")).toBe(true)
    expect(validate_pack_tag("MMORPG")).toBe(true)
    expect(validate_pack_tag("MMORPG-multiplayer")).toBe("Max. 12 characters")
    expect(validate_pack_tag("MMORPG-test")).toBe("Allowed characters: a-z A-Z 0-9")
    expect(validate_pack_tag("fantasy")).toBe(true)
})
test("validate pack tags", async() => {
    
    expect(validate_pack_tags(["Weapons", "MMO", "fantasy"])).toBe(true)
    expect(validate_pack_tags([])).toBe("")
    expect(validate_pack_tags(["Weapons", "MMO"])).toBe("Min. 3 Tags")
    expect(validate_pack_tags(["Weapons", "MMO", "ITEMS", "OOHH", "Dange", "tanks"])).toBe("Max. 3 Tags")
    expect(validate_pack_tags(["Weapons", "MMO", "ITEMS", "OOHH", "Dange-"])).toBe("Tags didnt pass validation")
})




