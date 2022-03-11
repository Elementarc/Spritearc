import { Create_pack_frontend } from "../types"

//Creating a FormData that is used to send a pack files and infos to backend.
export function create_form_data(pack: Create_pack_frontend): FormData | string {
    if(!pack.license) return "No License found"
    if(!pack.content) return "No content found"
    if(!pack.title) return "No title found"
    if(!pack.description) return "No pack description found"
    if(!pack.preview.preview_asset) return "No Preview found"
    if(!pack.tags) return "No tags found"
    if(!pack.perspective) return "No Perspective found"
    if(!pack.resolution) return "No resolution found"

    try{
        let pack_content: {section_name: string, section_assets: File[]}[] = []

        for(let [key, value] of pack.content.entries()) {
            pack_content.push({
                section_name: key,
                section_assets: value.section_assets 
            })
        }

        const form_data = new FormData()
    
        form_data.set("title", `${pack.title}`)
        form_data.set("description", `${pack.description}`)
        form_data.set("license", `${pack.license}`)
        form_data.set("preview", pack.preview.preview_asset, `preview`)
        form_data.set("tags", JSON.stringify(pack.tags))

        const perspective = (() => {
            if(!pack?.perspective) return null
            if(pack?.perspective.toLowerCase() === "all" || pack?.perspective.toLowerCase() === "other") return null
            return pack?.perspective.toLowerCase()
        })();
    
        if(perspective) {
            form_data.set("perspective", `${pack?.perspective}`)
        }

        const resolution = (() => {
            if(!pack?.resolution) return null
            if(pack?.resolution.toLowerCase() === "all" || pack?.resolution.toLowerCase() === "other") return null
            return pack?.resolution.toLowerCase()
        })();
        
        if(resolution) {
            form_data.set("resolution", `${pack?.resolution}`)
        }

        for(let section of pack_content) {
            
            for(let i = 0; i < section.section_assets.length; i ++) {
                form_data.append(section.section_name.toLowerCase(), section.section_assets[i], `${section.section_name.toLowerCase()}_${i}`)
            }
            
        }
        
        return form_data

    } catch(err) {
        return "Something went wrong while trying to create your form data"
    }
}