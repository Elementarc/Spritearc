import React, {useEffect, useState, useContext} from 'react';
import { App_notification_context_type, Auth_context_type, Server_response, Server_response_email } from '../../types';
import Footer from '../../components/footer';
import { format_date } from '../../lib/date_lib';
import { App_notification_context, NOTIFICATION_ACTIONS } from '../../context/app_notification_context_provider';
import Fixed_app_content_overlay from '../../components/fixed_app_content_overlay';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Auth_context, USER_DISPATCH_ACTIONS } from '../../context/auth_context_provider';
import { validate_email, validate_password } from '../../spritearc_lib/validate_lib';
import Head from 'next/head';
import { Nav_shadow } from '../../components/navigation';
import Protected_route from '../../components/protected_route';


export default function Account_settings_page_handler() {
    return (
        <Protected_route>
            <Account_settings_page/>
        </Protected_route>
    );
}

export function Account_settings_page() {
    const [safe_email, set_safe_email] = useState<null | string>(null)
    const App_notification: App_notification_context_type = useContext(App_notification_context)
    const Auth: Auth_context_type = useContext(Auth_context)
    const [account_delete_warning, set_account_delete_warning] = useState(false)
    const [delete_account, set_delete_account] = useState(false)
    const [update_email, set_update_email] = useState(false)
    const [settings_state, set_settings_state] = useState("account")
    const router = useRouter()
    const user = Auth.user.public_user

    useEffect(() => {

        async function get_account_safe_email() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/get_email`,{
                    method: "POST",
                    headers: {
                        "x-access-token": `${sessionStorage.getItem("user") ? sessionStorage.getItem("user") : ""}`,
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({user: user.username})
                })

                const response_obj = await response.json() as Server_response_email

                if(!response_obj.success) return set_safe_email("undefined")
                set_safe_email(response_obj.email)

            } catch(err) {
                //COuldnt reach server
            }
        }
        get_account_safe_email()
        
    }, [user])

    async function delete_account_call() {
        try {
            const password_input = document.getElementById("account_password_input") as HTMLInputElement
            if(!password_input) return

            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/delete_account`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "x-access-token": `${sessionStorage.getItem("user") ? sessionStorage.getItem("user") : ""}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({password: password_input.value})
            })

            const response_obj = await response.json() as Server_response

            
            if(!response_obj.success) return App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Something went wrong", message: response_obj.message, button_label: "Okay"}})

            App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully deleted your account!", message: "We have successfully deleted your account. We are sorry that we could'nt reach your expectations! We will work on to improve our service. Thank you for trying!", button_label: "Okay", callb: () => {router.push("/", "/", {scroll: false}); Auth.dispatch({type: USER_DISPATCH_ACTIONS.LOGOUT, payload: {auth: false}})}}})

        } catch(err) {
            //COuldnt reach server
        }
    }
    async function update_new_email() {
        
        try {
            const password_input = document.getElementById("account_password_input") as HTMLInputElement
            if(!password_input) return
            const new_email_input = document.getElementById("new_email_input") as HTMLInputElement
            if(!new_email_input) return
            
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/update_email`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "x-access-token": `${sessionStorage.getItem("user") ? sessionStorage.getItem("user") : ""}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({new_email: new_email_input.value, password: password_input.value})
            })
            
            const response_obj = await response.json() as Server_response
            
            if(response.status !== 200) return App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Something went wrong", message: response_obj.message, button_label: "Okay"}})
            
            if(!response_obj.success) return App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Email is already in use!", message: "Please choose an email that is not in use! Make sure that you are the owner of that email address!", button_label: "Okay", callb: () => {set_update_email(false); new_email_input.value = ""}}})
            App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully updated your email!", message: "You have successfully updated your email. You can now login with your new email address.", button_label: "Okay", callb: () => {set_update_email(false); new_email_input.value = ""}}})

        } catch(err) {
            //Couldnt reach server
        }
    }
    async function update_password() {
        
        try {
            const current_password_input = document.getElementById("current_password_input") as HTMLInputElement
            if(!current_password_input) return
            const new_password_input = document.getElementById("new_password_input") as HTMLInputElement
            if(!new_password_input) return
            
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/update_password`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "x-access-token": `${sessionStorage.getItem("user") ? sessionStorage.getItem("user") : ""}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({current_password: current_password_input.value, new_password: new_password_input.value})
            })
            
            if(response.status === 200) {
                const response_obj = await response.json() as {success: boolean, message: string}

                if(response_obj.success) {
                    App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully updated your Password!", message: "You have successfully updated your Password.", button_label: "Okay", callb: () => {reset_password_inputs()}}})
                } else {
                    App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: `${response_obj.message}`, message: `We could'nt update what you wanted because: ${response_obj.message}`, button_label: "Okay"}})
                }

            } else {
                App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Something went wrong", message: "For some reason we couldn't delete your account! We are sorry that you have to experience this. Please contact an admin or try again later.", button_label: "Okay"}})
            }
        } catch(err) {
            //COuldnt reach server
        }
    }

    function on_key_up_email_validation(e: any) {
        const get_update_email_button = document.getElementById("update_email_button") as HTMLButtonElement
        if(!get_update_email_button) return

        const valid_email = validate_email(e.target.value)
        if(typeof valid_email === "string") {
            get_update_email_button.classList.remove("active_button")
            get_update_email_button.classList.add("disabled_button")
            return
        }

        get_update_email_button.classList.add("active_button")
        get_update_email_button.classList.remove("disabled_button")
    }
    function on_key_up_password_validation(e: any) {
        const update_password_button = document.getElementById("update_password_button") as HTMLButtonElement

        const current_password_input = document.getElementById("current_password_input") as HTMLInputElement
        if(!current_password_input) {
            update_password_button.classList.remove("active_button")
            update_password_button.classList.add("disabled_button")
            return
        }

        const new_password_input = document.getElementById("new_password_input") as HTMLInputElement
        if(!new_password_input) {
            update_password_button.classList.remove("active_button")
            update_password_button.classList.add("disabled_button")
            return
        }

        const new_password_repeat_input = document.getElementById("new_password_repeat_input") as HTMLInputElement
        if(!new_password_repeat_input) {
            update_password_button.classList.remove("active_button")
            update_password_button.classList.add("disabled_button")
            return
        }


        const valid_current_password = validate_password(current_password_input.value)
        if(typeof valid_current_password === "string") {
            update_password_button.classList.remove("active_button")
            update_password_button.classList.add("disabled_button")
            return
        }
        
        const valid_new_password = validate_password(new_password_input.value)
        if(typeof valid_new_password === "string") {
            update_password_button.classList.remove("active_button")
            update_password_button.classList.add("disabled_button")
            return
        }

        const valid_new_password_repeat = validate_password(new_password_repeat_input.value)
        if(typeof valid_new_password_repeat === "string") {
            update_password_button.classList.remove("active_button")
            update_password_button.classList.add("disabled_button")
            return
        }

        const same_passwords = compare_both_passwords()
        if(!same_passwords) {
            update_password_button.classList.remove("active_button")
            update_password_button.classList.add("disabled_button")
            return
        }

        update_password_button.classList.add("active_button")
        update_password_button.classList.remove("disabled_button")
    }
    function compare_both_passwords() {
        const new_password_input = document.getElementById("new_password_input") as HTMLInputElement
        if(!new_password_input) return
        const new_password_repeat_input = document.getElementById("new_password_repeat_input") as HTMLInputElement
        if(!new_password_repeat_input) return


        if(new_password_input.value === new_password_repeat_input.value) return true
        return false
    }

    function reset_password_inputs() {
        const current_password_input = document.getElementById("current_password_input") as HTMLInputElement
        if(!current_password_input) return
        const new_password_input = document.getElementById("new_password_input") as HTMLInputElement
        if(!new_password_input) return
        const new_password_repeat_input = document.getElementById("new_password_repeat_input") as HTMLInputElement
        if(!new_password_repeat_input) return

        current_password_input.value = ""
        new_password_input.value = ""
        new_password_repeat_input.value = ""
    }
    
    return (

        <>
            <Head>
				<title>{`Spritearc - Account Settings`}</title>
				<meta name="description" content="Edit important account information."/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Spritearc - Account Settings"/>
				<meta property="og:description" content="Edit important account information."/>
				<meta property="og:image" content="/images/wallpaper.png"/>

				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content="Spritearc - Account Settings"/>
				<meta name="twitter:description" content="Edit important account information."/>
				<meta name="twitter:image:src" content="/images/wallpaper.png"/>
            </Head>
        
        
            <div className='account_settings_page'>
                
                <Fixed_app_content_overlay>
                    <div className='fixed_account_settings_container'>
                        <AnimatePresence exitBeforeEnter>
                            { account_delete_warning &&

                                <motion.div key="delete_account_warning" initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, transition: {duration: .2, type: "tween"}}} className='delete_account_confirmation_container'>
                                    <motion.div initial={{opacity: 0, scale: .8}} animate={{opacity: 1, scale: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, scale: .8, transition: {duration: .2, type: "tween"}}}  className='confirmation_content'>
                                        <h1>Delete Account</h1>
                                        <p>Remember, all your packs will be deleted and they wont be recoverable anymore. There is no going back afterwards!</p>
                                        <button onClick={() => {set_account_delete_warning(false); set_delete_account(true)}}>Yes, delete account!</button>
                                        <h4 onClick={() => {set_account_delete_warning(false)}}>No, dont delete account</h4>
                                    </motion.div>

                                    <div onClick={() => {set_account_delete_warning(false)}} className='delete_account_confirmation_background' />
                                </motion.div>
                            }

                            { delete_account &&

                                <motion.div key="delete_account" initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, transition: {duration: .2, type: "tween"}}} className='delete_account_container'>
                                    <motion.div initial={{opacity: 0, scale: .8}} animate={{opacity: 1, scale: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, scale: .8, transition: {duration: .2, type: "tween"}}}  className='delete_account_content'>
                                        <h1>Please enter your password</h1>
                                        <p>To delete your account please enter your account password as your final step.</p>
                                        <input id="account_password_input" type="password" placeholder='Password'/>
                                        <button onClick={delete_account_call}>DELETE ACCOUNT</button>
                                        <h4 onClick={() => {set_delete_account(false)}}>I changed my mind.</h4>
                                    </motion.div>

                                    <div onClick={() => {set_delete_account(false)}} className='delete_account_background' />
                                </motion.div>
                            }

                            { update_email &&

                                <motion.div key="update_email" initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, transition: {duration: .2, type: "tween"}}} className='update_email_container'>
                                    <motion.div initial={{opacity: 0, scale: .8}} animate={{opacity: 1, scale: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, scale: .8, transition: {duration: .2, type: "tween"}}}  className='update_email_content'>
                                        <h1>Please enter your password</h1>
                                        <p>To Verify that you are verified to update your account information, please enter your password!</p>
                                        <input id="account_password_input" type="password" placeholder='Password'/>
                                        <button onClick={update_new_email}>Update Email</button>
                                        <h4 onClick={() => {set_update_email(false)}}>I changed my mind.</h4>
                                    </motion.div>

                                    <div onClick={() => {set_update_email(false)}} className='update_email_background' />
                                </motion.div>
                            }

                        </AnimatePresence>
                    </div>
                </Fixed_app_content_overlay>
                
                

                <div className='content'>
                    <Nav_shadow />
                    <div className='account_settings_header'>
                        <h1>Account Settings</h1>
                        <p>Change important account informations</p>
                    </div>

                    <div className='settings_container'>
                        <div className='settings_navigator'>
                            <Settings_navigation_item name='Account' current_state={settings_state} set_current_state={set_settings_state}/>
                            <Settings_navigation_item name='Email' current_state={settings_state} set_current_state={set_settings_state}/>
                            <Settings_navigation_item name='Password' current_state={settings_state} set_current_state={set_settings_state}/>

                            <div className='deco_container'>
                                <span></span>
                            </div>
                        
                        </div>

                        <div className='settings_content'>
                            { settings_state === "account" && 
                                <div className='account_content'>
                                    <h1>General info</h1>
                                    
                                    <div className='general_info_container'>
                                        <div className='grid_item'>
                                            <div className='item_1'>Username:</div>
                                            <div className='item_2'>{user.username}</div>
                                        </div>

                                        <div className='grid_item'>
                                            <div className='item_1'>Email:</div>
                                            <div className='item_2'>{`${safe_email}`}</div>
                                        </div>

                                        <div className='grid_item'>
                                            <div className='item_1'>Role:</div>
                                            <div className='item_2'>{`${user.role}`}</div>
                                        </div>


                                        <div className='grid_item'>
                                            <div className='item_1'>User since:</div>
                                            <div className='item_2'>{format_date(user.created_at)}</div>
                                        </div>
                                    </div>

                                    <div className='delete_account_container'>
                                            <p onClick={() => {set_account_delete_warning(true)}} className='delete_account'>DELETE ACCOUNT</p>
                                        </div>
                                </div>
                            }

                            { settings_state === "email" && 
                                <div className='email_content'>
                                    <h1>Update Email</h1>

                                    <div className='update_email_container'>
                                        <input onKeyUp={on_key_up_email_validation} id="new_email_input" type="text" placeholder='New Email'/>
                                        <button id="update_email_button" onClick={() => {set_update_email(true)}} className='disabled_button'>Update Email</button>
                                    </div>
                                    
                                </div>
                            }

                            { settings_state === "password" && 
                                <div className='password_content'>
                                    <h1>Update Password</h1>
                                    <input onKeyUp={on_key_up_password_validation} id="current_password_input" type="password" placeholder='Current Password'/>
                                    <input onKeyUp={on_key_up_password_validation} id="new_password_input" type="password" placeholder='New Password'/>
                                    <input onKeyUp={on_key_up_password_validation} id="new_password_repeat_input" type="password" placeholder='New Password Repeat'/>
                                    <button onClick={update_password} id="update_password_button" className='disabled_button'>Update Password</button>
                                    <h4>{`Password needs to be atleast 8 characters long. One uppercase / lowercase and one number. Max. 32 characters`}</h4>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <Footer/>
                
            </div>

        </>
    );
}

export function Settings_navigation_item({name, current_state, set_current_state}: {name: string, current_state: string, set_current_state: React.Dispatch<React.SetStateAction<string>>}) {

    return (
        <div onClick={() => {set_current_state(name.toLowerCase())}} className='settings_navigation_item'>
            <p style={current_state.toLowerCase() === name.toLowerCase() ? {color: "white"} : {}}>{name}</p>
        </div>
    );
}