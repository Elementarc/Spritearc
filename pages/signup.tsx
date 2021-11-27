import { AnimatePresence, motion, AnimateSharedLayout} from "framer-motion";
import React, { useState, useEffect, useContext } from "react";
import Footer from "../components/footer";
import Link from "next/dist/client/link";
import { SignUp } from "../types";
import H1_with_deco from '../components/h1_with_deco';
import Div100vh from 'react-div-100vh'
const SIGNUP_CONTEXT: any = React.createContext(null)


//CONTEXT
interface PageContext {
    signup_obj: SignUp,
    current_step: number,
    set_step: React.Dispatch<React.SetStateAction<number>>,
    update_signup_informations: (specific_key: string, value: string | null ) => void
}

const user = {
    username: "Hamit",
    email: "hamit@gmail.com",
    password: "hurrensohn1",
    password_repeat: "hurrensohn1",
    legal: true,
    occasional_emails: false
}

export default function Sign_up_page() {
    const [signup_obj, set_signup_obj] = useState<SignUp>({
        username: null,
        email: null,
        password: null,
        password_repeat: null,
        legal: false,
        occasional_emails: false,
    })
    const [current_step, set_step] = useState(1)

    //Function that updates a specific property of set_login_information
    async function update_signup_informations(specific_key: string, value: string | null) {
        const new_sign_up: any = Object.assign({}, signup_obj)
        
        if(new_sign_up.hasOwnProperty(specific_key)) {
            //Looping through object
            for(let key in new_sign_up) {
                //Comparing if given key exists on object
                if(specific_key === key) {
                    //Updates property
                    new_sign_up[key] = value
                }

            }
            set_signup_obj(new_sign_up)
        } else {
            //console.log("Object does not have a property called: ", specific_key)
        }
        
    }
    
    const PAGE_CONTEXT: PageContext = { 
        signup_obj,
        current_step,
        set_step,
        update_signup_informations
    }

    
    
    return (
        <SIGNUP_CONTEXT.Provider value={PAGE_CONTEXT}>
            <div className="login_page">
                
                    <Div100vh className="content">

                        <div className="steps">
                            <AnimatePresence exitBeforeEnter>

                                {current_step === 1 &&
                                    <Step_1 key="step_1"/>
                                } : {current_step === 2 &&
                                    <Step_2 key="step_2"/>
                                } : 

                            </AnimatePresence>

                            <Step_displayer />

                            <div className="forward_container">
                                <span className="bottom_section_line" />
                                <div>
                                    <p>{"Already a member? "}<Link href="/signin">Sign In</Link></p>
                                </div>
                                
                            </div>
                        </div>
                        
                    </Div100vh>
                
                <Footer />
            </div>
        </SIGNUP_CONTEXT.Provider>
    );
}


export function Step_1() {
    const PAGE_CONTEXT: PageContext = useContext(SIGNUP_CONTEXT)
    const username_regex = new RegExp(/^(?=.{3,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)
    //Getting username of input field on every keyUp and focusout
    let timer: NodeJS.Timer
    //Validating username 
    async function validate_username(username: string): Promise<boolean> {
        return new Promise(async(resolve) => {

            try {

                timer = setTimeout(async() => {

                    if(username.length === 0) {

                        set_error_message(true, "Please enter a username.")
                        resolve(false)

                    } else if(username.length < 3) {

                        set_error_message(true, "Username is to short. Min. 3 characters.")
                        resolve(false)

                    } else if(username.length > 16) {

                        set_error_message(true, "Username is to long. Max. 16 characters.")
                        resolve(false)

                    } else {

                        const beginning_regex = new RegExp(/^[\.\_]+/)
                        const end_regex = new RegExp(/[\.\_]+$/)

                        //Checking if username has a special character at the beginning or end.
                        if(beginning_regex.test(username) === true || end_regex.test(username) === true) {

                            set_error_message(true, "You can't use special characters at the beginning or end of your username.")
                            resolve(false)

                        } else {
                            const look_double_special_characters_regex = new RegExp(/(?<=[\.\_])[\.\_]/)

                            //Checking if username contains 2 special characters after eachother
                            if(look_double_special_characters_regex.test(username)) {

                                set_error_message(true, "Username cannot contain 2 special characters after each other.")
                                resolve(false)

                            } else {

                                //Finally checking if username passes the test. It should pass the test at this point of code. Else is just incase i forgot something.
                                if(username_regex.test(username) === true){
                                    //Checking if a username already exists with.
                                    const response = await fetch(`http://localhost:3000/api/signup/validate_username?username=${username}`)
                                    const username_available = (await response.json()).available
        
                                    //If username is available update signup_obj state.
                                    if(username_available) {
                                        set_error_message(false, "")
                                        resolve(true)
                                        
        
                                    } else {

                                        set_error_message(true, "Username is already taken.")
                                        resolve(false)
        
                                    }

                                } else {

                                    set_error_message(true, "Special characters that are allowed: . _")
                                    resolve(false)

                                }
            

                            }
                            
                        }
                            
                    }
                }, 250)
                
            } catch ( err ) {

                console.log(err)
                resolve(false)
            }
             
        })
    }
    
    //Gets username from input. Setting signup_obj to null if validating fails.
    async function get_input_value(e: any) {
        clearTimeout(timer)
        const username_available = await validate_username(e.target.value)

        if(username_available) {
            PAGE_CONTEXT.update_signup_informations("username", e.target.value as string)
        } else {
            PAGE_CONTEXT.update_signup_informations("username", null)
        }
        
    }

    //Increasing page when signup_obj.username is not null.
    async function next_page() {
        
        const get_input = document.getElementById("username_input") as HTMLInputElement
        const username_available = await validate_username(get_input.value)
        clearTimeout(timer)
        if(username_available && PAGE_CONTEXT.current_step === 1) {
            
            PAGE_CONTEXT.set_step(PAGE_CONTEXT.current_step + 1)
        }
    }

    //Function that sets error_message
    function set_error_message(error: boolean, message: string) {
        const get_error_message = document.getElementById("input_error_message") as HTMLParagraphElement
        
        const input = document.getElementById("username_input") as HTMLInputElement
        const h1 = document.getElementById("h1_with_deco") as HTMLDivElement

        
        if(get_error_message) {
            if(error) {

                input.style.borderBottomColor = "#F75E5E"
                h1.style.color = "#F75E5E"
                get_error_message.innerHTML = `${message}`
                
    
            } else {
    
                input.style.borderBottomColor = ""
                h1.style.color = ""
                get_error_message.innerHTML = ``
                
            }
        } else {
            return
        }
        

        
    }

    //Setting styles for button based on Signup_obj.username
    useEffect(() => {
        const button = document.getElementById("step_button") as HTMLButtonElement

        if(PAGE_CONTEXT.signup_obj.username) {
            button.classList.add("active_button")
            button.classList.remove("disabled_button")
        } else {
            button.classList.remove("active_button")
            button.classList.add("disabled_button")
        }
        
        return(() => {
            clearTimeout(timer)
        })

    }, [PAGE_CONTEXT.signup_obj.username])

    //Clearing timer
    useEffect(() => {
        const get_input = document.getElementById("username_input") as HTMLInputElement

        get_input.value = PAGE_CONTEXT.signup_obj.username ? PAGE_CONTEXT.signup_obj.username : ""
        return () => {
            clearTimeout(timer)
        };
    }, [])
    
    return (
        <motion.div className="step_container" initial={{opacity: 0, y: -50}} animate={{opacity: 1, y: 0, transition: {duration: .3, delay: 0.2}}} exit={{opacity: 0, y: 50, transition: {duration: 0.2,  type: "tween"}}}>
                        
            <H1_with_deco title="Enter a username"/>
                
            <input onBlur={get_input_value} onKeyUp={get_input_value} type="text" placeholder={"Username"} id="username_input"></input>
            <p className="input_error_message" id="input_error_message"></p>

            <div className="button_container">
                <button className="active_button" id="step_button" onClick={next_page}>Next Step</button>
            </div>
            
            
        </motion.div>
    );
}

export function Step_2() {
    const PAGE_CONTEXT: PageContext = useContext(SIGNUP_CONTEXT)

    function decrease_step() {
        if(PAGE_CONTEXT.current_step > 1 && PAGE_CONTEXT.signup_obj.username) {
            PAGE_CONTEXT.set_step(PAGE_CONTEXT.current_step - 1)
        }
    }

    function increases_step() {
        if(PAGE_CONTEXT.current_step < 3 && PAGE_CONTEXT.signup_obj.email) {
            PAGE_CONTEXT.set_step(PAGE_CONTEXT.current_step + 1)
        }
    }

    return (
        <motion.div className="step_container" initial={{opacity: 0, y: -50}} animate={{opacity: 1, y: 0, transition: {duration: .3, delay: 0.2}}} exit={{opacity: 0, y: 50, transition: {duration: 0.2,  type: "tween"}}}>
                        
            <H1_with_deco title="Enter an E-mail"/>
                
            <input type="text" placeholder={"E-Mail"} id="username_input"></input>
            <input type="text" placeholder={"E-Mail"} id="username_input"></input>
            <input type="text" placeholder={"E-Mail"} id="username_input"></input>
            <p className="input_error_message"></p>

            <div className="button_container">
                <button className="prev_button" onClick={decrease_step}>Prev Step</button>
                <button className="disabled_button" id="step_button" onClick={increases_step}>Next Step</button>
            </div>
            
            
        </motion.div>
    );
}



export function Step_displayer() {
    const PAGE_CONTEXT: PageContext = useContext(SIGNUP_CONTEXT)

    function move_to_step(e: any) {
        
        
    }
    //Setting styles for steps whenever current page changes
    useEffect(() => {
        const get_steps = Array.from(document.getElementsByClassName("step") as HTMLCollection)

        for(let i = 0; i < get_steps.length; i++) {

            if((i+1) === PAGE_CONTEXT.current_step) {
                get_steps[i].classList.add("step_focus")
                get_steps[i].classList.remove("step_done")
                get_steps[i].classList.remove("step_inactive")
            } else {

                if(i < PAGE_CONTEXT.current_step) {
                    get_steps[i].classList.add("step_done")
                    get_steps[i].classList.remove("step_inactive")
                    get_steps[i].classList.remove("step_focus")
                } else {
                    get_steps[i].classList.add("step_inactive")
                    get_steps[i].classList.remove("step_done")
                    get_steps[i].classList.remove("step_focus")
                }
            }
        }

    }, [PAGE_CONTEXT.current_step])

    return (
        <div className="step_displayer_container">
                
            <div className="step step_inactive" id="step_1">
                <p>Step 1</p>
            </div>

            <span />

            <div className="step step_inactive" id="step_2">
                <p>Step 2</p>
            </div>

            <span />

            <div className="step step_inactive" id="step_3">
                <p>Step 3</p>
            </div>
        </div>
    );
}


