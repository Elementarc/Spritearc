import path from "path"
import fs from "fs"
import matter from 'gray-matter';
import { PatchInformation, FullPatchInformation} from "../types";
const marked = require("marked")

const patchDirectory = path.join(process.cwd(), "patches")

//Getting all patches from patches directory. Returning an Array of paths for those Patches
export function getPatches(): string[] {
    //Getting all Files in patches directory
    const files = fs.readdirSync(patchDirectory)

    return files
}

//Getting the id of the a specific patch. (We use filenames as the id without the extention)
export function getPatchId(patchArr: string[]):string[] {
    const patchArrWithoutExtentions = patchArr.map((patch) => {
        return patch.split(".")[0]
    })
    
    return patchArrWithoutExtentions
}
//Getting all patches by their ids
export function getAllPatchIds():string[] {
    const patchFiles = getPatches()

    const patchArrWithoutExtentions = patchFiles.map((patch) => {
        return patch.split(".")[0]
    })
    return patchArrWithoutExtentions
}

//Creating static PatchUrls for each patch.
export function getStaticPatchUrl(): string[] {
    const getPatchIds = getAllPatchIds()
    //Creating a static path from patchid
    const pathsArray = getPatchIds.map((patch) => {

        return `/news/${patch}`
    })

    return pathsArray
}

//Getting informations about the patch itself
export function getPatchInfo(patch_id: string): FullPatchInformation {
    const getPatchContent = fs.readFileSync(path.join(patchDirectory, `${patch_id}.md`), "utf-8")

    //Getting md variables from patch
    const matterResult = matter(getPatchContent)
    const patchInfo =  matterResult.data as { title: string, date: string, update: string, image: string}
    const fullPatchInfo: FullPatchInformation = {
        id: patch_id,
        title: patchInfo.title,
        update: patchInfo.update,
        date: patchInfo.date,
        image: patchInfo.image,
    }
    return fullPatchInfo
}

//Getting All patch Informations
export function getAllPatchInfos(): FullPatchInformation[] {
    const patchArr = getPatches()
    const patchIdArr = getPatchId(patchArr)

    const patchInfoArr = patchIdArr.map((patchId) => {
        const getPatchInfos = getPatchInfo(patchId)
        
        return getPatchInfos
    })
    
    
    return patchInfoArr
}

//Getting the content of a specific Patch
export function getPatchContent(patch_id: string): string {
    const getPatchContent = fs.readFileSync(path.join(patchDirectory, `${patch_id}.md`), "utf-8")

    const html = marked(`${getPatchContent}`);
    return html
}


