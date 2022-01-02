import React, {useEffect, useReducer, useState, ReactElement, useContext} from 'react';
import Footer from '../components/footer';
import H1_with_deco from '../components/h1_with_deco';
import Steps from '../components/steps';
import {Create_pack_frontend, Create_pack_context_type} from "../types"
import { capitalize_first_letter_rest_lowercase } from '../lib/custom_lib';
import Image from 'next/image';
import { validate_files } from '../lib/custom_lib';
import Fixed_app_content_overlay from '../components/fixed_app_content_overlay';
import { AnimatePresence, motion } from 'framer-motion';
import ThrashIcon from "../public/icons/ThrashIcon.svg"
//Context
const create_pack_context: any = React.createContext(null)
const section_name_regex = new RegExp(/^[a-zA-Z0-9]{3,12}$/)

//Actions 
const CREATE_PACK_ACTIONS = {
    ADD_SECTION: "ADD_SECTION",
    DELETE_SECTION: "DELETE_SECTION",
    ADD_ASSET: "ADD_ASSET",
    DELETE_ASSET: "DELETE_ASSET",
    ADD_PREVIEW: "ADD_PREVIEW",
    NEXT_STEP: "NEXT_STEP",
    PREV_STEP: "PREV_STEP"
}

//Initial value for reducer state
const initial_create_pack_obj: Create_pack_frontend = {
    current_step: 0,
    next_step_available: false,
    preview: {preview_asset: null, preview_url: null},
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

    //Object handler
    switch ( type ) {
        
        //Adding a section
        case ( CREATE_PACK_ACTIONS.ADD_SECTION ) : {
            if(!payload) break

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
            
            break
        }


        //Deleting a section
        case ( CREATE_PACK_ACTIONS.DELETE_SECTION ) : {
            if(!payload) break
            const section_name = payload.section_name as string

            const section = create_pack_obj.content.get(section_name.toLowerCase())

            if(!section) break

            for(let url of section.section_urls) {
                URL.revokeObjectURL(url)
            }

            create_pack_obj.content.delete(payload.section_name.toLowerCase() as string)

            break
        }
        
        //Adding assets to section_assets in content
        case ( CREATE_PACK_ACTIONS.ADD_ASSET ) : {
            if(!payload) return create_pack_obj
            const section_name = (payload.section_name as string).toLowerCase()
            const section_blobs = payload.section_assets as Blob[] 

            const old_blobs = create_pack_obj.content.get(section_name)

            if(!old_blobs) break

            let all_blobs = [...section_blobs, ...old_blobs.section_assets]

            let object_urls: string[] = []
            for(let blob of all_blobs){
                object_urls.push(URL.createObjectURL(blob))
            }
            

            create_pack_obj.content.set(section_name, {section_assets: all_blobs, section_urls: object_urls})
            break 
        }

        //Deleting specific asset from section
        case ( CREATE_PACK_ACTIONS.DELETE_ASSET ) : {
            if(!payload) return create_pack_obj
            const section_name = payload.section_name as string
            const index = payload.asset_index as number
            
            const section = create_pack_obj.content.get(section_name.toLowerCase())

            if(!section) break

            section.section_assets.splice(index, 1)
            let removed_url = section.section_urls.splice(index, 1)
            URL.revokeObjectURL(removed_url[0])
            create_pack_obj.content.set(section_name.toLowerCase(), {section_assets: [...section.section_assets], section_urls: [...section.section_urls]})
            
            break
        }

        //Function that adds a preview to create_pack_obj
        case ( CREATE_PACK_ACTIONS.ADD_PREVIEW ) : {
            
            if(!payload) return create_pack_obj
            const preview_asset = payload.preview_asset

            if(create_pack_obj.preview.preview_url) URL.revokeObjectURL(create_pack_obj.preview.preview_url)

            const preview_url = URL.createObjectURL(preview_asset)
            create_pack_obj.preview = {preview_asset:  preview_asset, preview_url: preview_url}
            
            break
        }

        case (CREATE_PACK_ACTIONS.NEXT_STEP) : {
            
            if(create_pack_obj.next_step_available) create_pack_obj.current_step = create_pack_obj.current_step + 1

            break
        }

        case (CREATE_PACK_ACTIONS.PREV_STEP) : {
            if(create_pack_obj.current_step > 0) create_pack_obj.current_step = create_pack_obj.current_step - 1

            break
        }

        //Default value
        default : {
            return {...create_pack_obj}
        }
        
    } 

    //Current step handler
    function next_step_available(current_step: number): boolean {
        let next_step_is_available = false

        //Checking if next step should be available.
        switch( current_step ) {

            case ( 0 ) : {
                
                if(create_pack_obj.content.size > 0) {
                    
                    if(create_pack_obj.preview.preview_asset) {

                        for(let [key, value] of create_pack_obj.content.entries()) {
                            if(value.section_assets.length > 2) {
                                next_step_is_available = true
                                
                            } else {
                                next_step_is_available = false
                            }
                        }
        
                        return next_step_is_available
                    }
                    
                }

            }

            case ( 1 ) : {
                return next_step_is_available
            }

            default : {
                return next_step_is_available
            }
        }
    }
    let next_step_is_available = next_step_available(create_pack_obj.current_step)
    create_pack_obj.next_step_available = next_step_is_available
    return {...create_pack_obj}
}

//Page Component
function Create_page() {
    const [create_pack_obj, dispatch] = useReducer(create_pack_reducer, initial_create_pack_obj)
    
    const create_pack = {
        create_pack_obj,
        dispatch
    }

    return (
        <create_pack_context.Provider value={create_pack}>
            <div className='create_pack_page'>

                <div className='content'>
                    <AnimatePresence exitBeforeEnter>

                        {create_pack_obj.current_step === 0 &&
                        
                            <Step_1 key={"step_1"} />
                        
                        } 

                        {create_pack_obj.current_step === 1 &&
                            <Step_2 key="step_2"/>
                        }
                        
                    </AnimatePresence>

                    <div className='button_container'>
                        <button onClick={() => {dispatch({type: CREATE_PACK_ACTIONS.NEXT_STEP})}} className={create_pack_obj.next_step_available ? `active_button` : 'disabled_button'}>Next Step</button>
                    </div>

                    <Steps steps={3} current_step={create_pack_obj.current_step} next_step_available={create_pack_obj.next_step_available}/>
                </div>

                <Footer/>

            </div>

        </create_pack_context.Provider>
    );
}

function Step_1() {
    const create_pack: Create_pack_context_type = useContext(create_pack_context)
    const create_pack_obj = create_pack.create_pack_obj
    const dispatch = create_pack.dispatch
    const [pack_content_jsx, set_pack_content_jsx] = useState<ReactElement[]>([])
    const [toggle_add_section, set_toggle_add_section] = useState(false)


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
        
        dispatch({type: CREATE_PACK_ACTIONS.ADD_SECTION, payload: {section_name: input.value.toLowerCase()}})
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

        //When window is opened to create section
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

    return (
        <motion.div initial={{opacity: 0, y: -50}} animate={{opacity: 1, y: 0, transition: {duration: .1, type: "tween"}}} exit={{opacity: 0,y: 50, transition: {duration: .1, type: "tween"}}} className='step_1_container'>
            <AnimatePresence exitBeforeEnter>

                {toggle_add_section &&
                    <Fixed_app_content_overlay key="fixed_container">

                        <motion.div initial={{scale: .8}} animate={{scale: 1, transition: {duration: .2}}} exit={{scale: .8, transition: {duration: .2}}} className='enter_section_name_container'>

                            <div className='content_container'>

                                <h1>Please enter a section name!</h1>
                                <input autoComplete='off' onKeyUp={validate_section_name} type="text" placeholder='Section name' id="section_name_input"/>
                                <p id="section_name_error_message"></p>
                                <button onClick={dispatch_section_name_with_input_value} id='add_section_button' className='button_disabled'>Add section</button>

                            </div>
                            
                            <div onClick={() => {set_toggle_add_section(false)}} className='background_wrapper' />

                        </motion.div>

                    </Fixed_app_content_overlay>
                }

            </AnimatePresence>

            <H1_with_deco title='Create a pack'/>

            <Preview section_name='preview'/>

            {pack_content_jsx}


            <p onClick={() => {set_toggle_add_section(true)}} className='add_section'>{`+ Add Section`}</p>

        </motion.div>
    );
}

function Step_2() {
    const create_pack: Create_pack_context_type = useContext(create_pack_context)

    return(
        <motion.div initial={{opacity: 0, y: -50}} animate={{opacity: 1, y: 0, transition: {duration: .1, type: "tween"}}} exit={{opacity: 0,y: 50, transition: {duration: .1, type: "tween"}}} className='step_2_container'>

            <div className='pack_title_container'>
                <h1>Pack title</h1>
                <input type="text" />
            </div>

            <div className='pack_description_container'>

            </div>

            <div className='pack_tags_container'>

            </div>

            <h1 onClick={() => {create_pack.dispatch({type: CREATE_PACK_ACTIONS.PREV_STEP})}}>LOL</h1>

        </motion.div>
    )
}

//Preview Component that display a pack preview
function Preview({section_name}: {section_name: string}) {
    const create_pack: Create_pack_context_type = useContext(create_pack_context)
    
    return (
        <div className='preview_container'>

            <div className='preview_header_container'>
                <h1>{`- ${capitalize_first_letter_rest_lowercase(section_name)}`}</h1>

            </div>

            <Dropzone type='preview' section_name='preview'>
                
                {create_pack.create_pack_obj.preview.preview_asset &&
                    <div className='asset'>
                        <Image  src={`${create_pack.create_pack_obj.preview.preview_url}`} layout='fill'></Image>
                    </div>
                }
                
            </Dropzone>

        </div>
    );
}

//Component that creates a section for assets
function Section({section_name, section_content}: {section_name: string, section_content: {section_assets: Blob[], section_urls: string[]}}) {
    const create_pack: Create_pack_context_type = useContext(create_pack_context)
    const [section_assets_jsx, set_section_assets_jsx] = useState<ReactElement[] | null>(null)

    function delete_asset(e: any) {
        create_pack.dispatch({type: CREATE_PACK_ACTIONS.DELETE_ASSET, payload: {section_name, asset_index: parseInt(e.target.id)}})
    }

    useEffect(() => {
        let asset_jsx: ReactElement[] = []

        for(let i = 0; i < section_content.section_urls.length; i++) {
            
            asset_jsx.push(

                <div onClick={delete_asset} id={`${i}`} key={`${section_content.section_urls}_${i}`} className='asset'>
                    <Image  src={section_content.section_urls[i]} layout='fill'></Image>

                    <div className='delete_background_container'>
                        <ThrashIcon/>
                    </div>

                </div>

            )

        }
        
        set_section_assets_jsx(asset_jsx.reverse())

    }, [section_content])

    function delete_section() {
        create_pack.dispatch({type: CREATE_PACK_ACTIONS.DELETE_SECTION, payload: {section_name: section_name}})
    }

    return (
        <div className='sections_container'>

            <div className='section_header_container'>
                <h1>{`- ${section_name}`}</h1>

                <div className='delete_section'>
                    
                    <p onClick={delete_section}>Delete section</p>
                    <ThrashIcon/>
                </div>
                
            </div>

            <Dropzone type='section' section_name={`${section_name}`}>
                    
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

//Dropzone component. Handles whenever files are dropped into a dropzone
function Dropzone({children, section_name, type}: {children: any, section_name: string, type: string}) {
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

        if(type.toLowerCase() === "section") return create_pack.dispatch({type: CREATE_PACK_ACTIONS.ADD_ASSET, payload: {section_name, section_assets: blobs}})
        else return create_pack.dispatch({type: CREATE_PACK_ACTIONS.ADD_PREVIEW, payload: {section_name, preview_asset: blobs[0]}})
        

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