/*eslint-disable */
import React, {ReactElement, useContext, useEffect} from "react"
import {motion, useAnimation, AnimatePresence } from "framer-motion";
import { Nav_item, App_context} from "../types"
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
import Background_gradient from "./gradient_background";


export default function Navigation(): ReactElement {
    const APP: App_context = useContext(APP_CONTEXT)

    return(
        <>
            {APP.is_mobile === false &&
                <Navigation_desktop key="Navigation_desktop"/>
            }
            {APP.is_mobile === true &&
               <Navigation_mobile key="Navigation_mobile"/>
            }
        </>
    )
}
//Navigation Component for Desktop
function Navigation_desktop(): ReactElement {
    const APP: App_context = useContext(APP_CONTEXT)
    const NAV = APP.nav

    const nav_content_container_animations = useAnimation()
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

        animateNavDesktop(NAV.nav_state)
        
    }, [NAV.nav_state, nav_content_container_animations]);

    //Setting height of nav_items_container to window innerheight. so scrolling through nav_items works properly. Also adding Observer to observer app_component!
    useEffect(() => {
        //Page Content Container
        const app_content_container = APP.app_content_container()
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
    }, [APP.app_content_container])

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

                <Background_gradient id="nav_background" page_id="app_content_container"/>

                <div className="content" id="nav_content">

                    <motion.div className="nav_button_container" id="nav_button_container">

                        <AnimatePresence exitBeforeEnter>
                            {NAV.nav_state === true &&
                                <motion.div key="menu" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.1}}}>
                                    <CloseIcon onClick={() => NAV.set_nav_state(!NAV.nav_state)} className="nav_svg"/>
                                </motion.div>
                            } 
                            {NAV.nav_state === false &&
                                <motion.div key="close" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.1}}}>
                                    <NavIcon onClick={() => NAV.set_nav_state(!NAV.nav_state)} className="nav_svg" />
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
                                <Nav_item_container  icon={SignInIcon} label="Sign in" link="/login"/>
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
    //App
    const App: App_context = useContext(APP_CONTEXT)
    const nav = App.nav

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
        animateNavMobile(nav.nav_state)

    }, [nav.nav_state, navContainerAnimation]);

    //Setting NavHeight to device Window inner heigth
    useEffect(() => {
        nav.set_nav_state(false)
        const getNavScrollContainer = document.getElementById("nav_content") as HTMLDivElement

        function resize() {
            getNavScrollContainer.style.height = ``
        }
        resize()

        window.addEventListener("resize", resize)

        return(() => {
            window.removeEventListener("resize", resize)
        })

    }, [nav.set_nav_state])

    return (
        <motion.div animate={navContainerAnimation} className="nav_container_mobile" id="nav_container">

            <motion.div className="nav_content" id="nav_content">

                <motion.div className="nav_button_container" id="nav_button_container">
                    <AnimatePresence exitBeforeEnter>
                        {nav.nav_state === true &&
                            <motion.div key="menu" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.1}}}>
                                <CloseIcon onClick={() => nav.set_nav_state(!nav.nav_state)} className="nav_svg" />
                            </motion.div>
                        } 
                        {nav.nav_state === false &&
                            <motion.div key="close" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.1}}}>
                                <NavIcon onClick={() => nav.set_nav_state(!nav.nav_state)} className="nav_svg"/>
                            </motion.div>
                        }
                    </AnimatePresence>
                </motion.div>

                <motion.div className="nav_items_container" >
                    <div onClick={() => {nav.set_nav_state(false)}}>
                        <ul>
                            <Nav_item_container label="Home" icon={HomeIcon} link="/"/>
                            <Nav_item_container label="News" icon={NewsIcon} link="/news"/>
                            <Nav_item_container label="Packs" icon={BrowseIcon} link="/browse"/>
                            <Nav_item_container label="Search" icon={SearchIcon} link="/search"/>
                        </ul>
                    </div>

                    <div className="nav_sign_in" id="nav_button_container">
                        <div onClick={() => {nav.set_nav_state(false)}}>
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
    const App: App_context = useContext(APP_CONTEXT)
    const Nav = App.nav
    const Router = useRouter()
    
    const navItemLabelAnimation = useAnimation()
    //Showing Labels of navItems when toggling navState
    useEffect(() => {
        if(Nav.nav_state === true) {
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
    }, [Nav.nav_state, navItemLabelAnimation]);

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
        <motion.li onClick={() => {Router.push(`${props.link}`, `${props.link}` , {scroll: false}); Nav.set_nav_state(false)}} className="nav_li_item" id={`${props.link.toLowerCase()}`} >
            
            <div className="nav_item">
                <Icon className="icon_svg"/>
                <motion.p animate={navItemLabelAnimation} >{props.label}</motion.p>
            </div>
            
            <span />

        </motion.li>
    )
}

export function Nav_shadow(): ReactElement {

    return(
        <div className="nav_shadow"/>
    )
}


