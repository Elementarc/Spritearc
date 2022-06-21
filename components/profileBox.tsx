import React, { useContext, useEffect, useRef } from 'react';
import { Auth_context, USER_DISPATCH_ACTIONS } from '../context/auth_context_provider';
import { Auth_context_type } from '../types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Navigation_context } from '../context/navigation_context_provider';
import { format_date } from '../lib/date_lib';
import apiCaller from '../lib/apiCaller';
import { PopupProviderContext } from '../context/popupProvider';
import SpriteCredits from './spriteCredits';
import Line from './line';
import useGetUserCredits from '../hooks/useGetUserCredits';

export default function ProfileBox() {
    const Auth: Auth_context_type = useContext(Auth_context)
    const Navigation: any = useContext(Navigation_context)
    const popupProvider = useContext(PopupProviderContext)
    const router = useRouter()
    const abortControllerRef = useRef<AbortController | null>(null)
    const {credits, refetch} = useGetUserCredits()

    const visitPublicAccount = () => {
        router.push(`/user/${user.username.toLowerCase()}`, `/user/${user.username.toLowerCase()}`, {scroll: false})
    }
    const logout = async() => {
        abortControllerRef.current = new AbortController()
        try {
            const response = await apiCaller.logout(abortControllerRef.current.signal)
            if(!response?.success) {
                popupProvider?.setPopup({
                    success: false,
                    title: "Failed!",
                    message: "Something went wrong while trying to log you out. Please try again later",
                    buttonLabel: "Okay"
                })
                return
            }
            Navigation.set_nav_state(false)
            Auth.dispatch({type: USER_DISPATCH_ACTIONS.LOGOUT, payload: {auth: false, callb: () => {router.push("/login", "/login", {scroll: false})}}})
        } catch (error) {
            //Aborted
        }
    }
    
    useEffect(() => {
        return () => {
            if(abortControllerRef.current) abortControllerRef.current.abort()
        };
    }, [abortControllerRef])
    //refetching credits everytime user opens navigation
    useEffect(() => {
        if(Navigation.nav_state) refetch()
    }, [Navigation, refetch])

    if(!popupProvider) return null
    if(!Auth.user.auth) return null
    const user = Auth.user.public_user
    return (
        <>
            <Line display={Navigation.nav_state} opacity={.3}/>
            <div className="profile_box_container">
                
                <div className='portrait_wrapper'>
                    <ProfilePicture imageLink={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${user.profile_picture}`}/>
                </div>

                <motion.div className="user_info">
                    <a className="default" onClick={visitPublicAccount}>{user.username}</a>
                    <p className='user_since_text'>User since: {format_date(new Date(user.created_at))}</p>
                    <div className='credits_wrapper'>
                        <SpriteCredits credits={credits}/>
                    </div>
                    <a onClick={logout} className='small error'>Logout</a>
                </motion.div>
            </div>
            <Line display={Navigation.nav_state} opacity={.3}/>
        </>
    );
}

export function ProfilePicture(props: {imageLink: string}) {
    const router = useRouter()
    const Navigation: any = useContext(Navigation_context)
    const isActive = () => {
        if(router.asPath.toLowerCase().includes("/account")) return "active"
    }
    
    return (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2}}} exit={{opacity: 0, transition: {duration: .2}}} onClick={() => {router.push("/account", "/account", {scroll: false}); Navigation.set_nav_state(false)}} className={`portrait ${isActive()}`}>
            <Image className='profile_picture' loading='lazy' unoptimized={true} src={props.imageLink} layout="fill"/>
        </motion.div>
    );
}



