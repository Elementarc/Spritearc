
import React, {useState, useEffect} from 'react';
import {App_context, Notification} from "../types"
import { AnimatePresence, motion } from 'framer-motion';
import App_notification from './app_notification';
import { useRouter } from 'next/router';
//Components
import Navigation from './navigation';

const APP_NAME = "PixelPalast"
const SHEME= "http"
const DOMAIN = "localhost"
const PORT = 3000

export const APP_CONTEXT: any = React.createContext(null)
export default function Layout( { children }: any) {
    //Setting IsDesktop to tell other Components if App is mobileDevice or DesktopDevice
    const [is_mobile, set_is_mobile] = useState<undefined | boolean>(undefined)
    //Toggling navigation.
    const [nav_state, set_nav_state] = useState(false);
    //Notification obj that triggers an Application notification
    const [notification, set_notification] = useState<Notification>({
        toggle: false,
        success: false,
        title: null,
        message: null,
        button_label: null,
        callb: () => {}
    })
    function create_notification(notification: Notification) {
        set_notification(notification)
    }
    const Router = useRouter()
    
    //Checks if Application IsDesktop or not
    useEffect(() => {
        history.scrollRestoration = "manual"
        function checkApplicationWidth(){
            const deviceWidth = window.innerWidth

            if(deviceWidth > 768){
                set_is_mobile(false)
            } else {
                set_is_mobile(true)
            }
        }
        checkApplicationWidth()
        
        window.addEventListener("resize", checkApplicationWidth)
        return(() => {
            window.removeEventListener("resize", checkApplicationWidth)
        })
    }, []);

    //Toggles app_content_blur whenever navstate toggles.
    useEffect(() => {
        const app_content_blur = document.getElementById("app_content_blur") as HTMLDivElement
        if(nav_state === false) {
            app_content_blur.style.opacity = "0"
            app_content_blur.style.pointerEvents = "none"
        } else {
            app_content_blur.style.opacity = ".8"
            app_content_blur.style.pointerEvents = "all"
        }
    }, [nav_state])
    
    //APP Context
    const APP: App_context = {
        app_name: APP_NAME,
        sheme: SHEME,
        domain: DOMAIN,
        port: PORT,
        is_mobile: is_mobile,
        nav:  {
            nav_state: nav_state,
            set_nav_state: set_nav_state,
        },
        app_content_container: () => {return document.getElementById("app_content_container") as HTMLDivElement},
        create_notification
    }
    
    //Function that will be triggert everytime a page unmounts
    function on_unmount() {
        document.documentElement.style.scrollBehavior = "unset"
        window.scrollTo(0, 0)
    }
    
    return (
        <APP_CONTEXT.Provider value={APP}>

            <div className="app_container" id="app_container">

                <Navigation/>

                <div className="app_content_container" id="app_content_container">

                    <div onClick={() => {set_nav_state(false)}} className="app_content_blur" id="app_content_blur"/>

                    <AnimatePresence exitBeforeEnter onExitComplete={on_unmount}>
                        <motion.main key={Router.pathname} initial={{ opacity: 0}} animate={{opacity: 1, transition: {duration: 0.25}}} exit={{opacity: 0, transition: {duration: 0.1}}}>
                            {children}
                        </motion.main>
                    </AnimatePresence>

                    <App_notification notification={notification}/>
                </div>
                
                
            </div>

        </APP_CONTEXT.Provider>
    );
}

