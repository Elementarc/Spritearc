import { Create_pack_frontend } from "../types"

//Creating a FormData that is used to send a pack files and infos to backend.
export function create_form_data(pack: Create_pack_frontend): FormData | null {
    if(!pack.license) return null
    if(!pack.content) return null
    if(!pack.title) return null
    if(!pack.description) return null
    if(!pack.preview.preview_asset) return null
    if(!pack.tags) return null
    
    let pack_content: {section_name: string, section_assets: File[]}[] = []

    for(let [key, value] of pack.content.entries()) {
        pack_content.push({
            section_name: key,
            section_assets: value.section_assets 
        })
    }

    const form_data = new FormData()

    form_data.set("title", pack.title)
    form_data.set("description", pack.description)
    form_data.set("license", pack.license)
    form_data.set("preview", pack.preview.preview_asset, `preview`)
    form_data.set("tags", JSON.stringify(pack.tags))


    for(let section of pack_content) {
        
        for(let i = 0; i < section.section_assets.length; i ++) {
            form_data.append(section.section_name.toLowerCase(), section.section_assets[i], `${section.section_name.toLowerCase()}_${i}`)
        }
        
    }
    
    return form_data

}