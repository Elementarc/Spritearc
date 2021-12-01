import { AnimatePresence, motion, AnimateSharedLayout} from "framer-motion";
import React, { useState, useEffect, useContext } from "react";
import Footer from "../components/footer";
import Link from "next/dist/client/link";
import { App_context, SignUp, Notification } from "../types";
import H1_with_deco from '../components/h1_with_deco';
import DoneIcon from "../public/icons/DoneIcon.svg"
import { useRouter } from "next/router";
import { APP_CONTEXT } from "../components/layout";
const SIGNUP_CONTEXT: any = React.createContext(null)

const username_regex = new RegExp(/^(?=.{3,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)
const email_regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
const password_regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,32}$/)

//CONTEXT
interface SignupContext {
    signup_obj: SignUp,
    current_step: number,
    reset_signup: () => void,
    set_signup_obj: React.Dispatch<React.SetStateAction<SignUp>>
    set_error_message: (error: boolean, message: string, element: HTMLParagraphElement, input_element: HTMLInputElement) => void,
    set_step: React.Dispatch<React.SetStateAction<number>>,
    update_signup_informations: (specific_key: string, value: string | null | boolean) => void,
}

export default function Sign_up_page() {
    const router = useRouter()
    //Obj will be send to server to create account for user.
    const [signup_obj, set_signup_obj] = useState<SignUp>({
        username: "test",
        email: "test@gmail.co",
        password: "hurrensohn1",
        legal: true,
        occasional_emails: false,
    })

    //Used to navigate between steps.
    const [current_step, set_step] = useState(1)

    //Constants for whole page.
    const PAGE_CONTEXT: SignupContext = { 
        signup_obj,
        current_step,
        reset_signup,
        set_error_message,
        set_signup_obj,
        set_step,
        update_signup_informations,
    }

    //Function that updates a specific property of set_login_information
    async function update_signup_informations(specific_key: string, value: string | null | boolean) {
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

    //Resets signup_obj and sets step back to 1. Used when user succesfully signed in.
    function reset_signup() {
        set_signup_obj({
            username: null,
            email: null,
            password: null,
            legal: false,
            occasional_emails: false,
        })
        set_step(1)
        //router.push("/login", "/login", {scroll: false})
    }

    //Function that sets error_message
    function set_error_message(error: boolean, message: string, error_element: HTMLParagraphElement, input_element: HTMLInputElement) {
        const error_element_p = error_element
        
        const input = input_element
        const h1 = document.getElementById("h1_with_deco") as HTMLDivElement

        
        if(error_element_p) {
            if(error) {

                input.style.borderBottomColor = "#F75E5E"
                h1.style.color = "#F75E5E"
                error_element_p.innerHTML = `${message}`
                

            } else {
                input.style.borderBottomColor = ""
                h1.style.color = ""
                error_element_p.innerHTML = ``
                
            }
        } else {
            return
        }
        

        
    }
    
    return (
        <SIGNUP_CONTEXT.Provider value={PAGE_CONTEXT}>
            <div className="login_page" id="login_page">
                
                <div className="content">

                    <div className="steps">
                        <AnimatePresence exitBeforeEnter>

                            {current_step === 1 &&
                                <Step_1 key="step_1"/>
                            } : {current_step === 2 &&
                                <Step_2 key="step_2"/>
                            } : { current_step === 3 &&
                                <Step_3 key="step_3"/>
                            }

                        </AnimatePresence>

                        <Step_displayer />

                        <div className="forward_container">
                            <span className="bottom_section_line" />
                            <div>
                                <p>{"Already a member? "}<Link href="/signin">Sign In</Link></p>
                            </div>
                            
                        </div>
                    </div>

                </div>
                
                <Footer />
            </div>
        </SIGNUP_CONTEXT.Provider>
    );
}

export function Step_1() {
    //Page context
    const PAGE_CONTEXT: SignupContext = useContext(SIGNUP_CONTEXT)
    //Function that creates an error message takes in error: boolean, message: string, the paragraph element that will be inserted the message, and the input field that needs to be styled
    const set_error_message = PAGE_CONTEXT.set_error_message
    let timer: NodeJS.Timer

    //Validating username 
    async function validate_username(username: string): Promise<boolean> {
        return new Promise(async(resolve) => {
            
            try {
                const error_element = document.getElementById("input_error_message") as HTMLParagraphElement
                const input_element = document.getElementById("input") as HTMLInputElement
                timer = setTimeout(async() => {

                    if(username.length === 0) {

                        set_error_message(true, "Please enter a username.", error_element, input_element)
                        resolve(false)

                    } else if(username.length < 3) {

                        set_error_message(true, "Username is to short. Min. 3 characters.", error_element, input_element)
                        resolve(false)

                    } else if(username.length > 16) {

                        set_error_message(true, "Username is to long. Max. 16 characters.", error_element, input_element)
                        resolve(false)

                    } else {

                        const beginning_regex = new RegExp(/^[\.\_]+/)
                        const end_regex = new RegExp(/[\.\_]+$/)

                        //Checking if username has a special character at the beginning or end.
                        if(beginning_regex.test(username) === true || end_regex.test(username) === true) {

                            set_error_message(true, "You can't use special characters at the beginning or end of your username.", error_element, input_element)
                            resolve(false)

                        } else {
                            const look_double_special_characters_regex = new RegExp(/(?<=[\.\_])[\.\_]/)

                            //Checking if username contains 2 special characters after eachother
                            if(look_double_special_characters_regex.test(username)) {

                                set_error_message(true, "Username cannot contain 2 special characters after each other.", error_element, input_element)
                                resolve(false)

                            } else {

                                //Finally checking if username passes the test. It should pass the test at this point of code. Else is just incase i forgot something.
                                if(username_regex.test(username) === true){
                                    //Checking if a username already exists with.
                                    const response = await fetch(`/api/signup/validate_username`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({username: username})
                                    })
                                    const username_available = (await response.json()).available
        
                                    //If username is available update signup_obj state.
                                    if(username_available) {
                                        set_error_message(false, "", error_element, input_element)
                                        resolve(true)
                                        
        
                                    } else {

                                        set_error_message(true, "Username is already taken.", error_element, input_element)
                                        resolve(false)
        
                                    }

                                } else {

                                    set_error_message(true, "Special characters that are allowed: . _", error_element, input_element)
                                    resolve(false)

                                }
            

                            }
                            
                        }
                            
                    }
                }, 200)
                
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
        const get_input = document.getElementById("input") as HTMLInputElement
        const username_available = await validate_username(get_input.value)

        
        if(username_available && PAGE_CONTEXT.current_step === 1) {
            
            PAGE_CONTEXT.set_step(PAGE_CONTEXT.current_step + 1)
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

    //Clearing timer and setting default value of input field
    useEffect(() => {
        const get_input = document.getElementById("input") as HTMLInputElement

        get_input.value = PAGE_CONTEXT.signup_obj.username ? PAGE_CONTEXT.signup_obj.username : ""
        return () => {
            clearTimeout(timer)
        };
    }, [])
    
    return (
        <motion.div className="step_container" initial={{opacity: 0, y: -50}} animate={{opacity: 1, y: 0, transition: {duration: .3, delay: 0.2}}} exit={{opacity: 0, y: 50, transition: {duration: 0.2,  type: "tween"}}}>
                        
            <H1_with_deco title="Please enter an username"/>
                
            <input onBlur={get_input_value} onKeyUp={get_input_value} type="text" placeholder={"Username"} id="input"></input>
            <p className="input_error_message" id="input_error_message"></p>

            <div className="button_container">
                <button className="active_button" id="step_button" onClick={next_page}>Next Step</button>
                
            </div>
            
            
        </motion.div>
    );
}

export function Step_2() {
    const PAGE_CONTEXT: SignupContext = useContext(SIGNUP_CONTEXT)
    const set_error_message = PAGE_CONTEXT.set_error_message
    let timer: NodeJS.Timer

    //Function that validates email also sends a call to backend to verifiy if email already exist
    async function validate_email(email: string): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                const error_element = document.getElementById("input_error_message") as HTMLParagraphElement
                const input_element = document.getElementById("input") as HTMLInputElement
                timer = setTimeout(async() => {
                    if(email_regex.test(email) === true) {
                        const response = await fetch(`/api/signup/validate_email`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({email: email})
                        })
                        const email_available = await response.json()

                        if(email_available.available) {
                            set_error_message(false, "", error_element, input_element)
                            resolve(true)
                        } else {
                            set_error_message(true, "Email is already in use.", error_element, input_element)
                            resolve(false)
                        }
                        
                    } else {
                        set_error_message(true, "Please enter a valid Email.", error_element, input_element)
                        resolve(false)
                    }
                }, 200);
                
            } catch ( err ) {
                console.log(err)
            }
            
        })
    }

    //Gets username from input. Setting signup_obj to null if validating fails.
    async function get_input_value(e: any) {
        clearTimeout(timer)
        const email_available = await validate_email(e.target.value as string)

        if(email_available) {
            PAGE_CONTEXT.update_signup_informations("email", e.target.value as string)
        } else {
            PAGE_CONTEXT.update_signup_informations("email", null)
        }
    }

    //Increasing page when signup_obj.email is not null.
    async function next_page() {
        const get_input = document.getElementById("input") as HTMLInputElement
        const email_available = await validate_email(get_input.value)
        
        if(PAGE_CONTEXT.signup_obj.email && email_available) {
            
            PAGE_CONTEXT.set_step(PAGE_CONTEXT.current_step + 1)
        }
    }

    //Setting styles for button based on Signup_obj.username
    useEffect(() => {
        const button = document.getElementById("step_button") as HTMLButtonElement

        if(PAGE_CONTEXT.signup_obj.email) {
            button.classList.add("active_button")
            button.classList.remove("disabled_button")
        } else {
            button.classList.remove("active_button")
            button.classList.add("disabled_button")
        }
        
        return(() => {
            clearTimeout(timer)
        })

    }, [PAGE_CONTEXT.signup_obj.email])
    
    //Clearing timer and setting default value of input field
    useEffect(() => {
        const get_input = document.getElementById("input") as HTMLInputElement
        get_input.value = PAGE_CONTEXT.signup_obj.email ? PAGE_CONTEXT.signup_obj.email : ""

        return(() => {
            clearTimeout(timer)
        })
    }, [])

    return (
        <motion.div className="step_container" initial={{opacity: 0, y: -50}} animate={{opacity: 1, y: 0, transition: {duration: .3, delay: 0.2}}} exit={{opacity: 0, y: 50, transition: {duration: 0.2,  type: "tween"}}}>
                        
            <H1_with_deco title="Please enter your email"/>
                
            <input onBlur={get_input_value} onKeyUp={get_input_value} type="text" placeholder={"Example@domain.com"} id="input"></input>
            <p className="input_error_message" id="input_error_message"></p>

            <div className="button_container">
                <button onClick={next_page} className="active_button" id="step_button" >Next Step</button>
            </div>
            
            
        </motion.div>
    );
}

export function Step_3() {
    const PAGE_CONTEXT: SignupContext = useContext(SIGNUP_CONTEXT)
    const APP: App_context = useContext(APP_CONTEXT)

    function validate_password() {
        const password = document.getElementById("input_password") as HTMLInputElement
        const password_repeat = document.getElementById("input_password_repeat") as HTMLInputElement

        const input_error_message_password = document.getElementById("input_error_message_password") as HTMLParagraphElement


        
        if(password_regex.test(password.value)) {
            PAGE_CONTEXT.set_error_message(false, "", input_error_message_password, password)
            PAGE_CONTEXT.set_error_message(false, "", input_error_message_password, password_repeat)
            validate_password_repeat()
            return true
        } else {
            
            PAGE_CONTEXT.set_error_message(true, "Password needs to be atleast 8 characters long. One uppercase / lowercase and one number. Max. 32 characters", input_error_message_password, password)
            return false
        }
        
    }

    function validate_password_repeat() {
        const password = document.getElementById("input_password") as HTMLInputElement
        const password_repeat = document.getElementById("input_password_repeat") as HTMLInputElement

        const input_error_message_password_repeat = document.getElementById("input_error_message_password_repeat") as HTMLParagraphElement
        
        if(password.value === password_repeat.value) {
            PAGE_CONTEXT.update_signup_informations("password", password.value)
            PAGE_CONTEXT.set_error_message(false, "", input_error_message_password_repeat, password_repeat)
            return true
        } else {

            PAGE_CONTEXT.set_error_message(true, "Passwords do not match.", input_error_message_password_repeat, password_repeat)
            return false
        }
            
    }

    async function signup() {

        if(PAGE_CONTEXT.signup_obj.username && PAGE_CONTEXT.signup_obj.email && PAGE_CONTEXT.signup_obj.password && PAGE_CONTEXT.signup_obj.legal) {
            
            const response_stream = await fetch("/api/signup/create_account", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({signup_obj: PAGE_CONTEXT.signup_obj})
            })
            const {successful} = await response_stream.json()
               
            if(successful) {
                APP.create_notification({toggle: true, success: false, title: "Success!", message: "We send you an email. Please check your email to verify your account! You will be redirected to our login page.", button_label: "Ok", callb: () => {PAGE_CONTEXT.reset_signup()}})
            } else {
                APP.create_notification({toggle: true, success: false, title: "Something went wrong!", message: "We are sorry that you have to experience this. Please restart your registration.", button_label: "Ok", callb: () => {PAGE_CONTEXT.reset_signup()}})
            }

            PAGE_CONTEXT.set_signup_obj({username: null, email: null, password: null, legal: false, occasional_emails: false})
        }
    }

    //Setting style of button
    useEffect(() => {
        const button = document.getElementById("step_button") as HTMLButtonElement
        if(PAGE_CONTEXT.signup_obj.username && PAGE_CONTEXT.signup_obj.email && PAGE_CONTEXT.signup_obj.password && PAGE_CONTEXT.signup_obj.legal) {
            button.classList.add("active_button")
            button.classList.remove("disabled_button")
        } else {
            button.classList.remove("active_button")
            button.classList.add("disabled_button")
        }
        
    }, [PAGE_CONTEXT.signup_obj])

    //Setting style of checkbox when unchecked / checked
    useEffect(() => {
        const get_legal = document.getElementById("legal_check_box") as HTMLDivElement

        if(PAGE_CONTEXT.signup_obj.legal) {
            get_legal.style.border = "1px solid white"
            
        } else {
            get_legal.style.border = "1px solid #F75E5E"
            
        }
    }, [PAGE_CONTEXT.signup_obj.legal])

    //Setting default values of input field
    useEffect(() => {
        const password = document.getElementById("input_password") as HTMLInputElement
        const password_repeat = document.getElementById("input_password_repeat") as HTMLInputElement
        password.value = PAGE_CONTEXT.signup_obj.password ? PAGE_CONTEXT.signup_obj.password : ""
        password_repeat.value = PAGE_CONTEXT.signup_obj.password ? PAGE_CONTEXT.signup_obj.password : ""

    }, [])

    return (
        <motion.div className="step_container" initial={{opacity: 0, y: -50}} animate={{opacity: 1, y: 0, transition: {duration: .3, delay: 0.2}}} exit={{opacity: 0, y: 50, transition: {duration: 0.2,  type: "tween"}}}>
                        
            <H1_with_deco title="Please create a password"/>
                
            <input  onBlur={validate_password} onKeyUp={validate_password} type="password" placeholder={"Password"} id="input_password" />
            <p className="input_error_message" id="input_error_message_password"></p>
            <input onBlur={validate_password_repeat} onKeyUp={validate_password_repeat} type="password" placeholder={"Password-repeat"} id="input_password_repeat" />
            <p className="input_error_message" id="input_error_message_password_repeat"></p>
            
            <div className="legal_container">
                <div className="check_box_container">

                    <div onClick={() => {PAGE_CONTEXT.update_signup_informations("legal", !PAGE_CONTEXT.signup_obj.legal)}} className="check_box" id="legal_check_box">
                        
                        { PAGE_CONTEXT.signup_obj.legal &&
                            <DoneIcon key="legal_key_svg" className="done_icon"/>
                        }

                    </div>

                    <p>I agree to the <Link href="">Terms of use</Link> and i have read the <Link href="">Privacy policy</Link> and accept it.</p>

                </div>

                <div className="check_box_container">

                    <div onClick={() => {PAGE_CONTEXT.update_signup_informations("occasional_emails", !PAGE_CONTEXT.signup_obj.occasional_emails)}} className="check_box">
                        
                        { PAGE_CONTEXT.signup_obj.occasional_emails &&
                            <DoneIcon key="occasional_emails_key_svg" className="done_icon"/>
                        }

                    </div>

                    <p>I want to get occasional E-mails from PixelPalast</p>

                </div>

            </div>
 



            <div className="button_container">
                <button onClick={signup} className="disabled_button" id="step_button" >Create Account</button>
            </div>
            
            
        </motion.div>
    );
}

export function Step_displayer() {
    const PAGE_CONTEXT: SignupContext = useContext(SIGNUP_CONTEXT)

    function set_page(page: number) {
        
        if(page === 1) {

            PAGE_CONTEXT.set_step(1)

        } else if(page === 2) {

            if(PAGE_CONTEXT.signup_obj.username) {
                PAGE_CONTEXT.set_step(2)
            }

        } else if(page === 3) {
            if(PAGE_CONTEXT.signup_obj.email && PAGE_CONTEXT.signup_obj.username) {
                PAGE_CONTEXT.set_step(3)
            }
        }
    }

    //Setting styles for steps whenever signup_obj & current_step changes
    useEffect(() => {
        const get_steps = Array.from(document.getElementsByClassName("step") as HTMLCollection)
        
        for(let i = 0; i < get_steps.length; i++) {
            const current_step = i
            
            //Setting current step always focus
            if(current_step + 1 === PAGE_CONTEXT.current_step) {

                get_steps[current_step].classList.add("step_focus")
                get_steps[current_step].classList.remove("step_done")
                get_steps[current_step].classList.remove("step_inactive")

            } else {
                //Checking if username is available and adding styles to next step for better ux
                if (PAGE_CONTEXT.signup_obj.username && current_step === 1) {
                    
                    get_steps[current_step].classList.add("step_done")
                    get_steps[current_step].classList.remove("step_focus")
                    get_steps[current_step].classList.remove("step_inactive")


                } else if(PAGE_CONTEXT.signup_obj.username && PAGE_CONTEXT.signup_obj.email && current_step === 2) {

                    get_steps[current_step].classList.add("step_done")
                    get_steps[current_step].classList.remove("step_focus")
                    get_steps[current_step].classList.remove("step_inactive")
                    
                } else {
                    
                    get_steps[current_step].classList.add("step_inactive")
                    get_steps[current_step].classList.remove("step_done")
                    get_steps[current_step].classList.remove("step_focus")
                    
                }
               
                //Always setting prev steps styles to focus
                if( current_step < PAGE_CONTEXT.current_step ) {

                    get_steps[current_step].classList.add("step_focus")
                    get_steps[current_step].classList.remove("step_done")
                    get_steps[current_step].classList.remove("step_inactive")

                } 
            }
        }


        

    }, [PAGE_CONTEXT.signup_obj.username, PAGE_CONTEXT.signup_obj.email, PAGE_CONTEXT.signup_obj.password, PAGE_CONTEXT.current_step])

    return (
        <div className="step_displayer_container">
            
            <div onClick={() => set_page(1)} className="step step_inactive" >
                <p id="step_1">Step 1</p>
            </div>
            

            <span />

            <div onClick={() => set_page(2)} className="step step_inactive">
                <p id="step_2">Step 2</p>
            </div>

            <span />

            <div onClick={() => set_page(3)} className="step step_inactive">
                <p id="step_3">Step 3</p>
            </div>
        </div>
    );
}

