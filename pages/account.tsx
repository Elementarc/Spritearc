import { GetServerSideProps } from 'next';
import React, {useContext, useEffect} from 'react';
import jwt from 'jsonwebtoken';
import { Public_user } from '../types';
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

export default function Account_page(props: {user: Public_user}) {
    
    const user = props.user
    const App_notification: any = useContext(App_notification_context)
    const router = useRouter()
    function go_to(path: string) {
        router.push(path, path, {scroll: false})
    }
    const Auth: any = useContext(Auth_context)
    
    
    async function logout () {
        const response = await fetch("/user/logout", {method: "POST"})

        if(response.status === 200) {
            Auth.dispatch_user({type: USER_DISPATCH_ACTIONS.LOGOUT, payload: {callb: () => {router.push("/login", "/login", {scroll: false})}}})
        }
    }

    useParallax("profile_banner")

    useEffect(() => {
        const get_profile_upload_input = document.getElementById("input_profile_picture") as HTMLInputElement
       
        get_profile_upload_input.onchange = async(e: any) => {

            const form = new FormData()
            form.set("file", e.target.files[0])

            const response = await fetch("/user/change_profile_image", {
                method: "POST",
                body: form
            })

            if(response.status === 200) {
                App_notification.dispatch_app_notification({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully changed profile picture", message: "It might take a little bit to update your profile picture.", button_label: "Great"}})
            } else {
                App_notification.dispatch_app_notification({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "File to Big!", message: "Please make sure your profile pictures is 1 MB or smaller.", button_label: "Ok"}})
            }
        }
    }, [])

    useEffect(() => {
        const get_profile_upload_input = document.getElementById("input_profile_banner") as HTMLInputElement
        console.log(get_profile_upload_input)
        get_profile_upload_input.onchange = async(e: any) => {
            console.log(e.target.files[0])
            const form = new FormData()
            form.set("file", e.target.files[0])

            const response = await fetch("/user/change_profile_banner", {
                method: "POST",
                body: form
            })

            if(response.status === 200) {
                App_notification.dispatch_app_notification({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully changed profile banner", message: "It might take a little bit to update your profile picture.", button_label: "Great"}})
            } else {
                App_notification.dispatch_app_notification({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "File to Big!", message: "Please make sure your profile pictures is 1 MB or smaller.", button_label: "Ok"}})
            }
        }
    }, [])

    return (
        <div className='account_page'>
            
            <div className='content'>
                <Nav_shadow/>
                <div className='user_preview_container'>

                    <div className='profile_banner_container'>
                        <Image priority={true} id="profile_banner" src={`${process.env.NEXT_PUBLIC_BASE_PATH}/profile_banners/${user.profile_banner}`} alt={`Profile banner for the user ${user.username}`} layout='fill'></Image>
                        <div className='blur' />

                        <div className='profile_banner_hover_container'>
                            <EditIcon/>
                            <input id="input_profile_banner" type="file" accept="image/png, image/jpeg, image/jpg"/>
                        </div>
                    </div>
                    
                    <div className='user_portrait_container'>
                        
                        <div className='portrait'>
                            <Image priority={true} src={`${process.env.NEXT_PUBLIC_BASE_PATH}/profile_pictures/${user.profile_picture}`} alt={`Profile banner for the user ${user.username}`} layout='fill'></Image>
                        
                            <div className='portrait_hover_container'>
                                <EditIcon/>
                                <input id="input_profile_picture" type="file" accept="image/png, image/jpeg, image/jpg"/>
                            </div>
                        </div>
                            
                    </div>
                </div>

                <div className='user_info_container'>
                    <Link href={`/profile?user=${user.username.toLowerCase()}`} scroll={false}>{user.username}</Link>
                    <p>{user.description}</p>
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

                    <div className='card'>

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
