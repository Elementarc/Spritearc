import fs from "fs"
import del from "del"
import logger from "./logger"
export async function delete_directory(directory_path: string): Promise<boolean | string> {
    
    try {
        await del([directory_path])

        return true
    } catch(err) {
        logger.error(err)
        return true
    }
    
}

export function delete_file(file_path: string) {

    try {
        fs.unlinkSync(file_path)
    } catch(err) {
        logger.warn(err)
    }
    
}