import React, {useEffect, useState, useContext, useRef} from 'react';
import { App_notification_context_type, Auth_context_type, Server_response, Server_response_email, Public_user, Server_response_credits } from '../../types';
import Footer from '../../components/footer';
import { format_date } from '../../lib/date_lib';
import { App_notification_context, NOTIFICATION_ACTIONS } from '../../context/app_notification_context_provider';
import Fixed_app_content_overlay from '../../components/fixed_app_content_overlay';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Auth_context, USER_DISPATCH_ACTIONS } from '../../context/auth_context_provider';
import { validate_email, validate_password, validate_paypal_donation_link } from '../../spritearc_lib/validate_lib';
import Head from 'next/head';
import { Nav_shadow } from '../../components/navigation';
import ProfileIcon from "../../public/icons/ProfileIcon.svg"
import KeyIcon from "../../public/icons/KeyIcon.svg"
import EmailIcon from "../../public/icons/EmailIcon.svg"
import GroupIcon from "../../public/icons/GroupIcon.svg"
import DonationIcon from "../../public/icons/DonationIcon.svg"
import Image from 'next/image';
import Protected_route from '../../components/protected_router';
import Sprite_credits from '../../components/sprite_credits';
import useGetUserCredits from '../../hooks/useGetUserCredits';
import useGetUserSafeEmail from '../../hooks/useGetUserSafeEmail';

export default function Account_settings_handler() {

    return(
        <Protected_route>
            <Account_settings_page/>
        </Protected_route>
    )
}
export function Account_settings_page() {
    
    const App_notification: App_notification_context_type = useContext(App_notification_context)
    const Auth: Auth_context_type = useContext(Auth_context)
    const [account_delete_warning, set_account_delete_warning] = useState(false)
    const [delete_account, set_delete_account] = useState(false)
    const [settings_state, set_settings_state] = useState("account")
    const router = useRouter()
    const public_user = Auth.user.public_user
    const safe_email = useGetUserSafeEmail()

    async function submit_account_deletion() {
        try {
            const password_input = document.getElementById("account_password_input") as HTMLInputElement
            if(!password_input) return

            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/delete_account`, {
                method: "POST",
                credentials: "include",
                headers: {
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

    return (

        <>
            <Head>
				<title>{`Spritearc - Account Settings`}</title>
				<meta name="description" content="Edit important account information."/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Spritearc - Account Settings"/>
				<meta property="og:description" content="Edit important account information."/>
				<meta property="og:image" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>

				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content="Spritearc - Account Settings"/>
				<meta name="twitter:description" content="Edit important account information."/>
                <meta name="twitter:image:src" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>
            </Head>
        
        
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
                                    <button onClick={submit_account_deletion}>DELETE ACCOUNT</button>
                                    <h4 onClick={() => {set_delete_account(false)}}>I changed my mind.</h4>
                                </motion.div>

                                <div onClick={() => {set_delete_account(false)}} className='delete_account_background' />
                            </motion.div>
                        }

                    </AnimatePresence>
                </div>
            </Fixed_app_content_overlay>
            

            <div className='account_settings_content'>
                <Nav_shadow />

                
                <div className='account_settings_navigation'>

                    <div className='account_navigation_items_container'>
                    
                        <Account_navigation_item state="account" icon={ProfileIcon} current_state={settings_state} set_current_state={set_settings_state} />
                        <Account_navigation_item state="email" icon={EmailIcon} current_state={settings_state} set_current_state={set_settings_state} />
                        <Account_navigation_item state="password"icon={KeyIcon} current_state={settings_state} set_current_state={set_settings_state} />
                        <Account_navigation_item state="socials" icon={GroupIcon} current_state={settings_state} set_current_state={set_settings_state} />
                        <Account_navigation_item state="donation"icon={DonationIcon} current_state={settings_state} set_current_state={set_settings_state} />

                    </div>

                </div>
                

                <div className='account_content'>
                    {settings_state === "account" &&
                        <Account_informations set_account_delete_warning={set_account_delete_warning} public_user={public_user} App_notification={App_notification} safe_email={safe_email}/>
                    }

                    {settings_state === "email" &&
                        <Email_settings App_notification={App_notification}/>
                    }
                    
                    {settings_state === "password" &&
                        <Password_settings App_notification={App_notification}/>
                    }

                    {settings_state === "socials" &&
                        <Social_settings public_user={public_user} App_notification={App_notification}/>
                    }

                    {settings_state === "donation" &&
                        <Donation_settings public_user={public_user} App_notification={App_notification}/>
                    }
                </div>

                <div className='account_background_blob_container'>
                    <Image loading='lazy' unoptimized={true} src={"/blobs/blob_3.svg"} layout="fill"  alt="Big wave blob"></Image>
                </div>
            </div>
            <Footer/>

        </>
    );
}

export function Account_navigation_item(props: {state: string, icon: any, current_state: string, set_current_state: React.Dispatch<React.SetStateAction<string>>}) {
    const Icon = props.icon
    const state = props.state
    const current_state = props.current_state
    const set_current_state = props.set_current_state

    return(
        <div onClick={() => {set_current_state(state)}} className={`${state.toLowerCase() === current_state.toLowerCase() ? "account_navigation_item_active" : "account_navigation_item"}`}>
            <Icon/>
        </div>
    )
}

export function Account_informations(props: {set_account_delete_warning: React.Dispatch<React.SetStateAction<boolean>>, public_user: Public_user, safe_email: string | null | undefined, App_notification: App_notification_context_type}) {
    const public_user = props.public_user
    const credits = useGetUserCredits()
    const safe_email = props.safe_email
    const set_account_delete_warning = props.set_account_delete_warning

    
    return(
        <div className='account_informations_container'>
            <div className='header_content'>
                <h1>Account Informations</h1>
                <p>Here you can find general informations about your account!</p>
            </div>

            <div className='informations_grid_container'>

                <div className='grid_item'>
                    <p className='grid_property'>Username:</p>
                    <p className='grid_value'>{public_user?.username}</p>
                </div>

                <div className='grid_item'>
                    <p className='grid_property'>Email:</p>
                    <p className='grid_value'>{safe_email ? safe_email : "undefined"}</p>
                </div>

                <div className='grid_item'>
                    <p className='grid_property'>Role:</p>
                    <p className='grid_value'>{public_user?.role}</p>
                </div>

                <div className='grid_item'>
                    <p className='grid_property'>User since:</p>
                    <p className='grid_value'>{format_date(public_user?.created_at)}</p>
                </div>
            </div>

            <p className='delete_account_text' onClick={() => {set_account_delete_warning(true)}}>DELETE YOUR ACCOUNT</p>
        </div>
    )
}
export function Email_settings(props: {App_notification: App_notification_context_type}) {
    const refs = useRef<any>([])
    const App_notification = props.App_notification

    function disable_button(state: boolean) {
        if(state === true) {
            refs.current["update_email_button"].classList.add("disabled_button")
            refs.current["update_email_button"].classList.remove("active_button")
        } else {
            refs.current["update_email_button"].classList.add("active_button")
            refs.current["update_email_button"].classList.remove("disabled_button")
        }
    }

    function on_key_up_email_validation(e: any) {

        const valid_email = validate_email(refs.current["new_email"].value)
        if(typeof valid_email === "string") {
            disable_button(true)
        } else {
            disable_button(false)
        }

    }

    
    async function submit_new_email() {
        const valid_new_email = validate_email(refs.current["new_email"].value)
        if(typeof valid_new_email === "string") {
            disable_button(true)
        } else {
            disable_button(false)
        }

        try {
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/update_email`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({new_email: refs.current["new_email"].value, password: refs.current["current_password"].value})
            })
            
            const response_obj = await response.json() as Server_response
            
            if(response.status !== 200) return App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Something went wrong", message: response_obj.message, button_label: "Okay", callb: () => {refs.current["new_email"].value = ""; refs.current["current_password"].value = "";disable_button(true)}}})
            
            if(!response_obj.success) return App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Email is already in use!", message: "Please choose an email that is not in use! Make sure that you are the owner of that email address!", button_label: "Okay", callb: () => {refs.current["new_email"].value = ""; refs.current["current_password"].value = ""; disable_button(true)}}})
            App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully updated your email!", message: "You have successfully updated your email. You can now login with your new email address.", button_label: "Okay", callb: () => {refs.current["new_email"].value = ""; refs.current["current_password"].value = ""; disable_button(true)}}})

        } catch(err) {
            //Couldnt reach server
        }
    }


    return(
        <div className='email_settings_container'>
            <div className='header_content'>
                <h1>Update Your Email</h1>
                <p>Here you can update your current email address to a new one!</p>
            </div>

            <input ref={(el) => {refs.current["current_password"] = el}} type="password" placeholder='Current Password'/>
            <input ref={(el) => {refs.current["new_email"] = el}} onKeyUp={on_key_up_email_validation} onChange={on_key_up_email_validation} id="new_email_input" type="text" placeholder='New Email'/>
            <button ref={(el) => refs.current["update_email_button"] = el} id="update_email_button" onClick={submit_new_email} className='disabled_button'>Update Email</button>
        </div>
    )
}
export function Password_settings(props: {App_notification: App_notification_context_type}) {
    const refs = useRef<any>([])
    const App_notification = props.App_notification

    function disable_button(state: boolean) {
        if(state === true) {
            refs.current["update_password_button"].classList.add("disabled_button")
            refs.current["update_password_button"].classList.remove("active_button")
        } else {
            refs.current["update_password_button"].classList.add("active_button")
            refs.current["update_password_button"].classList.remove("disabled_button")
        }
    }
    function reset_inputs() {
        refs.current["current_password"].value = ""
        refs.current["new_password"].value = ""
        refs.current["new_password_repeat"].value = ""
    }
    function validate_both_passwords(): boolean | string {
        disable_button(true)
        const current_password = refs.current["current_password"].value
        const new_password = refs.current["new_password"].value
        const new_password_repeat = refs.current["new_password_repeat"].value

        if(new_password !== new_password_repeat) return "Passwords do not match!"

        const valid_new_password = validate_password(new_password)
        if(typeof valid_new_password === "string") {
            return valid_new_password
            
        } else {
            disable_button(false)
            return true
        }
    }

    async function submit_new_password() {
        const valid_passwords = validate_both_passwords()

        if(typeof valid_passwords === "string") {
            disable_button(true)
        } else {
            disable_button(false)
        }

        try {
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/update_password`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({current_password: refs.current["current_password"].value, new_password: refs.current["new_password"].value})
            })
            
            const response_obj = await response.json() as {success: boolean, message: string}

            if(response_obj.success) {
                App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully updated your Password!", message: "You have successfully updated your Password.", button_label: "Okay", callb: () => {reset_inputs(); disable_button(true)}}})
            } else {
                App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: `${response_obj.message}`, message: `We could'nt update what you wanted because: ${response_obj.message}`, button_label: "Okay", callb: () => {reset_inputs(); disable_button(true)}}})
            }

        } catch(err) {
            //COuldnt reach server
        }
    }

    return(
        <div className='password_settings_container'>
            <div className='header_content'>
                <h1>Update Your Password</h1>
                <p>Here you can set a new password!</p>
            </div>

            <input ref={(el) => {refs.current["current_password"] = el}} type="password" placeholder='Current Password'/>
            <input ref={(el) => {refs.current["new_password"] = el}} onChange={validate_both_passwords} type="password" placeholder='New Password'/>
            <input ref={(el) => {refs.current["new_password_repeat"] = el}} onChange={validate_both_passwords} type="password" placeholder='New Password Repeat'/>
            <button ref={(el) => refs.current["update_password_button"] = el} onClick={submit_new_password} className='disabled_button'>Update Password</button>
        </div>
    )
}
export function Social_settings(props: {public_user: Public_user, App_notification: App_notification_context_type, }) {
    const refs = useRef<any>([])
    const public_user = props.public_user
    const App_notification = props.App_notification

    async function submit_updated_socials() {
        try {
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/update_socials`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    instagram: refs.current["instagram_input"].value,
                    twitter: refs.current["twitter_input"].value,
                    artstation: refs.current["artstation_input"].value,
                })
            })
            
            if(response.status === 200) {
                const response_obj = await response.json() as {success: boolean, message: string}

                if(response_obj.success) {
                    App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully updated your Socials!", message: "You have successfully updated your Socials.", button_label: "Okay"}})
                } else {
                    App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: `We could not update your socials`, message: `We could'nt update what you wanted because: ${response_obj.message}`, button_label: "Okay"}})
                }

            } else {
                App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Something went wrong", message: "For some reason we could not update your social inputs! Please contact an admin.", button_label: "Okay"}})
            }
        } catch(err) {
            //COuldnt reach server
        } 
    }

    return(
        <div className='social_settings_container'>
            <div className='header_content'>
                <h1>Update Your Socials</h1>
                <p>Here you can link your social medias!</p>
            </div>

            <div className='socials_content'>
                <div className='social_flex'>
                    <p>www.Instagram.com/</p>
                    <input ref={(el) => {refs.current["instagram_input"] = el}} type="text" defaultValue={public_user?.socials?.instagram.length > 0 ? public_user?.socials?.instagram : ""} placeholder='Account'/>
                </div>

                <div className='social_flex'>
                    <p>www.Twitter.com/</p>
                    <input ref={(el) => {refs.current["twitter_input"] = el}} type="text" defaultValue={public_user?.socials?.twitter.length > 0 ? public_user?.socials?.twitter : ""} placeholder='Account'/>
                </div>

                <div className='social_flex'>
                    <p>www.Artstation.com/</p>
                    <input ref={(el) => {refs.current["artstation_input"] = el}} type="text" defaultValue={public_user?.socials?.artstation.length > 0 ? public_user?.socials?.artstation : ""} placeholder='Account'/>
                </div>
                
                <button onClick={submit_updated_socials}>Save Changes</button>
            </div>
            
        </div>
    )
}
export function Donation_settings(props: {public_user: Public_user, App_notification: App_notification_context_type, }) {
    const refs = useRef<any>([])
    const public_user = props.public_user
    const App_notification = props.App_notification

    function disable_button(state: boolean) {
        if(state === true) {
            refs.current["update_donation_link_button"].classList.add("disabled_button")
            refs.current["update_donation_link_button"].classList.remove("active_button")
        } else {
            refs.current["update_donation_link_button"].classList.add("active_button")
            refs.current["update_donation_link_button"].classList.remove("disabled_button")
        }
    }
    
    function on_key_up_donation_link_validation() {

        const valid_donation_link = validate_paypal_donation_link(refs.current["donation_link"].value)
        if(typeof valid_donation_link === "string") {
            disable_button(true)
        } else {
            disable_button(false)
        }

    }

    async function submit_donation_link() {
        const valid_donation_link = validate_paypal_donation_link(refs.current["donation_link"].value)
        if(typeof valid_donation_link === "string") {
            disable_button(true)
        } else {
            disable_button(false)
        }

        try {
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/update_donation_link`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({donation_link: refs.current["donation_link"].value, password: refs.current["current_password"].value})
            })
            
            const response_obj = await response.json() as Server_response
            
            if(response.status !== 200) return App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Something went wrong", message: response_obj.message, button_label: "Okay", callb: () => {refs.current["donation_link"].value = ""; refs.current["current_password"].value = "";disable_button(true)}}})
            
            if(!response_obj.success) return App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Email is already in use!", message: "Please choose an email that is not in use! Make sure that you are the owner of that email address!", button_label: "Okay", callb: () => {refs.current["donation_link"].value = ""; refs.current["current_password"].value = ""; disable_button(true)}}})
            App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Success!", message: "You have successfully updated your donation link.", button_label: "Okay", callb: () => {refs.current["donation_link"].value = ""; refs.current["current_password"].value = ""; disable_button(true)}}})

        } catch(err) {
            //Couldnt reach server
        }
    }

    return(
        <div className='donation_settings_container'>
            <div className='header_content'>
                <h1>Update Your Donation Link</h1>
                <p>Here you can add your <a href='https://www.paypal.com/donate/buttons' rel="noreferrer" target={"_blank"}>Paypal donation</a> link to your account. Make sure to keep it up to date, so people can tip you!</p>
            </div>

            <input ref={(el) => {refs.current["current_password"] = el}} type="password" placeholder='Current Password'/>
            <input ref={(el) => {refs.current["donation_link"] = el}} onKeyUp={on_key_up_donation_link_validation} onChange={on_key_up_donation_link_validation} type="text" defaultValue={public_user?.paypal_donation_link ? `${public_user.paypal_donation_link}` : ""} placeholder='Donation Link'/>
            <button onClick={submit_donation_link} ref={(el) => refs.current["update_donation_link_button"] = el} className='disabled_button'>Save Donation Link</button>
        </div>
    )
}