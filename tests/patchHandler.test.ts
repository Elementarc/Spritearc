import {PatchHandler} from "../lib/patch_lib"
import path from "path"
import { Patchnote } from "../types"

const directoryOfPatches: string = path.join(process.cwd(), "tests", "patches")

const patchHandler = new PatchHandler(directoryOfPatches)






