import {getAllPatchIds, getAllPatchInfos, getPatchContent, getPatchInfo, getPatches, getAllStaticPatchUrls} from "../lib/patch_lib";

test("Should return an array of patchids", () => {
    expect(getAllPatchIds()).toStrictEqual(getAllPatchIds())
})

test("Should return an array of patchInfos", () => {
    expect(getAllPatchInfos(getAllPatchIds())).toStrictEqual(getAllPatchInfos(getAllPatchIds()))
})

test("Should return an array of paths for each patch", () => {
    expect(getAllStaticPatchUrls(getAllPatchIds())).toStrictEqual(getAllStaticPatchUrls(getAllPatchIds()))
})