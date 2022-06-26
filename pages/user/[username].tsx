import React, {useState, useEffect, useContext, useMemo, useRef} from 'react';
import Image from "next/image"
import Link from "next/link"
import { Public_user, Server_response_public_user } from '../../types';
import Footer from '../../components/footer';
import { useParallax } from '../../lib/custom_hooks';
import Twitter_logo from "../../public/logos/twitter_logo.svg"
import { GetServerSideProps } from 'next'
import http from "http"
import https from "https"
import HeartIcon from "../../public/icons/HeartIcon.svg"
import HeartBrokenIcon from "../../public/icons/HeartBrokenIcon.svg"
import { AnimatePresence, motion } from 'framer-motion';
import PackPreviewsSection from '../../components/packPreviewsSection';
import PageContent from '../../components/layout/pageContent';
import MetaGenerator from '../../components/MetaGenerator';
import { PopupProviderContext } from '../../context/popupProvider';
import { AccountContext } from '../../context/accountContextProvider';


export default function PageRenderer(props: {public_user: Public_user}) {
    const publicUser = props.public_user

    return (
        <>
            <MetaGenerator title={`${publicUser.username}`} description={`${publicUser.description}`} url={`https://Spritearc.com/user/${publicUser.username}`} imageLinkSecure={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${publicUser.profile_picture}`}/>
            <UserProfilePage publicUser={publicUser}/>
            <Footer/>
        </>
    );
}

function UserProfilePage(props: {publicUser: Public_user}) {
    const publicUser = props.publicUser
    const [followers_count, set_followers_count] = useState(publicUser.followers_count)
    const [following_count, set_following_count] = useState(publicUser.following_count)

    useParallax("profile_banner")
    
    return (
        <>
            <PageContent>
                <User_representation public_user={publicUser} followers_count={followers_count} following_count={following_count}  set_followers_count={set_followers_count} set_following_count={set_following_count}/>
                <User_stats followers_count={followers_count} following_count={following_count}/>

                <div className='user_packs_container'>
                    <PackPreviewsSection label={`Packs created by '${publicUser?.username}'`} api={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user_packs/${publicUser?.username}?`}/>
                </div>
            </PageContent>
        </>
    );
}

function User_stats(props: {followers_count: number, following_count: number}) {
    const popupContext = useContext(PopupProviderContext)


    function Feature_coming() {
        popupContext?.setPopup({
            success: true,
            title: "Coming Soon!",
            message: "This feature is coming soon!",
            buttonLabel: "Okay",
            cancelLabel: "Close window"
        })
    }

    return(
        <div className='user_stats_container'>

            <div className='stat_wrapper'>

                <div onClick={Feature_coming} className='stat_container'>
                    <p className='counter'>{props.following_count}</p>
                    <p>Following</p>
                </div>

                <div onClick={Feature_coming} className='stat_container'>
                    <p className='counter'>{props.followers_count}</p>
                    <p>Followers</p>
                </div>
                
            </div>

        </div>
    )
}

function User_representation(props: {public_user: Public_user, followers_count: number, following_count: number, set_followers_count: React.Dispatch<React.SetStateAction<number>>, set_following_count: React.Dispatch<React.SetStateAction<number>>,}) {
    const account = useContext(AccountContext)
    const popupContext = useContext(PopupProviderContext)
    const public_user = props.public_user
    const [visitor_has_followed, set_visitor_has_followed] = useState<null | boolean>(null)

    async function follow_user() {
        if(!account?.publicUser) {
            popupContext?.setPopup({
                success: false,
                title: "Please Login!",
                message: "You have to login into your account to be able to follow people!",
                buttonLabel: "Okay",
                cancelLabel: "Close window"
            })
            return
        } 

        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/follow/${public_user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials:"include"
            })
            
            if(response.status === 200) {
                props.set_followers_count(props.followers_count + 1) 
                set_visitor_has_followed(true)
            } 

        } catch(err) {
            //
        }
        
    }
   
    async function unfollow_user() {

        try {
            if(!account?.publicUser) {
                popupContext?.setPopup({
                    success: true,
                    title: "Please Login!",
                    message: "You have to login into your account to be able to unfollow people!",
                    buttonLabel: "Okay",
                    cancelLabel: "Close window"
                })
                return
            }
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/unfollow/${public_user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials:"include",
            })
            
            if(response.status === 200) {
                set_visitor_has_followed(false)
                props.set_followers_count(props.followers_count - 1)
            }

        } catch(err) {
            
        }
        
    }

    useEffect(() => {
        if(public_user.username.toLowerCase() === account?.publicUser?.username.toLowerCase()) return
        const controller = new AbortController()

        if(account?.publicUser) {
        
            async function has_visitor_followed() {

                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/is_following/${public_user._id}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        credentials:"include",
                        signal: controller.signal,
                    })
        
                    const response_obj = await response.json()
                    
                    set_visitor_has_followed(response_obj?.following ? response_obj.following : false)
                } catch(err) {
                    //
                }
                
            }
            has_visitor_followed()

        } else if(!account?.publicUser) {
            return set_visitor_has_followed(false)
        }
        
        return(() => {
            controller.abort()
        })
    }, [account, public_user])

    return (
        <div className='user_preview_container'>

            <div className='image_container'>
                <Image loading='lazy' unoptimized={true} id="profile_banner" src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_banners/${public_user.profile_banner}`} alt={`Profile banner for the user ${public_user.username}`} layout='fill'></Image>
                <div className='blur' />
            </div>
            
            <div className='header'>

                <div className='user_portrait_container'>

                    <div className='portrait'>
                        
                        <Image loading='lazy' unoptimized={true} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${public_user.profile_picture}`} alt={`Profile banner for the user ${public_user.username}`} layout='fill'></Image>

                        <AnimatePresence exitBeforeEnter>
                            {visitor_has_followed === false &&
                                <motion.div key={"follow"} initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 8}} onClick={follow_user} className='follow_container'>
                                    <HeartIcon/>
                                    <p>Follow</p>
                                </motion.div>
                            }
                            
                            {visitor_has_followed === true &&
                                <motion.div key={"unfollow"} initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 8}} onClick={unfollow_user} className='unfollow_container'>
                                    <HeartBrokenIcon/>
                                    <p>Unfollow</p>
                                </motion.div>
                            }
                        </AnimatePresence>
                    </div>

                </div>

                <div className='user_info_container'>

                    <div className='username_container'>
                        <Link href={`/user/${public_user.username.toLowerCase()}`} scroll={false}>{`${public_user?.username}`}</Link>
                    </div>
                    
                    <p>{`${public_user?.description}`}</p>

                    
                </div>
            </div>

        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    try {
        const agent = process.env.NEXT_PUBLIC_ENV === "development" ? new http.Agent() : new https.Agent({
            rejectUnauthorized: false
        })
        const username = context?.params?.username
        if(!username) throw new Error("No user param")

        const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/get_public_user/${username}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // @ts-ignore: Unreachable code error
            agent
        })

        const response_obj = await response.json() as Server_response_public_user

    
        if(!response_obj.success) return {redirect: {destination: "/browse", permanent: false}} 
    
        if(response_obj.public_user.banned === true) return {redirect: {destination: "/browse", permanent: false}}
        
        return {
            props: {
                public_user: response_obj.public_user
            }
        }
        
    } catch (err) {
        return {redirect: {destination: "/browse", permanent: false}} 
    }
}






