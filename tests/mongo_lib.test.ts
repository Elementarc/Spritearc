import {get_public_user, email_available, username_available, get_released_packs_by_user} from "../lib/mongo_lib"

import { Public_user } from "../types"
import { ObjectId } from "mongodb"

test("get_public_user", async() => {

    const public_user_obj: Public_user = {
        username: "King",
        description: "Hey! Im new here :)",
        created_at: new Date("2022-01-02T12:15:57.603Z"),
        profile_picture: "default.png",
        profile_banner: "default.png",
        following: [],
        followers: [],
        released_packs: [],
    }
    const public_user = await get_public_user("King")

    expect(public_user).toStrictEqual(public_user_obj)
})

test("get_released_packs_by_user", async() => {

    const packs = await get_released_packs_by_user([])
    expect(packs).toStrictEqual([])
})

test("email_available", async() => {

    const available = await email_available("test@gmail.com")

    expect(available).toBe(true)
})

test("username_available", async() => {

    const available = await username_available("KingKong42")

    expect(available).toBe(true)
})




