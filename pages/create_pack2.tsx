import { Dispatch, MutableRefObject, ReactElement, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react"
import Dropzone from "../components/Dropzone"
import Footer from "../components/footer"
import Input from "../components/input"
import KingHeader from "../components/kingHeader"
import PageContent from "../components/layout/pageContent"
import MetaGenerator from "../components/MetaGenerator"
import PackAsset from "../components/packAsset"
import Steps from "../components/steps"
import { PopupProviderContext } from "../context/popupProvider"
import { validate_pack_description, validate_pack_section_name, validate_pack_title } from "../spritearc_lib/validate_lib"

enum ECreatePackActions {
    ADD_SECTION = "ADD_SECTION",
    DELETE_SECTION = "DELETE_SECTION",
    ADD_LICENSE = "ADD_LICENSE",
    ADD_PERSPECTIVE = "ADD_PERSPECTIVE",
    ADD_SIZE = "ADD_SIZE",
    ADD_ASSET = "ADD_ASSET",
    DELETE_ASSET = "DELETE_ASSET",
    ADD_PREVIEW =  "ADD_PREVIEW",
    NEXT_STEP= "NEXT_STEP",
    PREV_STEP = "PREV_STEP",
    ADD_TITLE = "ADD_TITLE",
    ADD_DESCRIPTION = "ADD_DESCRIPTION",
    ADD_TAG= "ADD_TAG",
    DELETE_TAG= "DELETE_TAG",
    RESET_ALL= "RESET_ALL"
}

interface ICreatePackAction {
    type: ECreatePackActions,
    payload: any
}

interface ICreatePack {
    currentStep: number,
    availableSteps: number[],
    license: null | string,
    size: null | string,
    perspective: null | string,
    preview: {previewBlob: null | Blob, previewBlobUrl: null | string},
    title: null | string,
    description: null | string,
    tags: string[],
    content: Map<string, {sectionBlobs: Blob[], sectionBlobUrls: string[]}>,
}

function createPackReducer(createPack: ICreatePack, action: ICreatePackAction) {
    const {type , payload} = action

    try {
        //Object handler
        switch ( type ) {
            
            case ( ECreatePackActions.ADD_SECTION ) : {
                if(!payload) break

                const sectionName = payload.sectionName

                
                let exists = false
                for(let [key] of createPack.content.entries()) {

                    console.log(key)
                    if(key.toLowerCase() === sectionName.toLowerCase()) {
                        exists = true
                    }
                    
                } 
                
                if(exists) break
                createPack.content.set(sectionName.toLowerCase(), {sectionBlobs: [], sectionBlobUrls: []})
                
                break
            }

            case ( ECreatePackActions.DELETE_SECTION ) : {
                if(!payload) break
                const sectionName = payload.sectionName as string

                const section = createPack.content.get(sectionName.toLowerCase())
                if(!section) break

                for(let url of section.sectionBlobUrls) {
                    URL.revokeObjectURL(url)
                }

                createPack.content.delete(sectionName.toLowerCase() as string)

                break
            }
            
            case ( ECreatePackActions.ADD_ASSET ) : {
                if(!payload) return createPack
                const sectionName = payload.sectionName.toLowerCase()
                const sectionBlobs = payload.sectionBlobs as File[] 

                const oldBlobs = createPack.content.get(sectionName)

                if(!oldBlobs) break

                let allBlobs = [...sectionBlobs, ...oldBlobs.sectionBlobs]

                let localObjectUrls: string[] = []
                for(let file of allBlobs){
                    localObjectUrls.push(URL.createObjectURL(file))
                }
                

                console.log("SET")
                createPack.content.set(sectionName, {sectionBlobs: allBlobs, sectionBlobUrls: localObjectUrls})
                break 
            }

            case ( ECreatePackActions.DELETE_ASSET ) : {
                if(!payload) return createPack
                const sectionName = payload.sectionName as string
                const index = payload.assetIndex as number
                
                console.log("TESTSSASDASD")
                const section = createPack.content.get(sectionName.toLowerCase())

                if(!section) break

                section.sectionBlobs.splice(index, 1)
                let removedUrl = section.sectionBlobUrls.splice(index, 1)
                URL.revokeObjectURL(removedUrl[0])
                createPack.content.set(sectionName.toLowerCase(), {sectionBlobs: [...section.sectionBlobs], sectionBlobUrls: [...section.sectionBlobUrls]})
                
                break
            }

            case ( ECreatePackActions.ADD_PREVIEW ) : {
                
                if(!payload) return createPack
                const preview_asset = payload.previewAsset

                if(createPack.preview.previewBlobUrl) URL.revokeObjectURL(createPack.preview.previewBlobUrl)

                const previewUrl = URL.createObjectURL(preview_asset)
                createPack.preview = {previewBlob:  preview_asset, previewBlobUrl: previewUrl}
                
                break
            }

            case ( ECreatePackActions.ADD_TITLE ) : {
                
                if(!payload) return createPack
                const title = payload.title

                createPack.title = title
                break
            }

            case ( ECreatePackActions.ADD_DESCRIPTION ) : {
                
                if(!payload) return createPack
                const description = payload.description

                createPack.description = description
                break
            }

            case ( ECreatePackActions.NEXT_STEP ) : {
                if(createPack.availableSteps.includes(createPack.currentStep + 1)) createPack.currentStep += 1

                break
            }

            case ( ECreatePackActions.PREV_STEP ) : {
                if(createPack.currentStep > 0) createPack.currentStep -= 1

                break
            }

            case ( ECreatePackActions.ADD_LICENSE ) : {
                if(!payload) break
                const license = payload?.license
                
                createPack.license = license ? license.toLowerCase() : null
                break
            }

            case ( ECreatePackActions.ADD_PERSPECTIVE) : {
                if(!payload) break
                const perspective = payload?.perspective

                createPack.perspective = perspective ? perspective.toLowerCase() : null
                break
            }

            case ( ECreatePackActions.ADD_SIZE ) : {
                if(!payload) break
                const size = payload?.size
                if(typeof size !== "string") break

                createPack.size = size ? size.toLowerCase() : null
                break
            }

            case ( ECreatePackActions.ADD_TAG ) : {
                if(!payload) break

                if(createPack.tags.length >= 5) break
                const tag = payload.tag.toLowerCase()

                let tagsList = createPack.tags

                if(tagsList.length === 0) {

                    tagsList.push(tag)
                    
                } else {

                    let exists = false
                    
                    for(let existingTag of tagsList) {
                        
                        if(existingTag.toLowerCase() === tag) {
                            exists = true
                        }

                    }

                    if(exists === false) tagsList.push(tag)
                }
                
                createPack.tags = tagsList
                break
            }

            case ( ECreatePackActions.DELETE_TAG ) : {
                if(!payload) break
                const tag = payload.tag as string
                
                const index = createPack.tags.indexOf(tag.toLowerCase())

                createPack.tags.splice(index, 1)
                break
            }

            case ( ECreatePackActions.RESET_ALL) : {
                
                for(let section of createPack.content.entries()) {
                    for(let url of section[1].sectionBlobUrls) {
                        URL.revokeObjectURL(url)
                    }
                }

                createPack.availableSteps = [1]
                createPack.content = new Map()
                createPack.currentStep = 1
                createPack.license = null
                createPack.perspective = null
                createPack.size = null
                createPack.preview = {
                    previewBlob: null,
                    previewBlobUrl: null
                }
                createPack.tags = []
                createPack.title = null
                createPack.description = null
                
                createPack.content = new Map()
                break
            }

            //Default value
            default : {
                return {...createPack}
            }
            
        } 

        function availableSteps() {
            let steps = [1]

            //Step 2 available handler
            if(createPack.content.size > 0) {
                const step_2 = 2
                if(createPack.preview.previewBlob) {

                    for(let [key, value] of createPack.content.entries()) {

                        if(value.sectionBlobs.length > 0) {
                            steps.push(step_2)
                            
                        } else {
                            let index = steps.indexOf(step_2)
                            steps.splice(index, 1)
                        }

                    }
                    
                }
                
            }

            if(steps.includes(2)) {

                //Step 3 available handler
                if(createPack.title && createPack.description) {
                    const valid_title = validate_pack_title(createPack.title)
                    const valid_description = validate_pack_description(createPack.description)

                    if(valid_title === true && valid_description === true) {
                        steps.push(3)
                    } 
                    
                }

            }

            if(steps.includes(3)) {
                
                if(createPack.tags.length >= 3 && createPack.license && createPack.perspective && createPack.size) {
                    steps.push(4)
                } 
                
            }
            return steps
        }

        createPack.availableSteps = availableSteps()
        return {...createPack}

    } catch(err) {
        return createPack
    }

}

export default function PageRenderer() {
    return (
        <>
            <MetaGenerator
                title='Spritearc - Create Pack'
                description='Create pixel art packs that you can publish with the world. People will be able to download, use and rate your pack.' 
                url='https://Spritearc.com/search'
                imageLinkSecure={`https://${process.env.NEXT_PUBLIC_APP_NAME}.com/images/spritearc_wallpaper.png`}
            />

            <CreatePackPage/>

            <Footer/>
        </>
    );
}

function CreatePackPage() {
    const PopupContext = useContext(PopupProviderContext)

    const [createPack, dispatch] = useReducer(createPackReducer, {
        currentStep: 1,
        availableSteps: [],
        license: null,
        size: null,
        perspective: null,
        preview: {previewBlob: null, previewBlobUrl: null},
        title: null,
        description: null,
        tags: [],
        content: new Map(),
    })

    const sectionsGenerator = useCallback(() => {
        const sectionJsx: ReactElement[] = []

        for(let [sectionName, content] of createPack.content) {

            const assetsJsx: ReactElement[] = []

            for(let i = 0; i < content.sectionBlobUrls.length; i++) {
                const blobUrl = content.sectionBlobUrls[i]

                assetsJsx.push(
                    <PackAsset key={blobUrl} src={blobUrl} editable={true} onClick={() => {
                        dispatch({type: ECreatePackActions.DELETE_ASSET, payload: {sectionName, assetIndex: i}})
                    }}/>
                )
            }

            
            sectionJsx.push(
                <Dropzone key={sectionName} label={sectionName} onDrop={(files) => dispatch({type: ECreatePackActions.ADD_ASSET, payload: {sectionName, sectionBlobs: files}})}>
                    {assetsJsx}
                </Dropzone>
            )
        }

        return sectionJsx
    }, [createPack, dispatch])

    const displayAddSectionPopup = () => {
        
        PopupContext?.setPopup({
            component: <AddSectionPopup dispatch={dispatch}/>,
        })
    }

    useEffect(() => {
        dispatch({type: ECreatePackActions.ADD_SECTION, payload: {sectionName: "Characters"}})
    }, [dispatch])

    useEffect(() => {
        
        console.log(createPack)
    }, [createPack])

    return (
        <PageContent>

            {createPack.currentStep === 1 &&
                <div className="step_one_container">
                    {sectionsGenerator()}
                    <a onClick={displayAddSectionPopup} className='default primary'>{`+ Add Section`}</a>

                    <button className={`default ${createPack.availableSteps.includes(2) ? 'primary' : 'disabled'}`}>Next Step</button>
                </div>
            }

            {createPack.currentStep === 2 &&
                <h1 className="big">Step 2</h1>
            }
            

            <div className="steps_wrapper">
                <Steps steps={3} currentStep={createPack.currentStep} availableSteps={createPack.availableSteps} setCurrentStep={() => {}}/>
            </div>
        </PageContent>
    );
}

import sectionRecommendations from "../recommendations/sectionRecommendations.json"

function AddSectionPopup({dispatch}: {dispatch: Dispatch<ICreatePackAction>}) {
    const inputRef = useRef<null | HTMLInputElement>(null)
    const PopupContext = useContext(PopupProviderContext)

    const btnClick = () => {
        dispatch({type: ECreatePackActions.ADD_SECTION, payload: {sectionName: inputRef.current?.value}})
        PopupContext?.setPopup(null)
    }
    
    return (
        <div className="add_section_popup_container">
            <div className="title_wrapper">
                <KingHeader title="Add Section"/>
            </div>
            <p className="default">{`Enter a section name that will represent one part of your pack. (Characters, Backgrounds etc.)`}</p>
            <Input 
                recommendationCallb={(recommendation) => {
                    if(!inputRef.current) return
                    inputRef.current.value = recommendation
                }}
                recommendations={sectionRecommendations} 
                inputRef={inputRef} 
                placeholder="Section Name" 
                className="primary big" 
            />
            <button onClick={btnClick} className="default primary">Add Section</button>
        </div>
    );
}



