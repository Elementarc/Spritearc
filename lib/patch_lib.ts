import path from "path"
import fs from "fs"
import matter from 'gray-matter';
import { Patchnote_info} from "../types";
import compareDesc from "date-fns/compareDesc";

//Directory of patches
const directoryOfPatches: string = path.join(process.cwd(), "patches")


export class PatchHandler {
    #patchDirectory: string
    patchnoteList: Patchnote[]
    patchnoteListOrdered: Patchnote[]

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
                        for(let n = 0; n < filteredPatchnoteFilesWithoutExtentions.length; n++) {
                            //Creating patchnote instance using filenames without extention as id
                            let patchnote = new Patchnote(patchDirectory, filteredPatchnoteFilesWithoutExtentions[n])
                            
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

        //Creates a new patchnote list ordered by their dates. Takes in the patchnoteList as a parameter
        function createOrderedPatchnoteList(patchnoteList: Patchnote[]) {
            const patchnotesByDate: Map<Date, Patchnote> = new Map()
            const dates: Date[] = []
            
            for(let patch of patchnoteList) {

                if(patch.info.date) {
                    dates.push(patch.info.date)
                    patchnotesByDate.set(patch.info.date, patch)
                }

            }
            
            const sortedPatchnotes = dates.sort(compareDesc).map((date) => {
                
                return patchnotesByDate.get(date) as Patchnote
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
    info: Patchnote_info
    content: string
    #patchDirectory: string

    //Reading .md Files to get info & content of a Patchnote. Finding Patchnote by id. id = filename without extention
    constructor(patchDirectory: string ,id: string) {
        this.#patchDirectory = patchDirectory
        this.id = id
        this.info = getInfo(this.#patchDirectory, this.id)
        this.content = getContent(this.#patchDirectory, this.id)
        
        //Returning Patchinformations about a specific Patch
        function getInfo(directory: string, id: string): Patchnote_info {
            const getPatchContent = fs.readFileSync(`${directory}/${id}.md`, "utf-8")
            const { birthtime } = fs.statSync(`${directory}/${id}.md`)
            //Getting md variables from patch
            const matterResult = matter(getPatchContent)
            const mdPatchInfo =  matterResult.data as { title?: string, update?: string, image?: string, author?: string}

            function patchInfoTitleValidator(title: string | undefined) {
                if(title) {
                    return title
                } else {
                    console.log(`Could not find a title property in ${id}.md, created a fallback. Please review the file!`)
                    return "Title Fallback"
                }
            }

            function patchInfoUpdateValidator(update: string | undefined) {
                if(update) {
                    return update
                } else {
                    console.log(`Could not find an update property in ${id}.md, Created a Fallback. Please review the File!`)
                    return "Update Fallback"
                }
            }

            function patchInfoImageValidator(image: string | undefined) {
                if(image) {
                    return image
                } else {
                    console.log(`Could not find an Image property in ${id}.md, created a fallback. Please review the file!`)
                    return "fallback.jpg"
                }
            }

            function patchInfoAuthorValidator(author: string | undefined) {
                if(author) {
                    return author
                } else {
                    console.log(`Could not find an Author property in ${id}.md, created a fallback. Please review the file!`)
                    return "PixelPalast"
                }
            }
            
            const fullPatchInfo: Patchnote_info = {
                title: patchInfoTitleValidator(mdPatchInfo.title),
                update:  patchInfoUpdateValidator(mdPatchInfo.update),
                date: new Date(birthtime),
                image:  patchInfoImageValidator(mdPatchInfo.image),
                author: patchInfoAuthorValidator(mdPatchInfo.author)
            }
            return fullPatchInfo
        }
        //Returning Patchcontent about a specific Patchas an HTMLString
        function getContent(directory: string, id: string): string {
            const getPatchContent = fs.readFileSync(path.join(directory, `${id}.md`), "utf-8")
            const matterResult = matter(getPatchContent)

            if(getPatchContent) {
                return matterResult.content
            } else {
                return "Content Fallback"
            }
            
        }
    }
}

const patchHandler = new PatchHandler()
export default patchHandler

