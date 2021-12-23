import React, {useEffect, useCallback, useReducer, useState, ReactElement, useContext} from 'react';
import Footer from '../components/footer';
import H1_with_deco from '../components/h1_with_deco';
import Steps from '../components/steps';
import {Create_pack_frontend, Pack_content} from "../types"
import { capitalize_first_letter_rest_lowercase } from '../lib/custom_lib';
import Image from 'next/image';
import { validate_blob } from '../lib/custom_lib';

const create_pack_context: any = React.createContext(null)

const CREATE_PACK_ACTIONS = {
    ADD_SECTION: "ADD_SECTION",
    ADD_ASSET: "ADD_ASSET",
    ADD_PREVIEW: "ADD_PREVIEW"
}

const initial_create_pack_obj: Create_pack_frontend = {
    current_step: 0,
    next_step_available: false,
    preview: null,
    premium: false,
    title: null,
    sub_title: null,
    description: null,
    tags: [],
    content: [],
}

function create_pack_reducer(create_pack_obj: Create_pack_frontend, action: {type: string, payload?: any}): Create_pack_frontend {
    const {type , payload} = action

    switch ( type ) {

        //Function that adds a section to create_pack_obj
        case ( CREATE_PACK_ACTIONS.ADD_SECTION ) : {
            
            if(!payload) return create_pack_obj
            create_pack_obj.content = [...create_pack_obj.content, {section_name: payload.section_name, section_assets: []}]
        }

        //Function that adds an asset to a section
        case ( CREATE_PACK_ACTIONS.ADD_ASSET ) : {
            
            if(!payload) return create_pack_obj
            

            create_pack_obj.content

        }

        //Function that adds a preview to create_pack_obj
        case ( CREATE_PACK_ACTIONS.ADD_PREVIEW ) : {
            
            if(!payload) return create_pack_obj
            
            create_pack_obj.preview = payload.blob
        }

        default : {
            return create_pack_obj
        }
    } 
}

export default function Create_page() {
    const [create_pack_obj, dispatch_create_pack_obj] = useReducer(create_pack_reducer, initial_create_pack_obj)
    const [pack_content_jsx, set_pack_content_jsx] = useState<ReactElement[]>([])


    /*useEffect(() => {
        dispatch_create_pack_obj({type: CREATE_PACK_ACTIONS.ADD_SECTION, payload: {section_name: "Background"}})
    }, []) */

    //Setting pack_content_jsx whenever Content of pack changes. (Sections, Assets)
    useEffect(() => {

        const sections_jsx = []

        for(let content of create_pack_obj.content) {
            sections_jsx.push(
                <Section key={`section_${content.section_name}`} section_name={capitalize_first_letter_rest_lowercase(content.section_name)} section_assets={content.section_assets}/>
            )
        }

        set_pack_content_jsx(sections_jsx)

    }, [create_pack_obj.content])
    
    const create_pack = {
        create_pack_obj,
        dispatch_create_pack_obj
    }

    return (
        <create_pack_context.Provider value={create_pack}>
            <div className='create_pack_page'>

                <div className='content'>

                    <H1_with_deco title='Create a pack'/>

                    <Preview/>

                    {pack_content_jsx}

                    <p className='add_section'>{`+ Add Section`}</p>


                    <div className='button_container'>
                        <button>Next Step</button>
                    </div>

                    <Steps steps={3} current_step={create_pack_obj.current_step} next_step_available={create_pack_obj.next_step_available}/>

                </div>

                <Footer/>
            </div>
        </create_pack_context.Provider>
    );
}


function Preview() {
    const create_pack: any = useContext(create_pack_context)
    const [dropped_image, set_dropped_image] = useState<string | null>(null)

    function on_drop(e: any) {
        e.preventDefault()
        const files = e.dataTransfer.files
        
        //Creating blob instance of file
        const blob = new Blob([files[0]], {type: files[0].type})

        const dropzone = document.getElementById("drop_down_files_container") as HTMLDivElement
        const error_message = document.getElementById("error_message") as HTMLParagraphElement

        //Checking if type of dropped files are jpg / png / jpeg
        const valid_blob = validate_blob(blob)

        //If typeof string function returned error message
        if(typeof valid_blob === "string") {
            

            error_message.innerText = valid_blob
            dropzone.classList.add("preview_drop_zone_error")
            set_dropped_image(null)
            return

        } else {
            error_message.innerText = ""
            dropzone.classList.remove("preview_drop_zone_error")
            dropzone.classList.remove("preview_drop_zone_hover")

        }

        //Deleting prev objectUrl
        if(dropped_image) URL.revokeObjectURL(dropped_image as string)

        //Creating a url to display image on the frontend
        const obj_url = URL.createObjectURL(blob)

        //Pushing arrayBuffer into create_pack_obj that will be send to the server lateron
        create_pack.dispatch_create_pack_obj({type: CREATE_PACK_ACTIONS.ADD_PREVIEW, payload: {blob}})

        //Setting image url to the state so preview image will be updated everytime changes were made
        set_dropped_image(obj_url)
    }

    function on_drag_over(e: any) {
        e.preventDefault()
        
        const dropzone = document.getElementById("drop_down_files_container") as HTMLDivElement
        dropzone.classList.remove("preview_drop_zone_error")
        dropzone.classList.add("preview_drop_zone_hover")
    }

    async function drag_exit(e: any) {
        e.preventDefault()

        const dropzone = document.getElementById("drop_down_files_container") as HTMLDivElement

        dropzone.classList.remove("preview_drop_zone_hover")

    }

    return (
        <div className='preview_container'>

            <h1>{`- Preview`}</h1>
            <p className='error_message' id="error_message" />
            <div onDrop={on_drop} onDragOver={on_drag_over} onDragLeave={drag_exit} className='preview_drop_zone' id="drop_down_files_container">

                <div key={"drop_your_files_label"} className='drop_your_files_label'>
                    <h1>Please drop your preview image here!</h1>
                </div>

                
                {dropped_image &&

                    <div className='preview_image_container'>
                        <Image src={dropped_image} layout='fill'/>
                    </div>

                }
                

            </div>

        </div>
        
    );
}

function Section({section_name, section_assets}: {section_name: string, section_assets: string[]}) {

    async function on_drop(e: any) {
        e.preventDefault()
        const file = e.dataTransfer.files
        const file_reader = new FileReader()
        const blob = new Blob(file)
    }

    async function drag_over(e: any) {
        e.preventDefault()


    }

    async function drag_enter(e: any) {
        e.preventDefault()

        const dropzone = document.getElementById("drop_down_files_container") as HTMLDivElement

        dropzone.style.background = "black"

    }

    async function drag_exit(e: any) {
        e.preventDefault()

        const dropzone = document.getElementById("drop_down_files_container") as HTMLDivElement

        dropzone.style.background = "white"

    }

    return (
        <div className='sections_container'>

            <h1>{`- ${section_name}`}</h1>

            <div className='section_assets_container'>

                <div onDrop={on_drop} onDragOver={drag_over} onDragEnter={drag_enter} onDragExit={drag_exit} className='assets_grid' id="drop_down_files_container">

                    {section_assets.length === 0 &&

                        <div key={"drop_your_files_label"} className='drop_your_files_label'>
                            <h1>Please drop your {section_name.toLowerCase()} files here!</h1>
                        </div>
                        
                    } 
                    {section_assets.length > 0 &&
                        null
                    }

                </div>              

            </div>

        </div>
        
    );
}
