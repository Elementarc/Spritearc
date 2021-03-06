import React, {useState, useEffect, useContext, useMemo, useRef} from 'react';
import Image from "next/image"
import Link from "next/link"
import { App_notification_context_type, Auth_context_type, Public_user, Server_response, Server_response_public_user } from '../../types';
import Footer from '../../components/footer';
import { useParallax } from '../../lib/custom_hooks';
import { Nav_shadow } from '../../components/navigation';
import Packs_section from '../../components/packs_section';
import Head from 'next/head';
import Fixed_app_content_overlay from '../../components/fixed_app_content_overlay';
import Profile_socials_background from "../../public/images/profile_socials_background.svg"
import Twitter_logo from "../../public/logos/twitter_logo.svg"
import { GetServerSideProps } from 'next'
import http from "http"
import https from "https"
import HeartIcon from "../../public/icons/HeartIcon.svg"
import HeartBrokenIcon from "../../public/icons/HeartBrokenIcon.svg"
import { Auth_context } from '../../context/auth_context_provider';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { App_notification_context, NOTIFICATION_ACTIONS } from '../../context/app_notification_context_provider';

export default function Profile_page(props: {public_user: Public_user}) {
    const public_user = props.public_user
    const [followers_count, set_followers_count] = useState(public_user.followers_count)
    const [following_count, set_following_count] = useState(public_user.following_count)

    useParallax("profile_banner")
    
    return (
        <>
            <Head>
				<title>{`${public_user?.username}`}</title>
				<meta property="description" content={`${public_user?.description}`}/>
                <meta property="og:url" content={`https://Spritearc.com/user/${public_user?.username}`}/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`${public_user?.username}`}/>
				<meta property="og:description" content={`${public_user?.description}`}/>
				<meta property="og:image" content={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${public_user?.profile_picture}`}/>
				<meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${public_user?.profile_picture}`}/>

				<meta property="twitter:card" content="summary"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content={`https://Spritearc.com/user/${public_user?.username}`}/>
				<meta property="twitter:title" content={`${public_user?.username}`}/>
				<meta property="twitter:description" content={`${public_user?.description}`}/>
                <meta property="twitter:image" content={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${public_user?.profile_picture}`}/>
            </Head>
       
            
            <div className='profile_content'>
                <Nav_shadow/>

                <Fixed_app_content_overlay>
                    <div className='fixed_profile_container'>
                        {(public_user?.socials?.artstation.length > 0 || public_user?.socials?.instagram.length > 0 || public_user?.socials?.twitter.length > 0) &&
                        
                            <div className='socials_container'>
                                
                                <div className='socials'>
                                    <div className='background_wrapper'>
                                        <Profile_socials_background/>
                                    </div>
                                    
                                    {public_user?.socials?.instagram.length > 0 &&
                                        <a href={`https://www.instagram.com/${public_user.socials.instagram}`} target="_blank" rel='noreferrer' className='logo_container'>
                                            <Image loading='lazy' unoptimized={true} src={"/logos/instagram_color.png"} layout={"fill"} alt="Instagram Logo"></Image>
                                        </a>
                                    }
                                    {public_user?.socials?.twitter.length > 0 &&
                                        <a href={`https://www.twitter.com/${public_user.socials.twitter}`} target="_blank" rel='noreferrer' className='logo_container'>
                                            <Twitter_logo/>
                                        </a>
                                    }

                                    {public_user?.socials?.artstation.length > 0 &&
                                        
                                        <a href={`https://www.artstation.com/${public_user.socials.artstation}`} target="_blank" rel='noreferrer' className='logo_container'>
                                            <Image loading='lazy' unoptimized={true} src={"/logos/artstation_color.png"} layout={"fill"} alt="Artstation Logo"></Image>
                                        </a>
                                    }
                                </div>
                            </div>

                        }



                    </div>
                </Fixed_app_content_overlay>
                
                <User_representation public_user={public_user} followers_count={followers_count} following_count={following_count}  set_followers_count={set_followers_count} set_following_count={set_following_count}/>
                <User_stats followers_count={followers_count} following_count={following_count}/>

                <div className='user_packs_container'>
                    <Packs_section section_name={`Packs created by '${public_user?.username}'`} api={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user_packs/${public_user?.username}`} method='POST'/>
                </div>

            </div>
            <Footer/>
        </>
    );
}

function User_stats(props: {followers_count: number, following_count: number}) {
    const App_notification: App_notification_context_type = useContext(App_notification_context)

    function Feature_coming() {
        App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Coming Soon", message: "This feature is coming soon!", button_label: "Ok"}})
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
    const Auth: Auth_context_type = useContext(Auth_context)
    const App_notification: App_notification_context_type = useContext(App_notification_context)
    const public_user = props.public_user
    const [visitor_has_followed, set_visitor_has_followed] = useState<null | boolean>(null)

    async function follow_user() {
        if(Auth.user.auth === false) return App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Please Login", message: "You have to login into your account to be able to follow people!", button_label: "Ok"}})

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
            if(Auth.user.auth === false) return App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Please Login", message: "You have to login into your account to be able to unfollow people!", button_label: "Ok"}})
            
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
        if(public_user.username.toLowerCase() === Auth.user.public_user.username.toLowerCase()) return
        const controller = new AbortController()

        if(Auth.user.auth === true) {
        
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
                    
                    console.log(response_obj)
                    set_visitor_has_followed(response_obj?.following ? response_obj.following : false)
                } catch(err) {
                    //
                }
                
            }
            has_visitor_followed()

        } else if(Auth.user.auth === false) {
            return set_visitor_has_followed(false)
        }
        
        return(() => {
            controller.abort()
        })
    }, [Auth, public_user])

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






