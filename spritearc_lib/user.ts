import { ObjectId } from "mongodb"
import { create_random_number } from "./utils"

export class User {
    _id: ObjectId
    email: string
    password: string
    salt: string
    verified: boolean = false
    notifications: [] = []
    occasional_emails: boolean
    username: string
    description: string = "Hey! Im new here :)"
    created_at: Date
    socials = new Account_socials()
    profile_picture: string
    profile_banner: string = "default_profile_banner.png"
    following: ObjectId[] | [] = []
    following_count = 0
    followers: ObjectId[] | [] = []
    followers_count = 0
    role: string = "member"
    paypal_donation_link: string | null = null
    banned: boolean = false
    credits: number = 0

    constructor(username: string, email: string, password: string, salt: string, occasional_emails: boolean) {
        this._id = new ObjectId()
        this.username = username
        this.email = email
        this.password = password
        this.salt = salt
        this.occasional_emails = occasional_emails
        this.created_at = new Date()
        this.profile_picture = `default_avatar_icon_${create_random_number(12)}.png`
    }
}
export class Account_socials {
    instagram: string
    twitter: string
    artstation: string

    constructor(instagram?: string, twitter?: string, artstation?: string) {
        this.instagram = instagram ? instagram : ""
        this.twitter = twitter ? twitter : ""
        this.artstation = artstation ? artstation : ""
    }

    set_socials(instagram?: string, twitter?: string, artstation?: string) {
        this.instagram = instagram ? instagram : ""
        this.twitter = twitter ? twitter : ""
        this.artstation = artstation ? artstation : ""
    }
}
export class Public_user {
    _id: string
    username: string
    description: string
    verified: boolean
    created_at: Date
    socials: Account_socials
    profile_picture: string
    profile_banner: string
    following_count = 0
    followers_count = 0
    role: string
    paypal_donation_link: string | null
    banned: boolean
    constructor(user: User) {
        this._id = user._id.toString()
        this.username = user.username
        this.description = user.description
        this.verified = user.verified
        this.created_at = user.created_at
        this.socials = user.socials
        this.following_count  = user.following_count ? user.following_count : 0
        this.followers_count = user.followers_count ? user.followers_count : 0
        this.profile_picture = user.profile_picture
        this.profile_banner = user.profile_banner
        this.role = user.role
        this.paypal_donation_link = user.paypal_donation_link
        this.banned = user.banned ? user.banned : false
    }

}