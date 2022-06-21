import React, {useContext, useEffect, useRef, useState} from 'react';
import { Auth_context_type, Public_user, Server_response } from '../types';
import Footer from '../components/footer';
import Image from "next/image"
import Link from 'next/dist/client/link';
import ProfileIcon from "../public/icons/ProfileIcon.svg"
import AddIcon from "../public/icons/AddIcon.svg"
import LogoutIcon from "../public/icons/LogoutIcon.svg"
import SettingsIcon from "../public/icons/SettingsIcon.svg"
import { Auth_context, USER_DISPATCH_ACTIONS } from '../context/auth_context_provider';
import { useParallax, useRouting } from '../lib/custom_hooks';
import EditIcon from "../public/icons/EditIcon.svg"
import { PopupProviderContext } from '../context/popupProvider';
import MetaGenerator from '../components/MetaGenerator';
import PageContent from '../components/layout/pageContent';
import apiCaller from '../lib/apiCaller';
import NavigateCard from '../components/NavigateCard';

export default function PageRenderer() {
    const Auth: Auth_context_type = useContext(Auth_context)
    if(!Auth.user.auth) return null

    return (
        <>
            <MetaGenerator
				title='Spritearc - Search'
				description='Search pixel art assets and sprites with just one click. You can search by tags to find specific genres.' 
				url='https://Spritearc.com/search'
				imageLinkSecure={`https://${process.env.NEXT_PUBLIC_APP_NAME}.com/images/spritearc_wallpaper.png`}
		    />

            <AccountPage Auth={Auth} user={Auth.user.public_user}/>

            <Footer/>
        </>
    );
}

function AccountPage(props: {Auth: Auth_context_type, user: Public_user}) {
    const popupContext = useContext(PopupProviderContext)
    const Auth = props.Auth
    const user = props.user
    const controller = useRef<null | AbortController>( null )
    const descriptionInputRef = useRef<null | HTMLInputElement>(null)
    const profilePictureRef = useRef<null | HTMLInputElement>(null)
    const profileBannerRef = useRef<null | HTMLInputElement>(null)
    const {push} = useRouting()
    useParallax("profile_banner")

    const logout = async() => {
        controller.current = new AbortController()
        try {
            const response = await apiCaller.logout(controller.current.signal)
            if(!response?.success) return
            Auth.dispatch({type: USER_DISPATCH_ACTIONS.LOGOUT, payload: {auth: false}})
            push('/login')
        } catch (error) {
            
        }
    }

    const setProfileDescription = async(signal: AbortSignal) => {
        const descriptionInput = descriptionInputRef.current
        if(!descriptionInput) return

        try {
            const response = await apiCaller.setProfileDescription(descriptionInput.value, signal)
    
            if(!response?.success) {
                popupContext?.setPopup({
                    success: false,
                    title: "Something went wrong!",
                    message: "Something went wrong while trying to update your description. Please try later or inform an admin.",
                    buttonLabel: "Okay",
                    cancelLabel: "Close window"
                })
                return
            } 
                
            popupContext?.setPopup({
                success: true,
                title: "Success!",
                message: "It might take a little bit to see your changes",
                buttonLabel: "Okay",
                cancelLabel: "Close window"
            })
        } catch(err) {
            //Couldnt update userdescription
        }

    }

    const displayChangeDescriptionPopup = () => {
        popupContext?.setPopup({
            title: "Tell us about yourself!",
            component: (
                <div className='set_description_container'>
                    <input ref={descriptionInputRef} placeholder='Hello Pixel art world' type="text"  className='primary big'/>
                </div>
            ),
            buttonOnClick: setProfileDescription,
            buttonLabel: 'Save',
        })
    }

    useEffect(() => {
        const abortController = new AbortController()

        const profilePictureInput = profilePictureRef.current
        if(!profilePictureInput) return

        profilePictureInput.onchange = async(e: any) => {
            const form = new FormData()
            form.set("file", e.target.files[0])

            try {
                const response = await apiCaller.setProfilePicture(form, abortController.signal)
                if(!response?.success) {
                    popupContext?.setPopup({
                        success: false,
                        title: "Something went wrong!",
                        message: response?.message ?? 'Something went wrong while trying to set your profile picture.',
                        buttonLabel: "Okay",
                        cancelLabel: "Close window"
                    })
                } 

                popupContext?.setPopup({
                    success: true,
                    title: "Successfully changed profile picture!",
                    message: "It might take a little bit to update your profile picture.",
                    buttonLabel: "Okay",
                    cancelLabel: "Close window"
                })
            } catch(err) {
                //Couldnt update profile
            }

            
        }

        return() => {
            abortController.abort()
        }
    }, [popupContext?.setPopup, apiCaller, profilePictureRef])

    useEffect(() => {
        const abortController = new AbortController()

        const profileBannerInput = profileBannerRef.current
        if(!profileBannerInput) return

        profileBannerInput.onchange = async(e: any) => {
            const form = new FormData()
            form.set("file", e.target.files[0])

            try {
                const response = await apiCaller.setProfileBanner(form, abortController.signal)

                if(!response?.success) {
                    popupContext?.setPopup({
                        success: false,
                        title: "Something went wrong!",
                        message: response?.message ?? 'Something went wrong while trying to set your profile banner',
                        buttonLabel: "Okay",
                        cancelLabel: "Close window"
                    })
                    return
                } 

                popupContext?.setPopup({
                    success: true,
                    title: "Successfully changed profile banner!",
                    message: "It might take a little bit to update your profile banner.",
                    buttonLabel: "Okay",
                    cancelLabel: "Close window"
                })

            } catch(err) {
                //Couldnt update profile banner
            }
            
        }
        return(() => {
            abortController.abort()
        })
    }, [popupContext?.setPopup, apiCaller])

    return (
        <PageContent>
            <div className='user_preview_container'>

                <div className='profile_banner_container'>
                    <Image loading='lazy' unoptimized={true}  id="profile_banner" src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_banners/${user.profile_banner}`} alt={`Profile banner for the user ${user.username}`} layout='fill'></Image>
                    <div className='blur' />

                    <div className='profile_banner_hover_container'>
                        <EditIcon/>
                        <input ref={profileBannerRef} type="file" accept="image/png, image/jpeg, image/jpg"/>
                    </div>
                </div>
                
                <div className='portrait_wrapper'>
                    <div className='user_portrait_container'>
                        
                        <div className='portrait'>
                            <Image loading='lazy' unoptimized={true} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${user?.profile_picture}`} alt={`Profile banner for the user ${user?.username}`} layout='fill'></Image>
                        
                            <div className='portrait_hover_container'>
                                <EditIcon/>
                                <input ref={profilePictureRef} type="file" accept="image/png, image/jpeg, image/jpg"/>
                            </div>
                        </div>
                            
                    </div>
                </div>
            </div>

            <div className='user_info_container'>
                <Link href={`/user/${user?.username.toLowerCase()}`} scroll={false}>{user?.username}</Link>

                <div className='user_description_container'>

                    <div className='description_wrapper'>
                        <p className="default">{user.description}</p>
                        
                        <div onClick={displayChangeDescriptionPopup} className='svg_wrapper'>
                            <EditIcon/>
                        </div>
                    </div>
                    
                </div>

            </div>

            <div className='navigation_cards'>
                <NavigateCard label='Profile' description='Visit your public profile and checkout what others will see when visiting your account!' callb={() => {push(`/user/${user.username}`)}} icon={ProfileIcon}/>
                <NavigateCard label='Create Pack' description='Create your own Pixel art pack! Make yourself a name.' callb={() => {push('/create_pack')}}  icon={AddIcon}/>
                <NavigateCard label='Account Settings' description='Change important account informations of your account.' callb={() => {push('/account/settings')}}  icon={SettingsIcon}/>
                <NavigateCard label='Logout' description='Logout from your account.' callb={logout} icon={LogoutIcon}/>
            </div>

        </PageContent>
    );
}

