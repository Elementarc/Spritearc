import React, {useEffect, useReducer, useState, ReactElement, useContext, useCallback} from 'react';
import CloseIcon from "../public/icons/CloseIcon.svg"
import Footer from '../components/footer';
import H1_with_deco from '../components/h1_with_deco';
import Steps from '../components/steps';
import {Create_pack_frontend, Create_pack_context_type} from "../types"
import ExpandIcon from "../public/icons/ExpandIcon.svg"
import { capitalize_first_letter_rest_lowercase } from '../lib/custom_lib';
import Image from 'next/image';
import { validate_files , validate_pack_title, validate_pack_description, validate_pack_tag} from '../lib/validate_lib';
import Fixed_app_content_overlay from '../components/fixed_app_content_overlay';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import ThrashIcon from "../public/icons/ThrashIcon.svg"
import { Device_context } from '../context/device_context_provider';
import { create_form_data as create_form_data } from '../lib/create_lib';
import { App_notification_context, NOTIFICATION_ACTIONS } from '../context/app_notification_context_provider';
import { useRouter } from 'next/router';
import jwt from "jsonwebtoken"
import { GetServerSideProps } from 'next';
import Loader from "../components/loading"
// @ts-ignore: Unreachable code error

//Context
const create_pack_context: any = React.createContext(null)
const section_name_regex = new RegExp(/^[a-zA-Z0-9]{3,12}$/)

//Actions 
const CREATE_PACK_ACTIONS = {
    ADD_SECTION: "ADD_SECTION",
    DELETE_SECTION: "DELETE_SECTION",
    ADD_LICENSE: "ADD_LICENSE",
    ADD_ASSET: "ADD_ASSET",
    DELETE_ASSET: "DELETE_ASSET",
    ADD_PREVIEW: "ADD_PREVIEW",
    NEXT_STEP: "NEXT_STEP",
    PREV_STEP: "PREV_STEP",
    ADD_TITLE: "ADD_TITLE",
    ADD_DESCRIPTION: "ADD_DESCRIPTION",
    ADD_TAG: "ADD_TAG",
    DELETE_TAG: "DELETE_TAG",
    SUBMIT_PACK: "SUBMIT_PACK",
    RESET_ALL: "RESET_ALL"
}

//Initial value for reducer state
const initial_create_pack_obj: Create_pack_frontend = {
    current_step: 0,
    steps_available: [],
    license: null,
    preview: {preview_asset: null, preview_url: null},
    title: null,
    description: null,
    tags: [],
    content: new Map(),
}

//Create Pack handler that handles all functions for
function create_pack_reducer(create_pack_obj: Create_pack_frontend, action: {type: string, payload?: any}): Create_pack_frontend {
    const {type , payload} = action

    //Object handler
    switch ( type ) {
        
        case ( CREATE_PACK_ACTIONS.ADD_SECTION ) : {
            if(!payload) break

            const section_name = payload.section_name

            let exists = false
            for(let [key] of create_pack_obj.content.entries()) {

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
        
        case ( CREATE_PACK_ACTIONS.ADD_ASSET ) : {
            if(!payload) return create_pack_obj
            const section_name = (payload.section_name as string).toLowerCase()
            const section_blobs = payload.section_assets as File[] 

            const old_blobs = create_pack_obj.content.get(section_name)

            if(!old_blobs) break

            let all_files = [...section_blobs, ...old_blobs.section_assets]

            let object_urls: string[] = []
            for(let file of all_files){
                object_urls.push(URL.createObjectURL(file))
            }
            

            create_pack_obj.content.set(section_name, {section_assets: all_files, section_urls: object_urls})
            break 
        }

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

        case ( CREATE_PACK_ACTIONS.ADD_PREVIEW ) : {
            
            if(!payload) return create_pack_obj
            const preview_asset = payload.preview_asset

            if(create_pack_obj.preview.preview_url) URL.revokeObjectURL(create_pack_obj.preview.preview_url)

            const preview_url = URL.createObjectURL(preview_asset)
            create_pack_obj.preview = {preview_asset:  preview_asset, preview_url: preview_url}
            
            break
        }

        case ( CREATE_PACK_ACTIONS.ADD_TITLE ) : {
            
            if(!payload) return create_pack_obj
            const title = payload.title

            create_pack_obj.title = title
            break
        }

        case ( CREATE_PACK_ACTIONS.ADD_DESCRIPTION ) : {
            
            if(!payload) return create_pack_obj
            const description = payload.description

            create_pack_obj.description = description
            break
        }

        case ( CREATE_PACK_ACTIONS.NEXT_STEP ) : {
            if(create_pack_obj.steps_available.includes(create_pack_obj.current_step + 1)) create_pack_obj.current_step = create_pack_obj.current_step + 1

            break
        }

        case ( CREATE_PACK_ACTIONS.PREV_STEP ) : {
            if(create_pack_obj.current_step > 0) create_pack_obj.current_step = create_pack_obj.current_step - 1

            break
        }

        case ( CREATE_PACK_ACTIONS.ADD_LICENSE ) : {
            if(!payload) break

            const license = (payload.license as string).toLowerCase()
            
            create_pack_obj.license = license
            break
        }

        case ( CREATE_PACK_ACTIONS.ADD_TAG ) : {
            if(!payload) break

            if(create_pack_obj.tags.length >= 5) break
            const tag = (payload.tag as string).toLowerCase()

            console.log(tag)

            let tags_array = create_pack_obj.tags as string[]

            if(tags_array.length === 0) {

                tags_array.push(tag)
                
            } else {

                let exists = false
                
                for(let existing_tag of tags_array) {
                    
                    if(existing_tag.toLowerCase() === tag) {
                        exists = true
                    }

                }

                if(exists === false) tags_array.push(tag)
            }
            
            
            create_pack_obj.tags = tags_array
            console.log(create_pack_obj.tags)
            break
        }

        case ( CREATE_PACK_ACTIONS.DELETE_TAG ) : {
            if(!payload) break
            const tag = payload.tag as string
            
            const index = create_pack_obj.tags.indexOf(tag.toLowerCase())

            create_pack_obj.tags.splice(index, 1)
            break
        }

        case ( CREATE_PACK_ACTIONS.SUBMIT_PACK ) : {

            
            async function send_pack() {
                const Form_data = create_form_data(create_pack_obj)
            
                if(!Form_data) return
                await fetch("/api/user/create_pack", {
                    method: "POST",
                    body: Form_data
                })
                
                
            }
            send_pack()

            break
        }

        case ( CREATE_PACK_ACTIONS.RESET_ALL) : {
            create_pack_obj = initial_create_pack_obj
            for(let section of create_pack_obj.content.entries()) {
                for(let url of section[1].section_urls) {
                    URL.revokeObjectURL(url)
                }
            }
            create_pack_obj.content = new Map()
        }

        //Default value
        default : {
            return {...create_pack_obj}
        }
        
    } 

    function available_steps() {
        let steps = [0]

        //Step 2 available handler
        if(create_pack_obj.content.size > 0) {
            const step_2 = 1
            if(create_pack_obj.preview.preview_asset) {

                for(let [key, value] of create_pack_obj.content.entries()) {

                    if(value.section_assets.length > 0) {
                        steps.push(step_2)
                        
                    } else {
                        let index = steps.indexOf(step_2)
                        steps.splice(index, 1)
                    }

                }

                
            }
            
        }

        if(steps.includes(1)) {

            //Step 3 available handler
            if(create_pack_obj.title && create_pack_obj.description) {
                const valid_title = validate_pack_title(create_pack_obj.title)
                const valid_description = validate_pack_description(create_pack_obj.description)

                if(valid_title === true && valid_description === true) {
                    steps.push(2)
                } 
                
            }

        }

        if(steps.includes(2)) {
            
            if(create_pack_obj.tags.length >= 3 && create_pack_obj.license) {
                steps.push(3)
            } 
            
        }
        return steps
    }

    create_pack_obj.steps_available = available_steps()
    return {...create_pack_obj}
}

//Page Component
function Create_page() {
    const [create_pack_obj, dispatch] = useReducer(create_pack_reducer, initial_create_pack_obj)
    
    useEffect(() => {
        

        return () => {

            dispatch({type: CREATE_PACK_ACTIONS.RESET_ALL})

        };
    }, [dispatch])

    useEffect(() => {
        window.scrollTo(0,0)
    }, [create_pack_obj.current_step])

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

                        {create_pack_obj.current_step === 2 &&
                            <Step_3 key="step_3"/>
                        }
                    </AnimatePresence>

                    <Steps steps={3} current_step={create_pack_obj.current_step} steps_available={create_pack_obj.steps_available}/>

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


    function validate_section_name(): Promise<boolean> {
        return new Promise((resolve) => {
            
            const input = document.getElementById("section_name_input") as HTMLInputElement
            
            const error_message = document.getElementById("section_name_error_message") as HTMLParagraphElement
            
            if(input.value.length < 1) {

                error_message.innerText = "Sectioname must be atleast 3 characters long!"
                style_error_items(true)
                resolve(false)

            }
            else {
                
                if(section_name_regex.test(input.value) === true) {

                    let exists = false
                    for(let [key] of create_pack_obj.content.entries()) {
            
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
    
        })
    }

    async function dispatch_section_name_with_input_value() {
        const valid = await validate_section_name()
        if(!valid) return
        const input = document.getElementById("section_name_input") as HTMLInputElement
        
        dispatch({type: CREATE_PACK_ACTIONS.ADD_SECTION, payload: {section_name: input.value.toLowerCase()}})
        set_toggle_add_section(false)
    }

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
        <>
            <H1_with_deco title='Step 1'/>
            <div className='step_1_container'>
                <AnimatePresence exitBeforeEnter>

                    {toggle_add_section &&
                        <Fixed_app_content_overlay key="fixed_container">

                            <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2}}} exit={{opacity: 0, transition: {duration: .2}}} className='enter_section_name_container'>

                                <motion.div initial={{scale: .8}} animate={{scale: 1, transition: {duration: .2}}} exit={{scale: .8, transition: {duration: .2}}} className='content_container'>

                                    <h1>Please enter a section name!</h1>
                                    <input autoComplete='off' onKeyUp={validate_section_name} type="text" placeholder='Section name' id="section_name_input"/>
                                    <p id="section_name_error_message"></p>
                                    <button onClick={dispatch_section_name_with_input_value} id='add_section_button' className='button_disabled'>Add section</button>

                                </motion.div>
                                
                                <div onClick={() => {set_toggle_add_section(false)}} className='background_wrapper' />

                            </motion.div>

                        </Fixed_app_content_overlay>
                    }

                </AnimatePresence>

                <Preview section_name='preview'/>

                {pack_content_jsx}


                <p onClick={() => {set_toggle_add_section(true)}} className='add_section'>{`+ Add Section`}</p>

            </div>

            <div className='button_container'>
                <button onClick={() => {dispatch({type: CREATE_PACK_ACTIONS.NEXT_STEP})}} className={create_pack_obj.steps_available.includes(create_pack_obj.current_step + 1) ? `active_button` : 'disabled_button'}>Next Step</button>
            </div>
        </>
    );
}

function Step_2() {
    const create_pack: Create_pack_context_type = useContext(create_pack_context)

    //Validating and setting Title
    async function validate_title(e: any) {
        const counter = document.getElementById("title_counter") as HTMLParagraphElement
        //error styles for title container
        function error_styles(error: boolean, message: string) {
            const input = document.getElementById("title_input") as HTMLInputElement
            const error_message = document.getElementById("title_error_message") as HTMLParagraphElement

            if(error) {
                input.classList.add("title_input_error")
                error_message.innerText = `${message}`
            } else {
                input.classList.remove("title_input_error")
                error_message.innerText = ``
            }
        }

        const input_value = e.target.value as string
        counter.innerText = `${input_value.length} / 25`

        const title_validation = validate_pack_title(input_value)
    
        if(typeof title_validation === "string") {
            create_pack.dispatch({type: CREATE_PACK_ACTIONS.ADD_TITLE, payload: {title: null}})
            error_styles(true, title_validation)
        } else {
            create_pack.dispatch({type: CREATE_PACK_ACTIONS.ADD_TITLE, payload: {title: input_value}})
            error_styles(false, "")
        }
        
    }

    //Validating and setting Description of pack
    function validate_description(e: any) {
        const input_value = e.target.value as string
        
        function error_styles(error: boolean, message: string) {
            if(create_pack.create_pack_obj.current_step === 1) {
            
                const input = document.getElementById("description_input") as HTMLTextAreaElement
                const error_message = document.getElementById("description_error_message") as HTMLParagraphElement

                if(error) {
                    input.classList.add("description_input_error")
                    error_message.innerText = `${message}`
                } else {
                    input.classList.remove("description_input_error")
                    error_message.innerText = ``
                }
            }
        }
        const counter = document.getElementById("description_counter") as HTMLParagraphElement
        counter.innerText = `${input_value.length} / 500`

        const description_valid = validate_pack_description(input_value)
        if(typeof description_valid === "string") {
            error_styles(true, description_valid)
            create_pack.dispatch({type: CREATE_PACK_ACTIONS.ADD_DESCRIPTION, payload: {description: null}})
        } else {
            error_styles(false, "")
            create_pack.dispatch({type: CREATE_PACK_ACTIONS.ADD_DESCRIPTION, payload: {description: input_value}})
        }

            
    }

    function go_next_step() {
        const title_input = document.getElementById("title_input") as HTMLInputElement
        const description_input = document.getElementById("description_input") as HTMLInputElement

        const valid_description = validate_pack_description(description_input.value)
        const valid_title = validate_pack_title(title_input.value)

        if(valid_description === true && valid_title === true) {
            create_pack.dispatch({type: CREATE_PACK_ACTIONS.NEXT_STEP})
        }
    }

    return(
        <>

            <H1_with_deco title='Step 2'/>

            <div className='step_2_container'>

                <div className='pack_title_container'>
                    <h1>Title</h1>
                    <div className='input_container'>
                        <input defaultValue={create_pack.create_pack_obj.title ? create_pack.create_pack_obj.title : ""} className='title_input' onKeyUp={validate_title} onBlur={validate_title} type="text" placeholder='Max. 25 characters' id="title_input"/>
                        
                        <div className='input_info_container'>
                            <h4 id="title_counter">{`${create_pack.create_pack_obj.title ? create_pack.create_pack_obj.title.length : "0"} / 25`}</h4>
                            <p id="title_error_message"></p>
                        </div>
                        
                    </div>

                </div>

                <div className='pack_description_container'>
                    <h1>Description</h1>

                    <div className='input_container'>

                        <textarea defaultValue={create_pack.create_pack_obj.description ? create_pack.create_pack_obj.description : ""} onKeyUp={validate_description} onBlur={validate_description} placeholder='Min. 100 characters' className='description_input' id="description_input"></textarea>
                        
                        <div className='input_info_container'>
                            <h4 id="description_counter">{`${create_pack.create_pack_obj.description ? create_pack.create_pack_obj.description.length : "0"} / 500`}</h4>
                            <p id="description_error_message"></p>
                        </div>
                        
                    </div>
                    
                    
                </div>

                <div className='button_container'>
                    {create_pack.create_pack_obj.current_step > 0 &&
                        <button onClick={() => {create_pack.dispatch({type: CREATE_PACK_ACTIONS.PREV_STEP})}} className="prev_button">Prev Step</button>

                    }
                    <button onClick={go_next_step} className={create_pack.create_pack_obj.steps_available.includes(create_pack.create_pack_obj.current_step + 1) ? `active_button` : 'disabled_button'}>Next Step</button>
                </div>
            </div>
        </>
    )
}

function Step_3() {
    const create_pack: Create_pack_context_type = useContext(create_pack_context)
    const device = useContext(Device_context)
    const [selection_state, set_selection_state] = useState(false)
    const [tag_jsx, set_tag_jsx] = useState<ReactElement[]>([])
    const [loading, set_loading] = useState(false)

    const selection_animation = useAnimation()
    
    //Animation for licens container when opening / closing
    useEffect(() => {

        if(selection_state === true) {
            selection_animation.start({
                height: "auto",
            })
        } else {
            selection_animation.start({
                height: "",
            })
        }
        
    }, [selection_state, selection_animation])

    //Creating tag components
    useEffect(() => {

        let tags_jsx: ReactElement[] = []
        for(let i = 0; i < create_pack.create_pack_obj.tags.length; i++) {
            tags_jsx.push(
                <Tag key={`${create_pack.create_pack_obj.tags[i]}_${i}`} name={create_pack.create_pack_obj.tags[i]} />
            )
        }
        

        const get_tag_grid = document.getElementById("included_tags_container") as HTMLDivElement
        function set_grid_template() {
            
            if(device.is_mobile) {
                get_tag_grid.style.gridTemplateColumns = `repeat(2, auto)`
            } else {
                get_tag_grid.style.gridTemplateColumns = `repeat(${tags_jsx.length}, auto)`
            }
        }
        set_grid_template()

        set_tag_jsx(tags_jsx)
        window.addEventListener("resize", set_grid_template)
        return(() => {
            window.removeEventListener("resize", set_grid_template)
        })
        
    }, [create_pack.create_pack_obj, device])

    function set_license(e: any) {
        const license = e.target.getAttribute("data-license") as string
        
        create_pack.dispatch({type: CREATE_PACK_ACTIONS.ADD_LICENSE, payload: {license}})
    }

    const set_tag = useCallback(
      () => {
        function set_tag() {
            const tag = document.getElementById("tag_input") as HTMLInputElement

            const valid = validate_pack_tag(tag.value)

            const error_message = document.getElementById("tag_error_message") as HTMLParagraphElement
            const exists = (create_pack.create_pack_obj.tags as string[]).includes(tag.value.toLowerCase())
    
            
            if(exists) {
                
                error_message.innerText = "Tag already exists."
    
            } else {
                
                if(typeof valid === "string") {
                
                    error_message.innerText = valid

                } else {
                    
                    if(create_pack.create_pack_obj.tags.length < 5) {
                        
                        create_pack.dispatch({type: CREATE_PACK_ACTIONS.ADD_TAG, payload: {tag: tag.value.toLowerCase() }})
                        error_message.innerText = ""
                        tag.value = ""

                    } else {
                        error_message.innerText = "Max. tags allowed 5."
                    }
                    
                    
                }
                
            }
        }

        set_tag()
      },
      [create_pack],
    )
    
    //Adding eventlistener to add tag with pressing enter
    useEffect(() => {
        const tag_input = document.getElementById("tag_input") as HTMLInputElement

        function add_tag(e: any) {
            if(tag_input === document.activeElement) {
                
                if(e.keyCode === 13) {
                    set_tag()
                }
            }
        }

        window.addEventListener("keyup",add_tag)
        return(() => {
            window.removeEventListener("keyup",add_tag)
        })
    }, [set_tag])

    function key_up_event(e: any) {
        const value = e.target.value as string

        const valid = validate_pack_tag(value)

        const error_message = document.getElementById("tag_error_message") as HTMLParagraphElement
        const exists = (create_pack.create_pack_obj.tags as string[]).includes(value.toLowerCase())

        if(exists) {

            error_message.innerText = "Tag already exists."

        } else {

            if(typeof valid === "string") {
            

                error_message.innerText = valid
            } else {
                error_message.innerText = ""
            }
            
        }


    }

    const App_notification: any = useContext(App_notification_context)
    const router = useRouter()
    
    function send_pack_to_api() {
        set_loading(true)
        async function send_pack() {
            const Form_data = create_form_data(create_pack.create_pack_obj)
        
            if(!Form_data) return
            const response = await fetch("/user/create_pack", {
                method: "POST",
                body: Form_data
            })
            
            if(response.status === 200) {
                const body = await response.json()
                function go_to_pack() {
                    router.push(`/pack?id=${body.pack_id}`, `/pack?id=${body.pack_id}`, {scroll: false})
                }

                App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully created pack!", message: "Your pack is now live and can be viewed by everyone.", button_label: "Visit pack", callb: go_to_pack}})
                set_loading(false)
            } else {
                App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Something went wrong", message: "We couldn't create your pack! Please relog and try again!", button_label: "Ok"}})
                set_loading(false)
            }
            
        }
        send_pack()
    }

    return(

        <>
            <H1_with_deco title='Step 3'/>
            <div className='step_3_container'>

                <div className='pack_tags_container'>
                    <h1>Tags</h1>
                    
                    <div className='add_tag_container'>
                        <input onKeyUp={key_up_event} type="text" placeholder='Max. 5 Tags' id="tag_input" autoComplete="off"/>
                        <p onClick={set_tag}>+ Add</p>
                    </div>

                    <p id="tag_error_message" className='tag_error_message'></p>
                    
                    <div className='included_tags_container' id="included_tags_container">

                        {tag_jsx}
                        
                    </div>
                </div>

                <div className='pack_license_container'>

                    <h1>License</h1>

                    <motion.div animate={selection_animation} onClick={() => set_selection_state(!selection_state)} onMouseLeave={() => set_selection_state(false)} className='selection_container'>

                        <div className='target_licens_container'>
                            {create_pack.create_pack_obj.license &&
                                <p>{capitalize_first_letter_rest_lowercase(create_pack.create_pack_obj.license)}</p>
                            }
                            {create_pack.create_pack_obj.license === null &&
                                <p>Choose a license</p>
                            }
                            <div className='licens_deco_container'>
                                <ExpandIcon/>
                            </div>
                        </div>

                        <ul>
                            <li onClick={set_license} data-license="opensource">Opensource</li>
                        </ul>
                    </motion.div>
                    
                </div>

            </div>

            <div className='button_container'>

                {create_pack.create_pack_obj.current_step > 0 &&
                    <button onClick={() => {create_pack.dispatch({type: CREATE_PACK_ACTIONS.PREV_STEP})}} className="prev_button">Prev Step</button>
                }

                <button onClick={send_pack_to_api} className={create_pack.create_pack_obj.steps_available.includes(create_pack.create_pack_obj.current_step + 1) ? `active_button` : 'disabled_button'}>
                    <p style={loading ? {opacity: 0} : {opacity: 1}}>Create Pack</p>
                    {loading ? <Loader loading={loading} main_color={false} scale={1}/> : null}
                </button>
            </div>
        </>
 
    )
}


//Tag component that previes one single tag
function Tag({name}: {name:string}) {
    const create_pack: Create_pack_context_type = useContext(create_pack_context)

    function delete_tag(e: any) {
        const tag_name = e.target.getAttribute("data-tag") as string

        create_pack.dispatch({type: CREATE_PACK_ACTIONS.DELETE_TAG, payload: {tag: tag_name}})
        
    }

    return (
        <div onClick={delete_tag} data-tag={name} id={name} className='tag'>
            <p>{name.toUpperCase()}</p>
            
            <div className='tag_close_container'>
                <CloseIcon/>
            </div>
        </div>
    );
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
                        <Image  src={`${create_pack.create_pack_obj.preview.preview_url}`} alt='An image that will preview this pack.' layout='fill'></Image>
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

    

    useEffect(() => {
        let asset_jsx: ReactElement[] = []

        function delete_asset(e: any) {
            create_pack.dispatch({type: CREATE_PACK_ACTIONS.DELETE_ASSET, payload: {section_name, asset_index: parseInt(e.target.id)}})
        }

        for(let i = 0; i < section_content.section_urls.length; i++) {
            
            asset_jsx.push(

                <div onClick={delete_asset} id={`${i}`} key={`${section_content.section_urls}_${i}`} className='asset'>
                    <Image  src={section_content.section_urls[i]} alt='An asset that will represent 1 sprite/asset from this pack.' layout='fill'></Image>

                    <div className='delete_background_container'>
                        <ThrashIcon/>
                    </div>

                </div>

            )

        }
        
        set_section_assets_jsx(asset_jsx.reverse())

    }, [create_pack, section_name, section_content, set_section_assets_jsx])

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
                
        if(type.toLowerCase() === "section") return create_pack.dispatch({type: CREATE_PACK_ACTIONS.ADD_ASSET, payload: {section_name, section_assets: files}})
        else return create_pack.dispatch({type: CREATE_PACK_ACTIONS.ADD_PREVIEW, payload: {section_name, preview_asset: files[0]}})

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
        <>
            <p id={`dropzone_error_message_${section_name}`} className='drop_zone_error_message'></p>
            <div onDrop={on_drop} onDragOver={on_drag_over} onDragLeave={on_drag_leave} id={`dropzone_${section_name}`} className='dropzone_container'>
                
                {children}

            </div>
        </>

        
    );
}



export default Create_page


export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const redirect = {redirect: {
        permanent: false,
        destination: "/login"
    }}

    try {
        const user = jwt.verify(context.req.cookies.user, process.env.JWT_PRIVATE_KEY as string)

        if(user) {
            return {
                props: {
                    user: user
                }
            }
        } else {
            return redirect
        }

    } catch (err) {
        return redirect
    }
}