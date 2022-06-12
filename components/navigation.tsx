/*eslint-disable */
import React, {ReactElement, useContext, useEffect, useRef} from "react"
import {motion, useAnimation, AnimatePresence } from "framer-motion";
import { Nav_item, App_context, Auth_context_type, } from "../types"
//SVG Components (ICONS)
import NavIcon from "../public/icons/NavIcon.svg"
import CloseIcon from "../public/icons/CloseIcon.svg"
import CloseIcon2 from "../public/icons/CloseIcon2.svg"
import HomeIcon from "../public/icons/HomeIcon.svg"
import NewsIcon from "../public/icons/NewsIcon.svg"
import BrowseIcon from "../public/icons/PacksIcon.svg"
import TrophyIcon from "../public/icons/TrophyIcon.svg"
import SearchIcon from "../public/icons/SearchIcon.svg"
import SignInIcon from "../public/icons/LoginIcon.svg"
//Context
import { useRouter } from "next/router";
import { Auth_context, USER_DISPATCH_ACTIONS } from "../context/auth_context_provider";
import { Device_context } from "../context/device_context_provider";
import { Navigation_context } from "../context/navigation_context_provider";
import Image from "next/image"
import Link from "next/link"
import { format_date } from "../lib/date_lib";
import useGetUserCredits from "../hooks/useGetUserCredits";
import Sprite_credits from "./sprite_credits";
import ViewPort from "./layout/viewPort";
import MenuIcon from "../public/icons/MenuIcon.svg"
import NavItem from "./navItem";

export default function NavigationRenderer(): ReactElement {
    

    return(
        <>
            <NavigationDesktop/>
            <NavigationMobile/>
        </>
    )
}

export function Nav_shadow(): ReactElement {

    return(
        <div className="nav_shadow"/>
    )
}


function NavigationDesktop() {
    const Auth: Auth_context_type = useContext(Auth_context)
    const Navigation: any = useContext(Navigation_context)
    const navContentListRef = useRef<null | HTMLDivElement>(null)
    const navContainer = useAnimation()
    
    //Animation to open Navigation
    useEffect(() => {
        
        if(Navigation.nav_state) {
            navContainer.start({
                width: "385px",
                transition: {duration: 0.2},
            })
        } else {
            navContainer.start({
                width: "",
                transition: {duration: 0.2},
            })
        }

    }, [navContainer, Navigation])
    //Animation to display buttonShadow when scrolling in navigation for better UX
    useEffect(() => {
        const navContentList = navContentListRef.current
        if(!navContentList) return

        const scrollEvent = () => {
            if(navContentList.scrollHeight !> navContentList.clientHeight) {
                if(navContentList.scrollTop > 16) {
                    navContentList.style.boxShadow = "inset 0px 10px 10px -10px rgba(0, 0, 0, .7)"
    
                } else {
                    navContentList.style.boxShadow = "inset 0px -10px 10px -10px rgba(0, 0, 0, .7)"
                }
            }
            
        }
        scrollEvent()
        navContentList.addEventListener("scroll", scrollEvent)
        return() => {
            navContentList.removeEventListener("scroll", scrollEvent) 
        }
    }, [navContentListRef])

    return (
        <div className="desktop_navigation_container">
            <ViewPort>
                <div className="navigation_viewport_container">
                    
                    <motion.div animate={navContainer} className="nav_content">

                        <motion.div className="nav_button_container" id="nav_button_container">

                            <AnimatePresence exitBeforeEnter>
                                
                                {Navigation.nav_state === true &&
                                    <motion.div key="menu" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.1}}}>
                                        <CloseIcon2 onClick={() => Navigation.set_nav_state(!Navigation.nav_state)} className="nav_svg"/>
                                    </motion.div>
                                }

                                {Navigation.nav_state === false &&
                                    <motion.div key="close" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.1}}}>
                                        <MenuIcon onClick={() => Navigation.set_nav_state(!Navigation.nav_state)} className="nav_svg" />
                                    </motion.div>
                                }
                                
                            </AnimatePresence>
                        </motion.div>
                        
                        <div ref={navContentListRef}  className="nav_items_container">
                            <NavItem icon={HomeIcon} label="Home" link="/" />
                            <NavItem icon={NewsIcon} label="News" link="/news"/>
                            <NavItem icon={BrowseIcon} label="Browse" link="/browse"/>
                            <NavItem icon={TrophyIcon} label="Achievements" link="/achievements" new="New"/>
                            <NavItem icon={SearchIcon} label="Search" link="/search" />
                        </div>

                        <div className="nav_user_container">
                            {Auth.user.auth === null && null}
                            
                            {Auth.user.auth === false
                                ?   <NavItem icon={SignInIcon} label="Sign in" link="/login"/>
                                :   <User_profile/>
                            }
                            
                        </div>
                    </motion.div>

                </div>
            </ViewPort>
        </div>
    );
}


function NavigationMobile() {
    return (
        <div className="mobile_navigation_container">
        
        </div>
    );
}




function User_profile() {
    const Auth: Auth_context_type = useContext(Auth_context)
    const Navigation: any = useContext(Navigation_context)
    const user_info_animation = useAnimation()
    const router = useRouter()
    const user = Auth.user.public_user
    const controller = useRef(new AbortController)

    const credits = useGetUserCredits()

    async function logout () {

        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: controller.current.signal,
                credentials: "include"
            })
    
            if(response.status === 200) {
                Navigation.set_nav_state(false)
                Auth.dispatch({type: USER_DISPATCH_ACTIONS.LOGOUT, payload: {auth: false, callb: () => {router.push("/login", "/login", {scroll: false})}}})
            }

        } catch(err) {
            //Coulndt reach server
        }
        
    }

    useEffect(() => {
        return () => {
            controller.current.abort()
        };
    }, [controller])

    //Showing Labels of Profile info when toggling navState
    useEffect(() => {
        if(Navigation.nav_state === true) {
            user_info_animation.start({
                transition: {duration: 0.2},
                opacity: 1,
            })
        } else {
            user_info_animation.start({
                transition: {duration: 0.2},
                opacity: 0,
            })
        }
    }, [Navigation.nav_state, user_info_animation]);

    //setting target style for background of portrait when on account page
    useEffect(() => {
        const user_portrait = document.getElementById("nav_user_portrait") as HTMLDivElement

        if(router.pathname.toLowerCase() === "/account") {
            user_portrait.classList.add("portrait_target")
        } else {
            user_portrait.classList.remove("portrait_target")
        }
    }, [router.pathname])

    return(
        <div className="nav_user_profile_container">

            <div className="portrait_container">

                <div onClick={() => {router.push("/account", "/account", {scroll: false}); Navigation.set_nav_state(false)}} className="portrait portrait_target" id="nav_user_portrait">
                    <div className="portrait_image">
                        <Image loading='lazy' unoptimized={true} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${user.profile_picture}`} layout="fill"/>
                    </div>
                    
                </div>

                <motion.div animate={user_info_animation} className="user_info">
                    <div onClick={() => {Navigation.set_nav_state(false)}}>
                        <Link href={`/user/${user.username.toLowerCase()}`}>{user.username}</Link>
                    </div>
                    <div>
                        <h4>User since: {format_date(new Date(user.created_at))}</h4>
                        <div className="sprite_coins_container" style={{marginLeft: "1.6rem"}}>
                            <Sprite_credits/>
                        </div>
                    </div>
                    <p onClick={logout}>Logout</p>
                    
                </motion.div>
                
            </div>

        </div>
    )
}




