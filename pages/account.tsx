import { GetServerSideProps } from 'next';
import React, {useContext, useEffect, useState} from 'react';
import jwt from 'jsonwebtoken';
import { App_notification_context_type, Public_user } from '../types';
import Footer from '../components/footer';
import Image from "next/image"
import Link from 'next/dist/client/link';
import ProfileIcon from "../public/icons/ProfileIcon.svg"
import AddIcon from "../public/icons/AddIcon.svg"
import LogoutIcon from "../public/icons/LogoutIcon.svg"
import SettingsIcon from "../public/icons/SettingsIcon.svg"
import { useRouter } from 'next/router';
import { USER_DISPATCH_ACTIONS } from '../context/auth_context_provider';
import { Auth_context } from '../context/auth_context_provider';
import { Nav_shadow } from '../components/navigation';
import { useParallax } from '../lib/custom_hooks';
import EditIcon from "../public/icons/EditIcon.svg"
import { App_notification_context } from '../context/app_notification_context_provider';
import { NOTIFICATION_ACTIONS } from '../context/app_notification_context_provider';
import Fixed_app_content_overlay from '../components/fixed_app_content_overlay';
import { AnimatePresence, motion } from 'framer-motion';
import { validate_user_description } from '../spritearc_lib/validate_lib';
import Head from 'next/head';

export default function Account_page(props: {user: Public_user}) {
    const [update_about_state, set_update_about_state] = useState(false)
    const user = props.user
    const App_notification: App_notification_context_type = useContext(App_notification_context)
    const router = useRouter()
    const Auth: any = useContext(Auth_context)
    const controller = new AbortController()

    function go_to(path: string) {
        router.push(path, path, {scroll: false})
    }
    
    async function logout () {
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/logout`, {
                method: "POST",
                signal: controller.signal,
                credentials: "include",
            })
    
            if(response.status === 200) {
                
                Auth.dispatch({type: USER_DISPATCH_ACTIONS.LOGOUT, payload: {callb: () => {router.push("/login", "/login", {scroll: false})}}})
            }

        } catch(err) {
            //Couldnt logout
        }
        
    }

    useParallax("profile_banner")

    useEffect(() => {
        
        const get_profile_upload_input = document.getElementById("input_profile_picture") as HTMLInputElement
        get_profile_upload_input.onchange = async(e: any) => {
            const form = new FormData()
            form.set("file", e.target.files[0])

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/update_profile_image`, {
                    method: "POST",
                    credentials: "include",
                    body: form
                })
    
                if(response.status === 200) {
                    App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully changed profile picture", message: "It might take a little bit to update your profile picture.", button_label: "Great"}})
                } else {
                    App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "File to Big!", message: "Please make sure your profile pictures is 1 MB or smaller.", button_label: "Ok"}})
                }
            } catch(err) {
                //Couldnt update profile
            }

            
        }
    }, [App_notification])

    useEffect(() => {
        const controller = new AbortController()
        const get_profile_upload_input = document.getElementById("input_profile_banner") as HTMLInputElement

        get_profile_upload_input.onchange = async(e: any) => {
            const form = new FormData()
            form.set("file", e.target.files[0])

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/update_profile_banner`, {
                    method: "POST",
                    credentials: "include",
                    body: form
                })
    
                if(response.status === 200) {
                    App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully changed profile banner", message: "It might take a little bit to update your profile picture.", button_label: "Great"}})
                } else {
                    App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "File to Big!", message: "Please make sure your profile pictures is 1 MB or smaller.", button_label: "Ok"}})
                }
            } catch(err) {
                //Couldnt update profile banner
            }
            
        }

        return(() => {
            controller.abort()
        })
    }, [App_notification])

    function event_valid_user_description(e: any) {
        const valid_description = validate_user_description(e.target.value)
        const get_description_error_message = document.getElementById("update_user_description_error_message") as HTMLParagraphElement
        
        if(typeof valid_description === "string") {
            get_description_error_message.innerText = valid_description

        } else {
            get_description_error_message.innerText = ""
        }
    }

    async function update_user_description() {
        const get_description = document.getElementById("user_description_input") as HTMLInputElement

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/update_user_description`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({description: get_description.value})
            })
    
            if(response.status === 200) {
                App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully updated description", message: "It might take a little bit to see your changes", button_label: "Great", callb: () => {set_update_about_state(false)}}})
    
            } else {
                App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Something went wrong!", message: "Something went wrong while trying to update your description. Please try later or inform an admin.", button_label: "Ok", callb: () => {set_update_about_state(false)}}})
    
            }
        } catch(err) {
            //Couldnt update userdescription
        }

    }
    return (
        <>
            <Head>
				<title>{`Spritearc - Account`}</title>
				<meta name="description" content="Navigate through your account. Edit your account settings or visit your public profile."/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Spritearc - Account"/>
				<meta property="og:description" content="Navigate through your account. Edit your account settings or visit your public profile."/>
				<meta property="og:image" content="/images/wallpaper.png"/>

				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content="Spritearc - Account"/>
				<meta name="twitter:description" content="Navigate through your account. Edit your account settings or visit your public profile."/>
				<meta name="twitter:image" content="/images/wallpaper.png"/>
            </Head>
        
            <div className='account_page'>
                
                <AnimatePresence>
                    {update_about_state &&
                        
                        <Fixed_app_content_overlay>
                            <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: 0.1}}} exit={{opacity: 0, transition: {duration: 0.1}}}  className='update_user_description_container'>

                                <motion.div initial={{scale: .8}} animate={{scale: 1, transition: {duration: 0.1}}} exit={{scale: .8, transition: {duration: 0.1}}} className='update_user_description_box'>
                                    <h1>Tell us about yourself</h1>
                                    <input onKeyUp={event_valid_user_description} id="user_description_input" type="text" name="" placeholder={`${user.description}`}/>
                                    <p className='update_user_description_error_message' id="update_user_description_error_message"></p>
                                    <button onClick={update_user_description}>Ok</button>
                                </motion.div>
                                
                                <div onClick={() => {set_update_about_state(false)}} className='update_user_description_background' />
                            </motion.div>
                        </Fixed_app_content_overlay>

                    }
                </AnimatePresence>

                <div className='content'>
                    <Nav_shadow/>
                    <div className='user_preview_container'>

                        <div className='profile_banner_container'>
                            <Image priority={true} id="profile_banner" src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_banners/${user.profile_banner}`} alt={`Profile banner for the user ${user.username}`} layout='fill'></Image>
                            <div className='blur' />

                            <div className='profile_banner_hover_container'>
                                <EditIcon/>
                                <input id="input_profile_banner" type="file" accept="image/png, image/jpeg, image/jpg"/>
                            </div>
                        </div>
                        
                        <div className='user_portrait_container'>
                            
                            <div className='portrait'>
                                <Image priority={true} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${user.profile_picture}`} alt={`Profile banner for the user ${user.username}`} layout='fill'></Image>
                            
                                <div className='portrait_hover_container'>
                                    <EditIcon/>
                                    <input id="input_profile_picture" type="file" accept="image/png, image/jpeg, image/jpg"/>
                                </div>
                            </div>
                                
                        </div>
                    </div>

                    <div className='user_info_container'>
                        <Link href={`/profile?user=${user.username.toLowerCase()}`} scroll={false}>{user.username}</Link>

                        <div className='user_description_container'>

                            <div className='description_wrapper'>
                                <p>{user.description}</p>
                                
                                <div className='svg_wrapper' onClick={() => {set_update_about_state(true)}} >
                                    <EditIcon/>
                                </div>
                            </div>
                            
                            
                            
                        </div>

                    </div>

                    <div className='user_navigator_cards'>

                        <div onClick={() => go_to(`/profile?user=${user.username}`)} className='card'>

                            <div className='icon_container'>

                                <div className='icon_background'>
                                    <ProfileIcon className="icon"/>
                                </div>

                            </div>

                            <h1>Profile</h1>
                            <p>Visit your public profile and checkout what others will see when visiting your account!</p>
                        </div>

                        <div onClick={() => go_to(`/create_pack`)} className='card'>

                            <div className='icon_container'>

                                <div className='icon_background'>
                                    <AddIcon className="icon"/>
                                </div>

                            </div>

                            <h1>Create Pack</h1>
                            <p>Create your own Pixelart pack! Make yourself a name.</p>
                        </div>

                        <div onClick={() => go_to(`/account/settings`)} className='card'>

                            <div className='icon_container'>

                                <div className='icon_background'>
                                    <SettingsIcon className="icon"/>
                                </div>

                            </div>

                            <h1>Account Settings</h1>
                            <p>Change important account informations of your account. </p>
                        </div>

                        <div onClick={() => logout()} className='card'>

                            <div className='icon_container'>

                                <div style={{transform: "rotate(180deg)"}} className='icon_background'>
                                    <LogoutIcon className="icon"/>
                                </div>

                            </div>

                            <h1>Logout</h1>
                            <p>Logout from your account.</p>
                        </div>

                    </div>


                </div>

                <Footer />
            </ div>
        </>
    );
}


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
