import path from "path"
import fs from "fs"
import matter from 'gray-matter';
import { PatchInformation} from "../types";
const marked = require("marked")
const patchDirectory = path.join(process.cwd(), "patches")

//Getting all patches from patches directory. Returning an Array of paths for those Patches
export function getPatches(): string[] {
    //Getting all Files in patches directory
    const files = fs.readdirSync(patchDirectory)

    return files
}
//Getting all patches by their Names
export function getAllPatchIds():string[] {
    const patchFiles = getPatches()

    const patchArrWithoutExtentions = patchFiles.map((patch) => {
        return patch.split(".")[0]
    })
    return patchArrWithoutExtentions
}
//Getting All patch Informations.
export function getAllPatchInfos(allPatchIds: string[]): PatchInformation[] {

    const patchInfoArr = allPatchIds.map((patchId) => {
        const getPatchInfos = getPatchInfo(patchId)
        
        return getPatchInfos
    })
    
    
    return patchInfoArr
}
//Returning an Array of paths for each Patch
export function getAllStaticPatchUrls(allPatchIds: string[]): string[] {
    //Creating a static path from patchid
    const pathsArray = allPatchIds.map((patch) => {

        return `/news/${patch}`
    })
    return pathsArray
}
//Returning Patchcontent about a specific Patchas an HTMLString
export function getPatchContent(patch_id: string): string {
    const getPatchContent = fs.readFileSync(path.join(patchDirectory, `${patch_id}.md`), "utf-8")

    const html = marked(`${getPatchContent}`);
    console.log(html)
    return html
}
//Returning Patchinformations about a specific Patch
export function getPatchInfo(patch_id: string): PatchInformation {
    const getPatchContent = fs.readFileSync(`${patchDirectory}/${patch_id}.md`, "utf-8")

    //Getting md variables from patch
    const matterResult = matter(getPatchContent)
    const patchInfo =  matterResult.data as { title?: string, date?: string, update?: string, image?: string}
    
    //If Any of them are undefined this function replaces it with a string called Fallback
    function validatePatchInfoData(info: string | undefined): string {
        if(info !== undefined) {
            return info
        } else {
            return `Fallback`
        }
    }

    const fullPatchInfo: PatchInformation = {
        id: patch_id,
        title: validatePatchInfoData(patchInfo.title),
        update: validatePatchInfoData(patchInfo.update),
        date: validatePatchInfoData(patchInfo.date),
        image: validatePatchInfoData(patchInfo.image),
    }

    return fullPatchInfo 
}