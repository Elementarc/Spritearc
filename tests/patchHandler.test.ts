import {PatchHandler} from "../lib/patch_lib"
import path from "path"
import { Patchnote } from "../types"

const directoryOfPatches: string = path.join(process.cwd(), "tests", "patches")

const patchHandler = new PatchHandler(directoryOfPatches)



test("Should return an Array of Patchnotes", () => {
    const patchnoteList: Patchnote[] = [ 
        {
            id: '1',
            info: {
                title: 'test patchnote',
                update: 'test launch',
                date: '2020-01-01',
                image: 'patch1.jpg'
            },
            content: '<hr>\n' +
                '<p>update: &#39;test launch&#39;\n' +
                'title: &quot;test patchnote&quot;\n' +
                'date: &#39;2020-01-01&#39;\n' +
                'image: &quot;patch1.jpg&quot;</p>\n' +
                '<hr>\n' +
                '<p>content</p>\n'
        }
    ]
    expect(patchHandler.patchnoteList).toEqual(patchnoteList)
})

test("Should return a specific Patchnote", () => {
    const patchnote = {
        id: '1',
        info: {
            title: 'test patchnote',
            update: 'test launch',
            date: '2020-01-01',
            image: 'patch1.jpg'
        },
        content: '<hr>\n' +
            '<p>update: &#39;test launch&#39;\n' +
            'title: &quot;test patchnote&quot;\n' +
            'date: &#39;2020-01-01&#39;\n' +
            'image: &quot;patch1.jpg&quot;</p>\n' +
            '<hr>\n' +
            '<p>content</p>\n'
    }
    expect(patchHandler.getPatchnote("1")).toEqual(patchnote)
})

