/*eslint-disable */
import React, {ReactElement, useContext, useEffect} from "react"
import {motion, useAnimation, AnimatePresence } from "framer-motion";
import { Nav_item, App_context, Public_user} from "../types"
//SVG Components (ICONS)
import NavIcon from "../public/icons/NavIcon.svg"
import CloseIcon from "../public/icons/CloseIcon.svg"
import HomeIcon from "../public/icons/HomeIcon.svg"
import NewsIcon from "../public/icons/NewsIcon.svg"
import BrowseIcon from "../public/icons/PacksIcon.svg"
import SearchIcon from "../public/icons/SearchIcon.svg"
import SignInIcon from "../public/icons/SignInIcon.svg"
//Context
import { APP_CONTEXT } from "../components/layout";
import { useRouter } from "next/router";
import { Auth_context, USER_DISPATCH_ACTIONS } from "../context/auth_context_provider";
import { Device_context } from "../context/device_context_provider";
import { Navigation_context } from "../context/navigation_context_provider";
import Image from "next/image"
import Link from "next/link"


export default function Navigation(): ReactElement {
    const Device = useContext(Device_context)
    
    return(
        <>
            {Device.is_mobile === false &&
                <Navigation_desktop key="Navigation_desktop"/>
            }
            {Device.is_mobile === true &&
               <Navigation_mobile key="Navigation_mobile"/>
            }
        </>
    )
}


//Navigation Component for Desktop
function Navigation_desktop(): ReactElement {
    const Navigation: any = useContext(Navigation_context)
    const APP: App_context = useContext(APP_CONTEXT)
    const nav_content_container_animations = useAnimation()
    const Auth: any = useContext(Auth_context)
    const user = Auth.user as any
    
    //Toggle Animation for navigation When NavState changes For mobile & Desktop
    useEffect(() => {
        
        //Animations For Navigation(DESKTOP)
        function animateNavDesktop(navState: boolean): void{
            //Scrolling To Top Of Navigation When Switching to between Desktop & Mobile Version
            if(navState === false) {
                nav_content_container_animations.start({
                    width: "",
                    boxShadow: "0px 3px 6px 0px rgba(0,0,0, 0)",
                    transition: {duration: 0.25},
                })
                document.body.style.overflow = ""
            } else {
                nav_content_container_animations.start({
                    width: "380px",
                    boxShadow: "0px 3px 6px 0px rgba(0,0,0, .5)",
                    transition: {duration: 0.25},
                    
                })
                document.body.style.overflow = "hidden"
            }
        }

        animateNavDesktop(Navigation.nav_state)
        
    }, [Navigation.nav_state, nav_content_container_animations]);

    //Setting height of nav_items_container to window innerheight. so scrolling through nav_items works properly. Also adding Observer to observer app_component!
    useEffect(() => {
        //Page Content Container
        const app_content_container = APP.app_content_element()
        const nav_items_container = document.getElementById("nav_items_container") as HTMLDivElement

        const observer = new ResizeObserver((entries) => {
            
            for(let entry of entries) {
                nav_items_container.style.height = `${window.innerHeight - nav_items_container.offsetTop}px`
                nav_items_container.style.maxHeight = `${entry.contentRect.height - nav_items_container.offsetTop}px`
            }
        })
        
        function setHeight() {
            nav_items_container.style.height = `${window.innerHeight - nav_items_container.offsetTop}px`
            nav_items_container.style.maxHeight = `${app_content_container.offsetHeight - nav_items_container.offsetTop}px`
        }
        setHeight()
        observer.observe(app_content_container)
        window.addEventListener("resize", setHeight)

        return(() => {
            observer.unobserve(app_content_container)
            window.removeEventListener("resize", setHeight)
        })
    }, [APP.app_content_element])

    //Setting shadow below NavButton when Nav_items are scrolled for better ux
    useEffect(() => {
        const nav_button_container = document.getElementById("nav_button_container") as HTMLDivElement
        const items_container = document.getElementById("nav_items_container") as HTMLDivElement

        function set_shadow() {
            nav_button_container.style.transition = "0.2s ease-in-out"
            if(items_container.scrollTop > 0) {
                
                nav_button_container.style.boxShadow = "0px 3px 4px 0px rgba(0, 0, 0, 0.3)"
            } else {
                
                nav_button_container.style.boxShadow = "0px 3px 4px 0px rgba(0, 0, 0, 0)"
            }
        }

        items_container.addEventListener("scroll" , set_shadow)
    }, [])

    

    return (
        <motion.nav className="nav_container_desktop" id="nav_container">
            <motion.div animate={nav_content_container_animations} className="content_container" id="content_container">

                <div className="content" id="nav_content">

                    <motion.div className="nav_button_container" id="nav_button_container">

                        <AnimatePresence exitBeforeEnter>
                            
                            {Navigation.nav_state === true &&
                                <motion.div key="menu" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.1}}}>
                                    <CloseIcon onClick={() => Navigation.set_nav_state(!Navigation.nav_state)} className="nav_svg"/>
                                </motion.div>
                            }

                            {Navigation.nav_state === false &&
                                <motion.div key="close" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.1}}}>
                                    <NavIcon onClick={() => Navigation.set_nav_state(!Navigation.nav_state)} className="nav_svg" />
                                </motion.div>
                            }
                            
                        </AnimatePresence>

                    </motion.div>

                    <div className="items_container" id="nav_items_container">
                        
                        <ul>
                            <div className="main_section">
                                <Nav_item_container icon={HomeIcon} label="Home" link="/" />
                                <Nav_item_container icon={NewsIcon} label="News" link="/news"/>
                                <Nav_item_container icon={BrowseIcon} label="Browse" link="/browse"/>
                                <Nav_item_container icon={SearchIcon} label="Search" link="/search"/>
                            </div>
                            

                            <div className="bottom_section">
                                
                                {user.auth === false &&
                                    <Nav_item_container key="nav_item" icon={SignInIcon} label="Sign in" link="/login"/>
                                }

                                {user.auth === true &&
                                    <User_profile/>
                                }
                            </div>
                        </ul>

                    </div>

                </div>
                
            </motion.div>
        </motion.nav>
    )
}

//Navigation Component for Mobile
function Navigation_mobile(): ReactElement {
    const Navigation: any = useContext(Navigation_context)

    const navContainerAnimation = useAnimation()
    //Toggle Animation for navigation When NavState changes For mobile
    useEffect(() => {
        const getNavScrollContainer = document.getElementById("nav_content") as HTMLDivElement
        //Animations For Navigation(MOBILE)
        function animateNavMobile(navState: boolean): void{
            getNavScrollContainer.style.scrollBehavior = "smooth"
            getNavScrollContainer.scrollTop = 0
            document.body.style.overflow = "unset"

            if(navState === false) {
                getNavScrollContainer.style.overflowX = "hidden"
                getNavScrollContainer.style.overflowY = "hidden"
                navContainerAnimation.start({
                    width: "",
                    height: "",
                    transition: {duration: 0.25},
                })
            
            } else {
                getNavScrollContainer.style.overflowX = "hidden"
                getNavScrollContainer.style.overflowY = "scroll"
                document.body.style.overflow = "hidden"
                
                navContainerAnimation.start({
                    width: "",
                    height: `100%`,
                    transition: {duration: 0.25},
                })
    
            }
        }
        animateNavMobile(Navigation.nav_state)

    }, [Navigation.nav_state, navContainerAnimation]);

    //Setting NavHeight to device Window inner heigth
    useEffect(() => {
        Navigation.set_nav_state(false)
        const getNavScrollContainer = document.getElementById("nav_content") as HTMLDivElement

        function resize() {
            getNavScrollContainer.style.height = ``
        }
        resize()

        window.addEventListener("resize", resize)

        return(() => {
            window.removeEventListener("resize", resize)
        })

    }, [Navigation.set_nav_state])

    return (
        <motion.div animate={navContainerAnimation} className="nav_container_mobile" id="nav_container">

            <motion.div className="nav_content" id="nav_content">

                <motion.div className="nav_button_container" id="nav_button_container">
                    <AnimatePresence exitBeforeEnter>
                        {Navigation.nav_state === true &&
                            <motion.div key="menu" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.1}}}>
                                <CloseIcon onClick={() => Navigation.set_nav_state(!Navigation.nav_state)} className="nav_svg" />
                            </motion.div>
                        } 
                        {Navigation.nav_state === false &&
                            <motion.div key="close" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.1}}}>
                                <NavIcon onClick={() => Navigation.set_nav_state(!Navigation.nav_state)} className="nav_svg"/>
                            </motion.div>
                        }
                    </AnimatePresence>
                </motion.div>

                <motion.div className="nav_items_container" >
                    <div onClick={() => {Navigation.set_nav_state(false)}}>
                        <ul>
                            <Nav_item_container label="Home" icon={HomeIcon} link="/"/>
                            <Nav_item_container label="News" icon={NewsIcon} link="/news"/>
                            <Nav_item_container label="Packs" icon={BrowseIcon} link="/browse"/>
                            <Nav_item_container label="Search" icon={SearchIcon} link="/search"/>
                        </ul>
                    </div>

                    <div className="nav_sign_in" id="nav_button_container">
                        <div onClick={() => {Navigation.set_nav_state(false)}}>
                            <Nav_item_container label="Sign In" icon={SignInIcon} link="/login"/>
                        </div>
                    </div>
                </motion.div>

                

            </motion.div>

        </motion.div>
    )
}

//NavItem Component
function Nav_item_container(props: Nav_item) {
    const Navigation: any = useContext(Navigation_context)
    const Router = useRouter()
    
    const navItemLabelAnimation = useAnimation()
    //Showing Labels of navItems when toggling navState
    useEffect(() => {
        if(Navigation.nav_state === true) {
            navItemLabelAnimation.start({
                transition: {duration: 0.2},
                opacity: 1,
            })
        } else {
            navItemLabelAnimation.start({
                transition: {duration: 0.2},
                opacity: 0,
            })
        }
    }, [Navigation.nav_state, navItemLabelAnimation]);

    //Adding removing classes/styles to target Nav_item or none target Nav_item
    useEffect(() => {
        const getNavItems = document.getElementsByClassName(`nav_li_item`) as HTMLCollection
        const navItems = Array.from(getNavItems)

        function setNavItemTarget() {
            const pathname = Router.route.split("/")
            for(let i = 0; i < navItems.length; ++i) {
                
                if(navItems[i].id === `/${pathname[1]}`) {
                    navItems[i].classList.add(`nav_li_item_target`)
                } else {
                    navItems[i].classList.remove(`nav_li_item_target`)
                }
            }
        }
        setNavItemTarget()
    }, [Router.pathname]);

    const Icon = props.icon
    return(
        <motion.li onClick={() => {Router.push(`${props.link}`, `${props.link}` , {scroll: false}); Navigation.set_nav_state(false)}} className="nav_li_item" id={`${props.link.toLowerCase()}`} >
            
            <div className="nav_item">
                <Icon className="icon_svg"/>
                <motion.p animate={navItemLabelAnimation} >{props.label}</motion.p>
            </div>
            
            <span />

        </motion.li>
    )
}

function User_profile() {
    const Auth: any = useContext(Auth_context)
    const Navigation: any = useContext(Navigation_context)
    const user_info_animation = useAnimation()
    const router = useRouter()
    const user = Auth.user as any
    
    async function logout () {
        const response = await fetch("/api/user/logout", {method: "POST"})

        if(response.status === 200) {
            Navigation.set_nav_state(false)
            Auth.dispatch_user({type: USER_DISPATCH_ACTIONS.LOGOUT, payload: {callb: () => {router.push("/login", "/login", {scroll: false})} }})
        }
    }

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
                        <Image priority={true} src={`/profile_pictures/${user.profile_picture}`} layout="fill"/>
                    </div>
                    

                </div>
                

                <motion.div animate={user_info_animation} className="user_info">
                    <Link href={`/profile?user=${user.username.toLowerCase()}`}>{user.username}</Link>
                    <div>
                        <h4>User since: {user.created_at}</h4>
                    </div>
                    <p onClick={logout}>Logout</p>
                    
                </motion.div>
                
            </div>

            
        </div>
    )
}

export function Nav_shadow(): ReactElement {

    return(
        <div className="nav_shadow"/>
    )
}


