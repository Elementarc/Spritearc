/*eslint-disable */
import React, {ReactElement, useContext, useEffect} from "react"
import {motion, useAnimation, AnimatePresence } from "framer-motion";
import {NavContext, NavItem, AppContext} from "../types"
//SVG Components (ICONS)
import NavIcon from "../public/icons/NavIcon.svg"
import CloseIcon from "../public/icons/CloseIcon.svg"
import HomeIcon from "../public/icons/HomeIcon.svg"
import NewsIcon from "../public/icons/NewsIcon.svg"
import PacksIcon from "../public/icons/PacksIcon.svg"
import SearchIcon from "../public/icons/SearchIcon.svg"
import SignInIcon from "../public/icons/SignInIcon.svg"
//Context
import { appContext } from "../components/layout";
import Router, { useRouter } from "next/router";
import { useGradient } from "../lib/custom_hooks";

function navigateTo(path: string): void {
    Router.push(`${path}`, `${path}` , {scroll: false})
}
export default function Navigation(): ReactElement {
    const appVars: AppContext = useContext(appContext)
    const isDesktop = appVars.isMobile

    return(
        <>
            {isDesktop === false &&
                <Navigation_desktop key="Navigation_desktop"/>
            }
            {isDesktop === true &&
               <Navigation_mobile key="Navigation_mobile"/>
            }
        </>
    )
}
//Navigation Component for Desktop
function Navigation_desktop(): ReactElement {
    const App: AppContext = useContext(appContext)
    const Nav: NavContext = App.nav
    const navContainerAnimation = useAnimation()

    //Toggle Animation for navigation When NavState changes For mobile & Desktop
    useEffect(() => {
        const getNavContentContainer = document.getElementById("nav_content") as HTMLDivElement
        const getNavigation = document.getElementById("nav_container") as HTMLDivElement
        //Animations For Navigation(DESKTOP)
        function animateNavDesktop(navState: boolean): void{
            getNavContentContainer.style.overflowX = "hidden"
            getNavContentContainer.style.overflowY = "scroll"
            getNavContentContainer.scrollTop = 0
            const getContentBlur = document.getElementById("app_content_blur") as HTMLDivElement
            
            //Scrolling To Top Of Navigation When Switching to between Desktop & Mobile Version
            if(navState === false) {
                navContainerAnimation.start({
                    width: "",
                    transition: {duration: 0.25},
                })
                document.body.style.overflow = ""
                getContentBlur.style.pointerEvents = "none"
                getContentBlur.style.opacity = "0"

            } else {
                navContainerAnimation.start({
                    width: "380px",
                    transition: {duration: 0.25},
                    
                })
                document.body.style.overflow = "hidden"
                getContentBlur.style.pointerEvents = "all"
                getContentBlur.style.opacity = "0.8"

            }
        }

        animateNavDesktop(Nav.navState)
        
    }, [Nav.navState, navContainerAnimation]);

    //Setting NavHeight to device Window inner heigth
    useEffect(() => {
        Nav.setNavState(false)
        const NavContent = document.getElementById("nav_content") as HTMLDivElement

        function resize() {
            
            NavContent.style.height = `${window.innerHeight}px`
        }
        resize()

        window.addEventListener("resize", resize)

        return(() => {
            window.removeEventListener("resize", resize)
        })

    }, [Nav.setNavState])
    
    //Observes AppContentHeight to set maxHeight of Navigation. So app Does not Stretch all the way down to screenHeight
    useEffect(() => {
        const getAppContentContainer = document.getElementById("app_content_container") as HTMLDivElement
        const getNavContentContainer = document.getElementById("nav_content") as HTMLDivElement
        
        
        //Creating Observer for AppContentContainer and setting maxHeight for navContainer. maxHeight will always be appContent Height.
        const resizeObserver = new ResizeObserver((entries) => {
            for(const entry of entries){
                //If App Content is bigger 
                if(entry.contentRect.height > 1080) {
                    getAppContentContainer.style.height = ``
                    getNavContentContainer.style.maxHeight = `${entry.contentRect.height}px`
                    
                } else {
                    getNavContentContainer.style.maxHeight = `1080px`
                }
            }
            
        })

        if(App.isMobile === false) {
            resizeObserver.observe(getAppContentContainer)
        } else {
            resizeObserver.unobserve(getAppContentContainer)
        }
        
        function setNavMaxHeight() {
            
            getNavContentContainer.style.maxHeight = `${getAppContentContainer.offsetHeight}px`
        }
        window.addEventListener("resize", setNavMaxHeight)

        return(() => {
            resizeObserver.unobserve(getAppContentContainer)
            window.removeEventListener("resize", setNavMaxHeight)
        })
    }, [App.isMobile])


    
    return (
        <motion.nav className="nav_container_desktop" id="nav_container">

            <motion.div animate={navContainerAnimation} className="nav_content" id="nav_content">

                <motion.div className="nav_button_container" id="nav_button_container">
                    <AnimatePresence exitBeforeEnter>
                        {Nav.navState === true &&
                            <motion.div key="menu" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.1}}}>
                                <CloseIcon onClick={() => Nav.setNavState(!Nav.navState)} className="nav_svg"/>
                            </motion.div>
                        } 
                        {Nav.navState === false &&
                            <motion.div key="close" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.1}}}>
                                <NavIcon onClick={() => Nav.setNavState(!Nav.navState)} className="nav_svg" />
                            </motion.div>
                        }
                    </AnimatePresence>
                </motion.div>


                <div className="nav_items_container" >
                    <div onClick={() => {Nav.setNavState(false)}}>
                        <ul>
                            <Nav_item label="Home" icon={HomeIcon} link="/"/>
                            <Nav_item label="News" icon={NewsIcon} link="/news" query="?page=1"/>
                            <Nav_item label="Packs" icon={PacksIcon} link="/browse"/>
                            <Nav_item label="Search" icon={SearchIcon} link="/search"/>
                        </ul>
                    </div>

                    <div className="nav_sign_in" id="nav_button_container">
                        <div onClick={() => {Nav.setNavState(false)}}>
                            <ul>
                                <Nav_item label="Sign In" icon={SignInIcon} link="/login"/>
                            </ul>
                        </div>
                    </div>
                </div>

            </motion.div>

        </motion.nav>
    )
}
//Navigation Component for Mobile
function Navigation_mobile(): ReactElement {
    //App
    const App: AppContext = useContext(appContext)
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
        animateNavMobile(nav.navState)

    }, [nav.navState, navContainerAnimation]);

    //Setting NavHeight to device Window inner heigth
    useEffect(() => {
        nav.setNavState(false)
        const getNavScrollContainer = document.getElementById("nav_content") as HTMLDivElement

        function resize() {
            getNavScrollContainer.style.height = ``
        }
        resize()

        window.addEventListener("resize", resize)

        return(() => {
            window.removeEventListener("resize", resize)
        })

    }, [nav.setNavState])

    return (
        <motion.div animate={navContainerAnimation} className="nav_container_mobile" id="nav_container">

            <motion.div className="nav_content" id="nav_content">

                <motion.div className="nav_button_container" id="nav_button_container">
                    <AnimatePresence exitBeforeEnter>
                        {nav.navState === true &&
                            <motion.div key="menu" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.1}}}>
                                <CloseIcon onClick={() => nav.setNavState(!nav.navState)} className="nav_svg" />
                            </motion.div>
                        } 
                        {nav.navState === false &&
                            <motion.div key="close" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.1}}}>
                                <NavIcon onClick={() => nav.setNavState(!nav.navState)} className="nav_svg"/>
                            </motion.div>
                        }
                    </AnimatePresence>
                </motion.div>

                <motion.div className="nav_items_container" >
                    <div onClick={() => {nav.setNavState(false)}}>
                        <ul>
                            <Nav_item label="Home" icon={HomeIcon} link="/"/>
                            <Nav_item label="News" icon={NewsIcon} link="/news"/>
                            <Nav_item label="Packs" icon={PacksIcon} link="/browse"/>
                            <Nav_item label="Search" icon={SearchIcon} link="/search"/>
                        </ul>
                    </div>

                    <div className="nav_sign_in" id="nav_button_container">
                        <div onClick={() => {nav.setNavState(false)}}>
                            <Nav_item label="Sign In" icon={SignInIcon} link="/login"/>
                        </div>
                    </div>
                </motion.div>

                

            </motion.div>

        </motion.div>
    )
}
//NavItem Component
function Nav_item(props: NavItem) {
    const App: AppContext = useContext(appContext)
    const nav = App.nav
    const Router = useRouter()
    
    const navItemLabelAnimation = useAnimation()
    //Showing Labels of navItems when toggling navState
    useEffect(() => {
        if(nav.navState === true) {
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
    }, [nav.navState, navItemLabelAnimation]);

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
        <motion.li onClick={() => {navigateTo(`${props.link}`)}} className="nav_li_item" id={`${props.link.toLowerCase()}`} >
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


