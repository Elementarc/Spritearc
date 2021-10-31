import path from "path"
import fs from "fs"
import matter from 'gray-matter';
import { PatchnoteInfo} from "../types";
import { compareDesc, format } from "date-fns";
const marked = require("marked")
const patchDirectory = path.join(process.cwd(), "patches")

class PatchHandler {
    patchnoteList: Patchnote[]

    constructor() {
        this.patchnoteList = createPatchnoteList()

        
        function createPatchnoteList(): Patchnote[] {
            const patchnoteFiles = fs.readdirSync(patchDirectory)
            //Returning filtered patchnoteList
            let patchnoteList: Patchnote[] = []

            if(patchnoteFiles.length > 0) {
                const patchnoteFilenameValidator = new RegExp(/^[a-zA-Z1-9{_}?]+\.md$/gm)
                
                //Looping through patchnoteFiles to return patchArrWithoutExtentions
                for(let i = 0; i < patchnoteFiles.length; i++) {

                    //Checking if Filenames are valid
                    if(patchnoteFilenameValidator.test(patchnoteFiles[i]) === true) {
                        let filteredPatchnoteFilesWithoutExtentions: string[] = []
                        //Pushing patchnoteFiles without extention to patchArrWithoutExtentions
                        filteredPatchnoteFilesWithoutExtentions.push(patchnoteFiles[i].split(".")[0])

                        //Pushing Pathcnote instance into PatchnoteList
                        for(let i = 0; i < filteredPatchnoteFilesWithoutExtentions.length; i++) {
                            let patchnote = new Patchnote(filteredPatchnoteFilesWithoutExtentions[i])
                            patchnoteList.push(patchnote)
                        }

                    } else {
                        console.log(`${patchnoteFiles[i]} did not pass the patchnoteFilenameValidator`)
                    }

                }
               
                //Patchnote[]
                return patchnoteList
    
            } else {
                console.log("could not find any patches! Or Patch filename contains not allowed Characters")
                //Empty PatchnoteList
                return patchnoteList
                
            }
        }
        
        
    }

    getPatchnote(id: string) {

        for(let i = 0; i < this.patchnoteList.length; i++) {
            if(id === this.patchnoteList[i].id) {
                return this.patchnoteList[i]
            }
        }

    }
}

class Patchnote {
    id: string
    info: PatchnoteInfo
    content: string
    constructor(id: string) {
        this.id = id
        this.info
        this.content

        //Returning Patchinformations about a specific Patch
        function getInfo(id: string): PatchnoteInfo {
            const getPatchContent = fs.readFileSync(`${patchDirectory}/${id}.md`, "utf-8")
        
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
        
            const fullPatchInfo: PatchnoteInfo = {
                title: validatePatchInfoData(patchInfo.title),
                update: validatePatchInfoData(patchInfo.update),
                date: validatePatchInfoData(patchInfo.date),
                image: validatePatchInfoData(patchInfo.image),
            }
            return fullPatchInfo
        }
        //Returning Patchcontent about a specific Patchas an HTMLString
        function getContent(id: string): string {
            const getPatchContent = fs.readFileSync(path.join(patchDirectory, `${id}.md`), "utf-8")
        
            const html = marked(`${getPatchContent}`);
            return html
        }
        this.info = getInfo(this.id)
        this.content = getContent(this.id)
    }
}

const patchHandler = new PatchHandler()
export default patchHandler

