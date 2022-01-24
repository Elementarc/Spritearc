import fs from "fs"
import del from "del"

export async function delete_directory(directory_path: string): Promise<boolean | string> {
    
    const deleted_packs = await del([directory_path])

    if(deleted_packs.length === 0) return "Didnt delete any packs from filesystem"

    return true
}

export function delete_file(file_path: string) {

    fs.unlinkSync(file_path)
}