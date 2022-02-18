import { AnimatePresence, motion} from "framer-motion";
import React, { useState, useEffect, useContext, useRef} from "react";
import Footer from "../components/footer";
import Link from "next/dist/client/link";
import { Signup_obj } from "../types";
import H1_with_deco from '../components/h1_with_deco';
import DoneIcon from "../public/icons/DoneIcon.svg"
import { Nav_shadow } from "../components/navigation";
import {NOTIFICATION_ACTIONS} from "../context/app_notification_context_provider"
import Loader from "../components/loading";
import router from "next/router";
import { Device_context } from "../context/device_context_provider";
import { App_notification_context } from "../context/app_notification_context_provider";
import Head from "next/head";
import VisibilityIcon from "../public/icons/VisibilityIcon.svg"
import VisibilityOffIcon from "../public/icons/VisibilityOffIcon.svg"
import { validate_email, validate_password, validate_username } from "../spritearc_lib/validate_lib";
const SIGNUP_CONTEXT: any = React.createContext(null)

const username_regex = new RegExp(/^(?=.{3,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)
const email_regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
const password_regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,32}$/)

//CONTEXT
interface SignupContext {
    signup_obj: Signup_obj,
    current_step: number,
    reset_signup: () => void,
    set_signup_obj: React.Dispatch<React.SetStateAction<Signup_obj>>
    // eslint-disable-next-line no-unused-vars
    set_error_message: (error: boolean, message: string, element: HTMLParagraphElement, input_element: HTMLInputElement) => void,
    set_step: React.Dispatch<React.SetStateAction<number>>,
    // eslint-disable-next-line no-unused-vars
    email_available: (email: string) => Promise<boolean>,
    // eslint-disable-next-line no-unused-vars
    username_available: (username: string) => Promise<boolean>,
    // eslint-disable-next-line no-unused-vars
    update_signup_informations: (specific_key: string, value: string | null | boolean) => void,
}


export default function Sign_up_page() {
    //Obj will be send to server to create account for user.
    const [signup_obj, set_signup_obj] = useState<Signup_obj>({
        username: null,
        email: null,
        password: null,
        legal: false,
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
        email_available,
        username_available,
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

    //Resets signup_obj and sets step back to 1.
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

    //Function that sets an error message error_message. also takes in the input element that it needs to style.
    function set_error_message(error: boolean, message: string, element: HTMLParagraphElement, input_element: HTMLInputElement) {
        const error_element_p = element
        
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
    
    //Function that validates email also sends a call to backend to verifiy if email already exist
    async function email_available(email: string): Promise<boolean> {
        try {
            const error_element = document.getElementById("input_error_message") as HTMLParagraphElement
            const input_element = document.getElementById("input") as HTMLInputElement
            const valid_email = validate_email(email)
            if(typeof valid_email === "string") {
                set_error_message(true, "Please enter a valid Email.", error_element, input_element)
                return false
            }
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/signup/validate_email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({email: email})
            })
            
            const response_obj = await response.json() as {success: boolean, message: string}

            if(response_obj.success === true) {
                set_error_message(false, "", error_element, input_element)
                return true
            } else {
                set_error_message(true, response_obj.message, error_element, input_element)
                return false
            }
            
        } catch ( err ) {
            console.log(err)
            return false
        }
            
    }

    //Validating username sends a call to backend to verifiy if username already exist
    async function username_available(username: string): Promise<boolean> {
        const error_element = document.getElementById("input_error_message") as HTMLParagraphElement
        const input_element = document.getElementById("input") as HTMLInputElement
        if(!input_element) return false
        if(!error_element) return false

        try {
           
            set_error_message(false, "", error_element, input_element)
            const valid_username = validate_username(username)
            
            if(typeof valid_username === "string") {
                set_error_message(true, valid_username, error_element, input_element)
                return false
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/signup/validate_username`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({username: username})
            })

            const response_obj = await response.json() as {success: boolean, message: string}

            if(response_obj.success === true) {
                set_error_message(false, "", error_element, input_element)
                return true
            } else {
                set_error_message(true, response_obj.message, error_element, input_element)
                return false
            }
            
        } catch ( err ) {

            set_error_message(true, "Something went wrong while trying to check if username is taken! Please try again later", error_element, input_element)
            return false
        }
             
    }

    //Adding smooth scroll to page.
    useEffect(() => {
        document.documentElement.style.scrollBehavior = "smooth"
        return () => {
            document.documentElement.style.scrollBehavior = "unset"
        };
    }, [])
    
    return (
        <>
            <Head>
                <title>{`Spritearc - Signup`}</title>
                <meta name="description" content={`Create an account to share your own Pixelart assets and sprites with the world.`}/>

                <meta property="og:url" content="https://Spritearc.com/"/>
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Spritearc - Signup`}/>
                <meta property="og:description" content={`Create an account to share your own Pixelart assets and sprites with the world.`}/>
                <meta property="og:image" content={`/images/wallpaper.png`}/>

                <meta name="twitter:card" content="summary_large_image"/>
                <meta property="twitter:domain" content="Spritearc.com"/>
                <meta property="twitter:url" content="https://Spritearc.com/"/>
                <meta name="twitter:title" content={`Spritearc - Login`}/>
                <meta name="twitter:description" content={`Create an account to share your own Pixelart assets and sprites with the world.`}/>
                <meta name="twitter:image:src" content={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/images/wallpaper.png`}/>
            </Head>
       
            <SIGNUP_CONTEXT.Provider value={PAGE_CONTEXT}>
                <div className="signup_page" id="signup_page">
                    
                    <div className="content">
                        <Nav_shadow/>
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
                                <div className="items">
                                    <p>{"Already a member? "}<Link href="/login" scroll={false}>Sign In</Link></p>
                                </div>
                                
                            </div>
                        </div>

                    </div>
                    
                    <Footer />
                </div>
            </SIGNUP_CONTEXT.Provider>
        </>
    );
}

export function Step_1() {
    const Device = useContext(Device_context)
    //Page context
    const PAGE_CONTEXT: SignupContext = useContext(SIGNUP_CONTEXT)
    let timer: any
    //Gets username from input. Setting signup_obj to null if validating fails.
    async function get_input_value(e: any) {

        clearTimeout(timer)
        timer = setTimeout(async () => {
            
            const username_available = await PAGE_CONTEXT.username_available(e.target.value)
            

            if(username_available) {
                PAGE_CONTEXT.update_signup_informations("username", e.target.value as string)
            } else {
                PAGE_CONTEXT.update_signup_informations("username", null)
            }
            
        }, 150);
        
    }

    //Increasing page when signup_obj.username is not null.
    async function next_page() {
        const get_input = document.getElementById("input") as HTMLInputElement
        const username_available = await PAGE_CONTEXT.username_available(get_input.value)
        
        if(username_available && PAGE_CONTEXT.current_step === 1) {
            PAGE_CONTEXT.update_signup_informations("username", get_input.value as string)
            PAGE_CONTEXT.set_step(PAGE_CONTEXT.current_step + 1)
        } else {
            PAGE_CONTEXT.update_signup_informations("username", null)
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
        
    }, [PAGE_CONTEXT.signup_obj.username])

    //Clearing timer and setting default value of input field
    useEffect(() => {
        const get_input = document.getElementById("input") as HTMLInputElement
        get_input.value = PAGE_CONTEXT.signup_obj.username ? PAGE_CONTEXT.signup_obj.username : `${get_input.value}`

    }, [PAGE_CONTEXT.signup_obj.username])
    
    //Setting default value of input field also focusing on imput on mount plus clearing timers on umount. Also adding enter key to go to next page.
    useEffect(() => {
        const input = document.getElementById("input") as HTMLInputElement
        const button = document.getElementById("step_button") as HTMLButtonElement
        
        if(!Device.is_mobile) input.focus()
        
        
        function enter(e: any) {
            if(e.keyCode === 13) button.click()
        }

        window.addEventListener("keypress", enter)
        return(() => {
            clearTimeout(timer)
            window.scrollTo(0,0)
            window.removeEventListener("keypress", enter)
        })
    }, [timer, Device.is_mobile])

    return (
        <motion.div className="step_container" id="step_container" initial={{opacity: 0, y: -50}} animate={{opacity: 1, y: 0, transition: {duration: .3, delay: 0.2}}} exit={{opacity: 0, y: 50, transition: {duration: 0.2,  type: "tween"}}}>
                        
            <H1_with_deco title="Please enter an username"/>
                
            <input onKeyUp={get_input_value} type="text" placeholder={"Username"} id="input"></input>
            <p className="input_error_message" id="input_error_message"></p>

            <div className="button_container">
                <button className="active_button" id="step_button" onClick={next_page}>
                    
                    Next step
                
                </button>
            </div>
            
            
        </motion.div>
    );
}

export function Step_2() {
    const Device = useContext(Device_context)
    const PAGE_CONTEXT: SignupContext = useContext(SIGNUP_CONTEXT)
    let timer: any

    //Gets username from input. Setting signup_obj to null if validating fails.
    async function get_input_value(e: any) {
        clearTimeout(timer)
        timer = setTimeout(async() => {
            const email_available = await PAGE_CONTEXT.email_available(e.target.value)

            if(email_available) {
                PAGE_CONTEXT.update_signup_informations("email", e.target.value as string)
            } else {
                PAGE_CONTEXT.update_signup_informations("email", null)
            }
        }, 150);
        
    }

    //Increasing page when signup_obj.email is not null.
    async function next_page() {
        const get_input = document.getElementById("input") as HTMLInputElement
        const email_available = await PAGE_CONTEXT.email_available(get_input.value)
        
        if(PAGE_CONTEXT.signup_obj.email && email_available) {
            PAGE_CONTEXT.update_signup_informations("email", get_input.value as string)
            PAGE_CONTEXT.set_step(PAGE_CONTEXT.current_step + 1)
        } else {
            PAGE_CONTEXT.update_signup_informations("email", null)
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
        
    }, [PAGE_CONTEXT.signup_obj.email])
    
    //Clearing timer and setting default value of input field
    useEffect(() => {
        const get_input = document.getElementById("input") as HTMLInputElement
        get_input.value = PAGE_CONTEXT.signup_obj.email ? PAGE_CONTEXT.signup_obj.email : `${get_input.value}`

        
    }, [PAGE_CONTEXT.signup_obj.email])

    //Setting default value of input field also focusing on imput on mount plus clearing timers on umount. Also adding enter key to go to next page.
    useEffect(() => {
        const input = document.getElementById("input") as HTMLInputElement
        const button = document.getElementById("step_button") as HTMLButtonElement

        if(!Device.is_mobile) input.focus()
        
        function enter(e: any) {
            if(e.keyCode === 13) button.click()
        }

        window.addEventListener("keypress", enter)
        return(() => {
            clearTimeout(timer)
            window.scrollTo(0,0)
            
            window.removeEventListener("keypress", enter)
        })
    }, [timer, Device.is_mobile])

    return (
        <motion.div className="step_container" initial={{opacity: 0, y: -50}} animate={{opacity: 1, y: 0, transition: {duration: .3, delay: 0.2}}} exit={{opacity: 0, y: 50, transition: {duration: 0.2,  type: "tween"}}}>
                        
            <H1_with_deco title="Please enter your email"/>
                
            <input onKeyUp={get_input_value} type="text" placeholder={"Example@domain.com"} id="input"></input>
            <p className="input_error_message" id="input_error_message"></p>

            <div className="button_container">
                <button onClick={next_page} className="active_button" id="step_button" >Next Step</button>
            </div>
            
            
        </motion.div>
    );
}

export function Step_3() {
    const PAGE_CONTEXT: SignupContext = useContext(SIGNUP_CONTEXT)
    const Device = useContext(Device_context)
    const App_notification: any = useContext(App_notification_context)
    const [loading, set_loading] = useState(false)
    const [password_visibility, set_password_visibility] = useState(false)
    const refs = useRef<any>([])
    //Validating passwort also calling validate_password_repeat.
    
    
    //PAGE_CONTEXT.update_signup_informations
    function toggle_password_type() {

        if(refs.current["password"].type === "password") {
            refs.current["password"].type = "text"
            refs.current["password_repeat"].type = "text"
            set_password_visibility(true)
        } else {
            refs.current["password"].type = "password"
            refs.current["password_repeat"].type = "password"
            set_password_visibility(false)
        }
    }
    
    function passwords_match() {
        if(refs.current["password"].value !== refs.current["password_repeat"].value) {
            PAGE_CONTEXT.set_error_message(true, "Passwords do not match!", refs.current["error_message_password_repeat"], refs.current["password_repeat"])
            return false
        }
        PAGE_CONTEXT.set_error_message(false, "", refs.current["error_message_password_repeat"], refs.current["password_repeat"])
        return true
    }

    function can_use_password(e: any) {
        PAGE_CONTEXT.update_signup_informations("password", null)
        const valid_password = validate_password(refs.current["password"].value)
        
        if(typeof valid_password === "string") return PAGE_CONTEXT.set_error_message(true, valid_password, refs.current["error_message_password"], refs.current["password"])
        PAGE_CONTEXT.set_error_message(false, "", refs.current["error_message_password"], refs.current["password"])
        const passwords_do_match = passwords_match()
        if(!passwords_do_match) return
        PAGE_CONTEXT.update_signup_informations("password", refs.current["password"].value)
    }

    function can_use_password_repeat(e: any) {
        PAGE_CONTEXT.update_signup_informations("password", null)
        const valid_password_repeat = validate_password(refs.current["password_repeat"].value)
        if(typeof valid_password_repeat === "string") return PAGE_CONTEXT.set_error_message(true, valid_password_repeat, refs.current["error_message_password_repeat"], refs.current["password_repeat"])
        PAGE_CONTEXT.set_error_message(false, "", refs.current["error_message_password_repeat"], refs.current["password_repeat"])
        //Paswords are valid
        const passwords_do_match = passwords_match()
        if(!passwords_do_match) return
        PAGE_CONTEXT.update_signup_informations("password", refs.current["password"].value)
    }

    //Function that validates signup_obj if successful sends create account call to server.
    async function signup() {
        set_loading(true)
        if(PAGE_CONTEXT.signup_obj.username && PAGE_CONTEXT.signup_obj.email && PAGE_CONTEXT.signup_obj.password && PAGE_CONTEXT.signup_obj.legal) {
            
            try {
                const response_stream = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/signup/create_account`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({...PAGE_CONTEXT.signup_obj})
                })
                
                if(response_stream.status !== 200) return App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: `${await response_stream.text()}`, message: "Please refill the registration form!", button_label: "Ok", callb: () => {PAGE_CONTEXT.reset_signup()}}})
                
                   
                
                App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Confirm Your Email!", message: "Please confirm your email address. We have sent you a confirmation email that will activate your account.", button_label: "Ok", callb: () => {router.push("/login", "/login", {scroll: false})}}})
                set_loading(false)
    
            } catch(err) {
                //Coudltn reach server
            }
            

        } else {
            App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Something went wrong!", message: "Please refill the registration form!", button_label: "Ok", callb: () => {PAGE_CONTEXT.reset_signup()}}})
            set_loading(false)
        }
    }

    //Setting styles of button
    useEffect(() => {
        const button = document.getElementById("step_button") as HTMLButtonElement
        if(PAGE_CONTEXT.signup_obj.username && PAGE_CONTEXT.signup_obj.email && PAGE_CONTEXT.signup_obj.password && PAGE_CONTEXT.signup_obj.legal) {
            button.classList.add("active_button")
            button.classList.remove("disabled_button")
        } else {
            button.classList.remove("active_button")
            button.classList.add("disabled_button")
        }
        
    }, [PAGE_CONTEXT.signup_obj.username, PAGE_CONTEXT.signup_obj.email, PAGE_CONTEXT.signup_obj.password, PAGE_CONTEXT.signup_obj.legal])
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
        if(!PAGE_CONTEXT.signup_obj.password) return
        
        const password = document.getElementById("input_password") as HTMLInputElement
        const password_repeat = document.getElementById("input_password_repeat") as HTMLInputElement
        password.value = PAGE_CONTEXT.signup_obj.password ? PAGE_CONTEXT.signup_obj.password : `${password.value}`
        password_repeat.value = PAGE_CONTEXT.signup_obj.password ? PAGE_CONTEXT.signup_obj.password : `${password_repeat.value}`

    }, [PAGE_CONTEXT.signup_obj.password])
    //Setting default value of input field also focusing on imput on mount plus clearing timers on umount. Also adding enter key to go to next page.
    useEffect(() => {
        const input_password = document.getElementById("input_password") as HTMLInputElement
        const button = document.getElementById("step_button") as HTMLButtonElement

        if(!Device.is_mobile) input_password.focus()
        
        
        function enter(e: any) {
            if(e.keyCode === 13) button.click()
        }

        window.addEventListener("keypress", enter)
        return(() => {
            window.scrollTo(0,0)
            
            window.removeEventListener("keypress", enter)
        })
    }, [Device.is_mobile])
    
    return (
        <motion.div className="step_container" initial={{opacity: 0, y: -50}} animate={{opacity: 1, y: 0, transition: {duration: .3, delay: 0.2}}} exit={{opacity: 0, y: 50, transition: {duration: 0.2,  type: "tween"}}}>
                        
            <H1_with_deco title="Please create a password"/>
                

            <div className='password_input_container'>
                <input ref={(el) => refs.current["password"] = el} onKeyUp={can_use_password} type="password" placeholder={"Password"} id="input_password" />
                <p ref={(el) => refs.current["error_message_password"] = el} className="input_error_message" id="input_error_message_password"></p>

                {password_visibility &&
                    <div key={"Visibility_off_icon"} onClick={toggle_password_type} className='password_visibility_icon_container'>
                        <VisibilityIcon/>
                    </div>
                }
                {!password_visibility &&
                    <div key={"Visibility_onn_icon"} onClick={toggle_password_type} className='password_visibility_icon_container'>
                        <VisibilityOffIcon/>
                    </div>
                }
            </div>
            
            <input ref={(el) => refs.current["password_repeat"] = el} onKeyUp={can_use_password_repeat} type="password" placeholder={"Password-repeat"} id="input_password_repeat" />
            <p ref={(el) => refs.current["error_message_password_repeat"] = el} className="input_error_message" id="input_error_message_password_repeat"></p>
            
            
            
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

                    <p>I want to get occasional E-mails from {`${process.env.NEXT_PUBLIC_APP_NAME}.com`}</p>

                </div>

            </div>
 



            <div className="button_container">
                <button onClick={signup} className="disabled_button" id="step_button" >
                    <p style={loading ? {opacity: 0} : {opacity: 1}}>Create Account</p>
                    {loading ? <Loader loading={loading} main_color={false} scale={1}/> : null}
                </button>
            </div>
            
            
        </motion.div>
    );
}

export function Step_displayer() {
    const PAGE_CONTEXT: SignupContext = useContext(SIGNUP_CONTEXT)

    async function set_page(page: number) {
        if(page === 1) {

            
            PAGE_CONTEXT.set_step(1)
            


        } else if(page === 2) {

            if(!PAGE_CONTEXT.signup_obj.username) {PAGE_CONTEXT.update_signup_informations("username", null); PAGE_CONTEXT.set_step(1); return}
            PAGE_CONTEXT.set_step(2)

        } else if(page === 3) {
            if(!PAGE_CONTEXT.signup_obj.username) {PAGE_CONTEXT.update_signup_informations("username", null); PAGE_CONTEXT.set_step(1); return}
            if(!PAGE_CONTEXT.signup_obj.email) {PAGE_CONTEXT.update_signup_informations("email", null); PAGE_CONTEXT.set_step(2); return}
            
            PAGE_CONTEXT.set_step(3)
            
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


        

    }, [PAGE_CONTEXT.current_step, PAGE_CONTEXT.signup_obj])

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


