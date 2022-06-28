import React, { useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { format_date } from '../lib/date_lib';
import apiCaller from '../lib/apiCaller';
import { PopupProviderContext } from '../context/popupProvider';
import SpriteCredits from './spriteCredits';
import Line from './line';
import { useRouting } from '../lib/custom_hooks';
import { PublicUser } from '../types';
import useGetUserCredits from '../hooks/useGetUserCredits';
import useStoreNav from '../stores/navigation';

export default function ProfileBox({publicUser, logout}: {publicUser: PublicUser, logout: (signal: AbortSignal) => Promise<any>}) {
    const navigation = useStoreNav()
    const popupProvider = useContext(PopupProviderContext)
    const router = useRouter()
    const {push} = useRouting()
    const abortControllerRef = useRef<AbortController | null>(null)

    const visitPublicAccount = () => {
        router.push(`/user/${publicUser?.username.toLowerCase()}`, `/user/${publicUser?.username.toLowerCase()}`, {scroll: false})
    }

    const logoutFunc = async() => {
        abortControllerRef.current = new AbortController()
        const response = await logout(abortControllerRef.current.signal)
        navigation.closeNav()
        push("/login")
    }
    
    useEffect(() => {
        return () => {
            if(abortControllerRef.current) abortControllerRef.current.abort()
        };
    }, [abortControllerRef])

    if(!popupProvider) return null

    return (
        <>
            <Line display={navigation.navState} opacity={.3}/>
            <div className="profile_box_container">
                
                <div className='portrait_wrapper'>
                    <ProfilePicture imageLink={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${publicUser.profile_picture}`}/>
                </div>

                <motion.div className="user_info">
                    <a className="default" onClick={visitPublicAccount}>{publicUser.username}</a>
                    <p className='user_since_text'>User since: {format_date(new Date(publicUser.created_at))}</p>
                    <div className='credits_wrapper'>
                        <SpriteCredits credits={250}/>
                    </div>
                    <a onClick={logoutFunc} className='small error'>Logout</a>
                </motion.div>
            </div>
            <Line display={navigation.navState} opacity={.3}/>
        </>
    );
}

export function ProfilePicture(props: {imageLink: string}) {
    const router = useRouter()
    const navigation = useStoreNav()
    const isActive = () => {
        if(router.asPath.toLowerCase().includes("/account")) return "active"
        else ""
    }
    
    return (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2}}} exit={{opacity: 0, transition: {duration: .2}}} onClick={() => {router.push("/account", "/account", {scroll: false}); navigation.closeNav()}} className={`portrait ${isActive()}`}>
            <Image className='profile_picture' loading='lazy' unoptimized={true} src={props.imageLink} layout="fill"/>
        </motion.div>
    );
}


