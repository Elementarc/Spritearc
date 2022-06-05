import { ObjectId } from "mongodb"

export class Achievement {
    _id: ObjectId
    label: string
    preview_image: string
    counter: number
    difficulty: string
    requirement: string
    reward: number

    constructor(label: string, difficulty: string, requirement: string, reward: number, preview_image) {
        this._id = new ObjectId()
        this.label = label
        this.preview_image = preview_image
        this.counter = 0
        this.difficulty = difficulty
        this.requirement = requirement
        this.reward = reward
    }

}

