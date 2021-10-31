import {Patchnote} from "../lib/patch_lib"
import path from "path"
import { PatchnoteInfo } from "../types"

const directoryOfPatches: string = path.join(process.cwd(), "tests", "patches")

const patchnote = new Patchnote(directoryOfPatches, "1")

test("Should return the content of a patchnote", () => {
    const content: string = '<hr>\n' +
    '<p>update: &#39;test launch&#39;\n' +
    'title: &quot;test patchnote&quot;\n' +
    'date: &#39;2020-01-01&#39;\n' +
    'image: &quot;patch1.jpg&quot;</p>\n' +
    '<hr>\n' +
    '<p>content</p>\n'
    expect(patchnote.content).toEqual(content)
})

test("Should return the info of a patchnote", () => {
    const info: PatchnoteInfo = {
        title: 'test patchnote',
        update: 'test launch',
        date: '2020-01-01',
        image: 'patch1.jpg'
    };

    expect(patchnote.info).toEqual(info)
})