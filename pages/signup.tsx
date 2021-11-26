import { AnimatePresence, motion} from "framer-motion";
import React, { useState, useEffect, useContext } from "react";
import Footer from "../components/footer";
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
    
    function increase_step() {
        if(current_step < 3) {
            set_step(current_step + 1)
        }
    }

    function decrease_step() {
        if(current_step > 1) {
            set_step(current_step - 1)
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

                    <div className="step_container">
                        <AnimatePresence exitBeforeEnter>

                            {current_step === 1 &&
                                <Step_1 key="step_1"/>
                            } : {current_step === 2 &&
                                <Step_2 key="step_2"/>
                            } : 
                            

                        </AnimatePresence>
                    </div>

                    <Step_displayer />

                    <div className="forward_container">

                    </div>
                    
                </Div100vh>

                <Footer />
            </div>
        </SIGNUP_CONTEXT.Provider>
    );
}


export function Step_1() {
    const PAGE_CONTEXT: PageContext = useContext(SIGNUP_CONTEXT)
    const username_regex = new RegExp(/^[a-zA-Z1-9\_\-\.]{3,16}$/)

    //Getting username of input field on every keyUp and focusout
    let timer: NodeJS.Timer
    //Validating username 
    async function validate_username(username: string): Promise<boolean> {
        return new Promise(async(resolve) => {

            try {

                clearTimeout(timer)
                timer = setTimeout(async() => {
                    const get_error_message = document.getElementById("input_error_message") as HTMLParagraphElement
                    if(username.length === 0) {
                        get_error_message.innerHTML = ""
                        PAGE_CONTEXT.update_signup_informations("username", null)
                        resolve(false)
                    } else if(username.length < 3) {
                        get_error_message.innerHTML = "Username is to short. Min. 3 characters."
                        PAGE_CONTEXT.update_signup_informations("username", null)
                        resolve(false)
                    } else if(username.length > 16) {
                        get_error_message.innerHTML = "Username is to long. Max. 16 characters."
                        PAGE_CONTEXT.update_signup_informations("username", null)
                        resolve(false)

                    } else {

                        if(username_regex.test(username) === true){
                            const response = await fetch(`http://localhost:3000/api/signup/validate_username?username=${username}`)
                            const username_available = (await response.json()).available
                            if(username_available) {
                                //Username available
                                get_error_message.innerHTML = ""
                                PAGE_CONTEXT.update_signup_informations("username", username)
                                resolve(true)
                            } else {
                                get_error_message.innerHTML = "Username is already taken."
                                PAGE_CONTEXT.update_signup_informations("username", null)
                                resolve(false)
                            }  
    
                        } else {
                            get_error_message.innerHTML = "Special characters that are allowed [. _ ,]"
                            PAGE_CONTEXT.update_signup_informations("username", null)
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
    async function get_username(e: any) {
        await validate_username(e.target.value)
    }

    //Increasing page when signup_obj.username is not null.
    async function next_page() {
        clearTimeout(timer)
        const get_input = document.getElementById("username_input") as HTMLInputElement
        const username_available = await validate_username(get_input.value)
        
        if(username_available && PAGE_CONTEXT.current_step < 3) {
            
            PAGE_CONTEXT.set_step(PAGE_CONTEXT.current_step + 1)
        }
    }

    useEffect(() => {
        const button = document.getElementById("step_button") as HTMLButtonElement

        if(PAGE_CONTEXT.signup_obj.username) {
            button.classList.add("active_button")
            button.classList.remove("disabled_button")
        } else {
            button.classList.remove("active_button")
            button.classList.add("disabled_button")
        }
        
    }, [PAGE_CONTEXT.signup_obj])

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
                
            <input onBlur={get_username} onKeyUp={get_username} type="text" placeholder={"Username"} id="username_input"></input>
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
            <p className="input_error_message"></p>

            <div className="button_container">
                <button className="prev_button" onClick={decrease_step}>Prev Step</button>
                <button className="disabled_button" id="step_button" onClick={increases_step}>Next Step</button>
            </div>
            
            
        </motion.div>
    );
}



export function Step_displayer() {
  return (
    <div className="step_displayer_container">

    </div>
  );
}


