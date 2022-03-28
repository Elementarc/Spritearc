import { ObjectId } from "mongodb"
import { Public_user } from "./user"

export class Pack {
    _id: ObjectId
    username: string
    perspective: string | null
    resolution: string | null
    preview: string
    title: string
    license: string
    description: string
    date: Date
    views: number
    popularity: number
    tags: string[]
    downloads: number
    content: Pack_content[]
    ratings: Pack_rating[]
    avg_rating: number = 0

    constructor(id: ObjectId, username: string, pack_content: Pack_content[], ratings: Pack_rating[], perspective: string | null, tags: string[], resolution: string | null, preview: string, title: string, license: string, description: string, ) {
        this._id = id
        this.username = username
        this.perspective = perspective
        this.resolution = resolution
        this.preview = preview
        this.title = title
        this.license = license
        this.description = description
        this.date = new Date()
        this.tags = tags
        this.views = 0
        this.popularity = 0
        this.downloads = 0
        this.content = pack_content
        this.ratings = ratings
    }

}

export class Pack_content {
    section_name: string
    section_images: string[]

    constructor(section_name: string, section_images: string[]) {
        this.section_name = section_name
        this.section_images = section_images
    }
}

export class Pack_rating {
    user_id: ObjectId
    rating: number

    constructor(user_id: ObjectId, rating: number) {
        this.user_id = user_id
        this.rating = rating
    }
}

export class Pack_upload_history {
    pack_id: ObjectId
    user: Public_user
    pack_title: string
    pack_description: string
    date: Date

    constructor(pack_id: ObjectId, public_user: Public_user, pack_title: string, pack_description: string) {
        this.pack_id = pack_id
        this.user = public_user
        this.date = new Date()
        this.pack_title = pack_title
        this.pack_description = pack_description
    }
}