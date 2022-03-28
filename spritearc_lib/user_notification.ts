import { ObjectId } from "mongodb"
import { Public_user } from "./user"



export const NOTIFICATION_TYPES = {
    FOLLOW: "follow",
    UPLOAD: "upload"
}

export interface INotification {
    message: string
    date: Date
    type: string
    seen: boolean
    from: Public_user
    pack_id: ObjectId | null
}

export class User_notification implements INotification {
    message: string
    date: Date = new Date()
    seen: boolean = false
    from: Public_user
    type: string 
    pack_id: ObjectId | null

    constructor(from: Public_user, message: string, pack_id: ObjectId | null, type: string,) {
        this.message = message
        this.from = from
        this.type = type
        this.pack_id = pack_id ? pack_id : null
    }
}