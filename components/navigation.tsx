/*eslint-disable */
import React, {ReactElement, useContext, useEffect} from "react"
import {motion, useAnimation, AnimatePresence } from "framer-motion";
//SVG Components (ICONS)
import CloseIcon2 from "../public/icons/CloseIcon2.svg"
import HomeIcon from "../public/icons/HomeIcon.svg"
import NewsIcon from "../public/icons/NewsIcon.svg"
import BrowseIcon from "../public/icons/PacksIcon.svg"
import TrophyIcon from "../public/icons/TrophyIcon.svg"
import SearchIcon from "../public/icons/SearchIcon.svg"
import SignInIcon from "../public/icons/LoginIcon.svg"
//Context
import { Navigation_context } from "../context/navigation_context_provider";
import ViewPort from "./layout/viewPort";
import MenuIcon from "../public/icons/MenuIcon.svg"
import NavItem from "./navItem";
import ToggleIcon from "./toggleIcon";
import ScrollList from "./scrollList";
import useDevice, { EDevice } from "../hooks/useDevice";
import ProfileBox, { ProfilePicture } from "./profileBox";
import { AccountContext } from "../context/accountContextProvider";

export default function NavigationRenderer(): ReactElement {
    const device = useDevice()

    return(
        <>
            {device === EDevice.DESKTOP && <NavigationDesktop/>}
            {device === EDevice.MOBILE && <NavigationMobile/>}
        </>
    )
}

function NavigationDesktop() {
    const account = useContext(AccountContext)
    const Navigation: any = useContext(Navigation_context)
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
    
    return (
        <div className="desktop_navigation_container">
            <ViewPort>
                <div className="navigation_viewport_container">
                    
                    <motion.div animate={navContainer} className="nav_content">

                        <div className="top_container">
                            <ToggleIcon iconOne={CloseIcon2} iconTwo={MenuIcon} state={Navigation.nav_state} setState={Navigation.set_nav_state}/>
                        </div>
                        
                        <ScrollList className="nav_items_container">
                            <NavItem icon={HomeIcon} label="Home" link="/" />
                            <NavItem icon={NewsIcon} label="News" link="/news"/>
                            <NavItem icon={BrowseIcon} label="Browse" link="/browse"/>
                            <NavItem icon={TrophyIcon} label="Achievements" link="/achievements" new="New"/>
                            <NavItem icon={SearchIcon} label="Search" link="/search" />
                        </ScrollList>

                        <div className="nav_user_container">
                            {account?.publicUser === undefined && null}
                            {account?.publicUser === null && <NavItem icon={SignInIcon} label="Sign in" link="/login"/> }
                            {account?.publicUser && <ProfileBox publicUser={account.publicUser} accountRefresh={account?.refresh}/>}
                        </div>
                    </motion.div>

                </div>
            </ViewPort>
        </div>
    );
}

function NavigationMobile() {
    const Navigation: any = useContext(Navigation_context)
    const account = useContext(AccountContext);

    const mobileNavAnimation = useAnimation()
    useEffect(() => {
        if(Navigation.nav_state) {
            mobileNavAnimation.start({
                height: "auto",
                transition: {duration: .2}
            })
        } else {
            mobileNavAnimation.start({
                height: "55px",
                transition: {duration: .2}
            })
        }
    }, [Navigation.nav_state])

    return (
        <motion.div initial={{height: "55px"}} animate={mobileNavAnimation} className="mobile_navigation_container">
            <div className="top_container">
                <ToggleIcon iconOne={CloseIcon2} iconTwo={MenuIcon} state={Navigation.nav_state} setState={Navigation.set_nav_state}/>
                <div className="profile_picture_container">
                    <AnimatePresence>
                        {account?.publicUser && !Navigation.nav_state && <ProfilePicture imageLink={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${account.publicUser.profile_picture}`}/>}
                    </AnimatePresence>
                </div>
            </div>

            <ScrollList className="nav_items_container">
                <NavItem icon={HomeIcon} label="Home" link="/" />
                <NavItem icon={NewsIcon} label="News" link="/news"/>
                <NavItem icon={BrowseIcon} label="Browse" link="/browse"/>
                <NavItem icon={TrophyIcon} label="Achievements" link="/achievements" new="New"/>
                <NavItem icon={SearchIcon} label="Search" link="/search" />

                <div className="nav_item_wrapper">
                    {account?.publicUser === undefined && null}
                    {account?.publicUser === null && <NavItem icon={SignInIcon} label="Sign in" link="/login"/> }
                    {account?.publicUser && <ProfileBox publicUser={account.publicUser} accountRefresh={account?.refresh}/>}
                </div>
            </ScrollList>
        </motion.div>
    );
}
