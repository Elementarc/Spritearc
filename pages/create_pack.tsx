import React, {useEffect, useReducer, useState, ReactElement, useContext} from 'react';
import Footer from '../components/footer';
import H1_with_deco from '../components/h1_with_deco';
import Steps from '../components/steps';
import {Create_pack_frontend, Create_pack_context_type} from "../types"
import { capitalize_first_letter_rest_lowercase } from '../lib/custom_lib';
import Image from 'next/image';
import { validate_files } from '../lib/custom_lib';
import Fixed_app_content_overlay from '../components/fixed_app_content_overlay';
import { AnimatePresence } from 'framer-motion';
import { test } from 'gray-matter';

//Context
const create_pack_context: any = React.createContext(null)
const section_name_regex = new RegExp(/^[a-zA-Z0-9]{3,12}$/)

//Actions 
const CREATE_PACK_ACTIONS = {
    ADD_SECTION: "ADD_SECTION",
    DELETE_SECTION: "DELETE_SECTION",
    ADD_ASSET: "ADD_ASSET",
    ADD_PREVIEW: "ADD_PREVIEW",
    NEXT_STEP: "NEXT_STEP"
}

//Initial value for reducer state
const initial_create_pack_obj: Create_pack_frontend = {
    current_step: 0,
    next_step_available: false,
    preview: null,
    premium: false,
    title: null,
    sub_title: null,
    description: null,
    tags: [],
    content: new Map(),
}

//Create Pack handler that handles all functions for
function create_pack_reducer(create_pack_obj: Create_pack_frontend, action: {type: string, payload?: any}): Create_pack_frontend {
    const {type , payload} = action

    switch ( type ) {
        
        //Adding a section to to state
        case ( CREATE_PACK_ACTIONS.ADD_SECTION ) : {
            if(!payload) return create_pack_obj

            const section_name = payload.section_name

            let exists = false
            for(let [key, value] of create_pack_obj.content.entries()) {

                if(key.toLowerCase() === payload.section_name.toLowerCase()) {
                    exists = true
                }
                
            } 

            if(exists === false) {
                
                create_pack_obj.content.set(`${section_name.toLowerCase()}`, {section_assets: [], section_urls: []})
                /* create_pack_obj.content = new_content_map */
            }
            
            console.log(create_pack_obj.content)
            return {...create_pack_obj}
        }


        //Deleting a section from state
        case ( CREATE_PACK_ACTIONS.DELETE_SECTION ) : {
            if(!payload) return create_pack_obj
            const section_name = payload.section_name as string

            const section = create_pack_obj.content.get(section_name.toLowerCase())

            if(!section) return {...create_pack_obj}

            for(let url of section.section_urls) {
                URL.revokeObjectURL(url)
            }

            create_pack_obj.content.delete(payload.section_name.toLowerCase() as string)

            return {...create_pack_obj}
        }
        
        //Adding assets to section_assets in content
        case ( CREATE_PACK_ACTIONS.ADD_ASSET ) : {
            if(!payload) return create_pack_obj
            const section_name = (payload.section_name as string).toLowerCase()
            const section_blobs = payload.section_assets as Blob[] 

            const old_blobs = create_pack_obj.content.get(section_name)

            if(!old_blobs) return {...create_pack_obj}

            let all_blobs = [...section_blobs, ...old_blobs.section_assets]

            let object_urls: string[] = []
            for(let blob of all_blobs){
                object_urls.push(URL.createObjectURL(blob))
            }
            

            create_pack_obj.content.set(section_name, {section_assets: all_blobs, section_urls: object_urls})
            console.log(create_pack_obj.content)
            return {...create_pack_obj}
        }

        //Function that adds a preview to create_pack_obj
        case ( CREATE_PACK_ACTIONS.ADD_PREVIEW ) : {
            
            if(!payload) return create_pack_obj
            
            create_pack_obj.preview = payload.blob
            
            return {...create_pack_obj}
        }

        //Default value
        default : {
            return {...create_pack_obj}
        }
        
    } 
}

//Page Component
function Create_page() {
    const [create_pack_obj, dispatch] = useReducer(create_pack_reducer, initial_create_pack_obj)
    const [pack_content_jsx, set_pack_content_jsx] = useState<ReactElement[]>([])
    const [toggle_add_section, set_toggle_add_section] = useState(false)

    useEffect(() => {
        dispatch({type: CREATE_PACK_ACTIONS.ADD_SECTION, payload: {section_name: "background"}})
    }, [])

    //CREATING JSX OF create_pack_obj.content
    useEffect(() => {
        const sections_jsx: any = []
        
        for(let [section_name, section_content] of create_pack_obj.content.entries()) {
            
            sections_jsx.push(
                <Section key={`section_${section_name}`} section_name={capitalize_first_letter_rest_lowercase(section_name)} section_content={section_content}/>
            )
            
        }

        set_pack_content_jsx(sections_jsx)

    }, [create_pack_obj])

    //Function that styles error elements when error
    function style_error_items(error: boolean) {
        const input = document.getElementById("section_name_input") as HTMLInputElement
        const button = document.getElementById("add_section_button") as HTMLButtonElement
        
        if(error) {
            input.classList.add("input_error")
            button.classList.add("button_disabled")
        } else {
            input.classList.remove("input_error")
            button.classList.remove("button_disabled")
        }
    }

    let timer: NodeJS.Timer

    function validate_section_name(): Promise<boolean> {
        return new Promise((resolve) => {
            
            const input = document.getElementById("section_name_input") as HTMLInputElement
            
            const error_message = document.getElementById("section_name_error_message") as HTMLParagraphElement
    
            clearTimeout(timer)
    
            timer = setTimeout(() => {
            
                if(input.value.length < 3) {

                    error_message.innerText = "Sectioname must be atleast 3 characters long!"
                    style_error_items(true)
                    resolve(false)

                }
                else {
                    
                    if(section_name_regex.test(input.value) === true) {

                        let exists = false
                        for(let [key, value] of create_pack_obj.content.entries()) {
                
                            if(key.toLowerCase() === input.value.toLowerCase()) {
                                exists = true
                            }
                        }

                        if(exists) {
                            style_error_items(true)
                            resolve(false)
                            error_message.innerText = "Sectioname already exists!"
                        } else {
                            style_error_items(false)
                            resolve(true)
                            error_message.innerText = ""
                        }
                        
                        
                    } 
                    else {
                        style_error_items(true)
                        resolve(false)
                        error_message.innerText = "You can only use characters a-z A-Z or numbers 1-9. Max. 12 Characters"
                    }
                }
    
            }, 150);
        })

    }

    async function dispatch_section_name_with_input_value() {
        const valid = await validate_section_name()
        if(!valid) return
        const input = document.getElementById("section_name_input") as HTMLInputElement
        
        dispatch({type: CREATE_PACK_ACTIONS.ADD_SECTION, payload: {section_name: input.value}})
        set_toggle_add_section(false)
    }

    //Clearing timeout
    useEffect(() => {
        
        return () => {
            clearTimeout(timer)
        };
    }, [])

    //Adding eventlisteners to be able to press enter to create section
    useEffect(() => {

        if(toggle_add_section) {
            const input = document.getElementById("section_name_input") as HTMLInputElement

            input.focus()
        }

        function key_press(e: any) {
            const button = document.getElementById("add_section_button") as HTMLButtonElement
            if(toggle_add_section === true) {
                if(e.keyCode === 13) {
                    button.click()
                }
            }
        }

        window.addEventListener("keyup", key_press)
        return () => {
            window.removeEventListener("keyup", key_press)
        };
    }, [toggle_add_section])

    const create_pack = {
        create_pack_obj,
        dispatch
    }

    function test() {
        console.log(create_pack.create_pack_obj)
        
        const files: File[] = [new File([new Blob()], "lol.png")]
        
        let blobs: Blob[] = []

        for(let file of files) {
            blobs.push(new Blob([file], {type: file.type}))
        }
        
        
        console.log("dispatched!")
        create_pack.dispatch({type: CREATE_PACK_ACTIONS.ADD_ASSET, payload: {section_name: "test", new_section_assets: blobs}})
    }

    return (
        <create_pack_context.Provider value={create_pack}>
            <div className='create_pack_page'>

                <AnimatePresence exitBeforeEnter>

                    {toggle_add_section &&
                        <Fixed_app_content_overlay key="fixed_container">

                            <div className='enter_section_name_container'>

                                <div className='content_container'>

                                    <h1>Please enter a section name!</h1>
                                    <input autoComplete='off' onKeyUp={validate_section_name} type="text" placeholder='Section name' id="section_name_input"/>
                                    <p id="section_name_error_message"></p>
                                    <button onClick={dispatch_section_name_with_input_value} id='add_section_button' className='button_disabled'>Add section</button>

                                </div>
                                
                                <div onClick={() => {set_toggle_add_section(false)}} className='background_wrapper'>

                                </div>

                            </div>

                        </Fixed_app_content_overlay>
                    }

                </AnimatePresence>

                <div  className='content'>

                    <H1_with_deco title='Create a pack'/>

                    {pack_content_jsx}


                    <p onClick={() => {set_toggle_add_section(true)}} className='add_section'>{`+ Add Section`}</p>
                    


                    <div className='button_container' onClick={test}>
                        <button>Next Step</button>
                    </div>

                    <Steps steps={3} current_step={create_pack_obj.current_step} next_step_available={create_pack_obj.next_step_available}/>

                </div>

                <Footer/>

            </div>

        </create_pack_context.Provider>
    );
}

//Component that creates a section for assets
function Section({section_name, section_content}: {section_name: string, section_content: {section_assets: Blob[], section_urls: string[]}}) {
    const create_pack: Create_pack_context_type = useContext(create_pack_context)
    const [section_assets_jsx, set_section_assets_jsx] = useState<ReactElement[] | null>(null)

    useEffect(() => {
        let asset_jsx: ReactElement[] = []


        for(let i = 0; i < section_content.section_urls.length; i++) {
            
            asset_jsx.push(

                <div key={`${section_content.section_urls}_${i}`} className='asset'>
                    <Image src={section_content.section_urls[i]} layout='fill'></Image>
                </div>

            )

        }
        
        
        set_section_assets_jsx(asset_jsx)

    }, [section_content])


    function delete_section() {
        create_pack.dispatch({type: CREATE_PACK_ACTIONS.DELETE_SECTION, payload: {section_name: section_name}})
    }

    return (
        <div className='sections_container'>

            <div className='section_header_container'>
                <h1>{`- ${section_name}`}</h1>
                <p onClick={delete_section}>Delete Pack</p>
            </div>

            <Dropzone section_name={`${section_name}`} section_content={section_content}>
                    
                {section_content.section_assets.length === 0 &&

                    <div className='section_label'>
                        <h1>Please drop your {`'${section_name.toLowerCase()}'`} files here!</h1>
                    </div>
                    
                } 
                
                {section_content.section_assets.length > 0 &&
                    <>{section_assets_jsx}</>
                }
            </Dropzone>

        </div>
    );
}

function Dropzone({children, section_name, section_content}: {children: any, section_name: string, section_content: {section_assets: Blob[], section_urls: string[]}}) {
    const create_pack: Create_pack_context_type = useContext(create_pack_context)

    async function on_drop(e: any) {
        e.preventDefault()
        
        
        const dropzone = document.getElementById(`dropzone_${section_name}`) as HTMLDivElement
        const dropzone_error_message = document.getElementById(`dropzone_error_message_${section_name}`) as HTMLParagraphElement

        const files: File[] = e.dataTransfer.files
        
        const validation = validate_files(files)
        
        if(typeof validation === "string") {
            dropzone.classList.remove("dropzone_hover")
            dropzone.classList.add("dropzone_error")
            return dropzone_error_message.innerText = validation 
        } else {
            dropzone_error_message.innerText = "" 
            dropzone.classList.remove("dropzone_hover")
            dropzone.classList.remove("dropzone_error")
        }
                
        let blobs: Blob[] = []

        for(let file of files) {
            blobs.push(new Blob([file], {type: file.type}))
        }
        
        console.log("dispatched!")
        create_pack.dispatch({type: CREATE_PACK_ACTIONS.ADD_ASSET, payload: {section_name, section_assets: blobs}})

    }
    
    async function on_drag_over(e: any) {
        e.preventDefault()
        const dropzone = document.getElementById(`dropzone_${section_name}`) as HTMLDivElement
        dropzone.classList.remove("dropzone_error")
        dropzone.classList.add("dropzone_hover")
    }

    async function on_drag_leave(e: any) {
        e.preventDefault()
        const dropzone = document.getElementById(`dropzone_${section_name}`) as HTMLDivElement
        dropzone.classList.remove("dropzone_error")
        dropzone.classList.remove("dropzone_hover")
    }

    return (

        <div className='dropzone_container'>

            <p id={`dropzone_error_message_${section_name}`}></p>
            <div onDrop={on_drop} onDragOver={on_drag_over} onDragLeave={on_drag_leave} className='dropzone' id={`dropzone_${section_name}`}>
                {children}
            </div>

        </div>
        
    );
}



export default Create_page