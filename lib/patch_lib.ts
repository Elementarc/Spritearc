import path from "path"
import fs from "fs"
import matter from 'gray-matter';
import { PatchnoteInfo} from "../types";
import { compareDesc, compareAsc , format} from "date-fns";
const marked = require("marked")

//Directory of patches
const directoryOfPatches: string = path.join(process.cwd(), "patches")
export class PatchHandler {
    #patchDirectory: string
    patchnoteList: Patchnote[]
    patchnoteListOrdered: any

    //Can take directory to look for pathes. has a Default value.
    constructor(patchDirectory: string = directoryOfPatches) {
        this.#patchDirectory = patchDirectory
        this.patchnoteList = createPatchnoteList(this.#patchDirectory) 
        this.patchnoteListOrdered = createOrderedPatchnoteList(this.patchnoteList)
        //Creating a patchnote Instance for each file in patchDirectory that ends with .md
        function createPatchnoteList(patchDirectory: string): Patchnote[] {
            const patchnoteFiles = fs.readdirSync(patchDirectory)
            //Returning filtered patchnoteList
            let patchnoteList: Patchnote[] = []

            //Checking if Files exist.
            if(patchnoteFiles.length > 0) {
                //Rules for filename.
                const patchnoteFilenameValidator = new RegExp(/^[a-zA-Z1-9{_}?]+\.md$/)
                
                //Lopping through files to push an patchnote instance into this.patchnoteList.
                for(let i = 0; i < patchnoteFiles.length; i++) {
                    
                    //Checking if Filenames are valid.
                    if(patchnoteFilenameValidator.test(patchnoteFiles[i]) === true) {
                        //Initialzing an array that will contain patchnote files without extentions. Used for ids.
                        let filteredPatchnoteFilesWithoutExtentions: string[] = []
                        //Pushing patchnoteFiles without extention to patchArrWithoutExtentions
                        filteredPatchnoteFilesWithoutExtentions.push(patchnoteFiles[i].split(".")[0])

                        
                        //Looping through filteredPatchnoteArr to create a Patchnote instance for each patchnotefile without extention
                        for(let i = 0; i < filteredPatchnoteFilesWithoutExtentions.length; i++) {
                            //Creating patchnote instance using filenames without extention as id
                            let patchnote = new Patchnote(patchDirectory, filteredPatchnoteFilesWithoutExtentions[i])
                            
                            //Checking if Patchnote files have correct structure and not to be null.
                            if(patchnote.info.date && patchnote.info.image  && patchnote.info.title  && patchnote.info.update  && patchnote.content) {
                                patchnoteList.push(patchnote)
                            } else {
                                console.log(`Did not create ${patchnote.id}.md because file is not correctly structured.`)
                            }
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
        
        //Creates a new patchnote list ordered by their dates. Takes in the patchnoteList as a parameter
        function createOrderedPatchnoteList(patchnoteList: Patchnote[]) {
            const patchnotesByDate: Map<Date, Patchnote> = new Map()
            const dates: Date[] = []

            for(let patch of patchnoteList) {
                if(patch.info.date) {
                    const DDMMYYYY_DateArr = patch.info.date.split(".")
                    const day = parseInt(DDMMYYYY_DateArr[0])
                    const month = parseInt(DDMMYYYY_DateArr[1]) - 1
                    const year = parseInt(DDMMYYYY_DateArr[2])
        
                    const dateObj = new Date(year, month, day)
                    dates.push(dateObj)
                    patchnotesByDate.set(dateObj, patch)
                }
            }
            
            const sortedPatchnotes = dates.sort().map((date) => {
                
                return patchnotesByDate.get(date)
            })

            return sortedPatchnotes
            
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

export class Patchnote {
    id: string
    info: PatchnoteInfo
    content: string
    #patchDirectory: string

    //Reading .md Files to get info & content of a Patchnote. Finding Patchnote by id. id = filename without extention
    constructor(patchDirectory: string ,id: string) {
        this.#patchDirectory = patchDirectory
        this.id = id
        this.info
        this.content

        //Returning Patchinformations about a specific Patch
        function getInfo(directory: string, id: string): PatchnoteInfo {
            const getPatchContent = fs.readFileSync(`${directory}/${id}.md`, "utf-8")
        
            //Getting md variables from patch
            const matterResult = matter(getPatchContent)
            const patchInfo =  matterResult.data as { title?: string, date?: string, update?: string, image?: string}
            
            const fullPatchInfo: PatchnoteInfo = {
                title: patchInfo.title,
                update: patchInfo.update,
                date: patchInfo.date,
                image: patchInfo.image,
            }
            return fullPatchInfo
        }
        //Returning Patchcontent about a specific Patchas an HTMLString
        function getContent(directory: string, id: string): string {
            const getPatchContent = fs.readFileSync(path.join(directory, `${id}.md`), "utf-8")
        
            const html = marked(`${getPatchContent}`);
            return html
        }
        this.info = getInfo(this.#patchDirectory, this.id)
        this.content = getContent(this.#patchDirectory, this.id)
    }
}

const patchHandler = new PatchHandler()
export default patchHandler

