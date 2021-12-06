
import React, {useState, useEffect} from 'react';
import {App_context} from "../types"
import { AnimatePresence, motion } from 'framer-motion';
import App_notification from './app_notification';
import { useRouter } from 'next/router';
import Navigation from './navigation';
import Auth_context_provider from "../context/auth_context_provider";
import Device_context_provider from '../context/device_context_provider';
import App_notification_context_provider from '../context/app_notification_provider';


export default function Layout( { children }: any ) {
    //Toggling navigation.
    const [nav_state, set_nav_state] = useState(false);

    const Router = useRouter()
    
    
    //Function that will be triggert everytime a page unmounts
    function on_unmount() {
        document.documentElement.style.scrollBehavior = "unset"
        window.scrollTo(0, 0)
    }
    
    

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
        nav: {
            nav_state: nav_state,
            set_nav_state: set_nav_state,
        },
        app_content_element: () => {return document.getElementById("app_content_container") as HTMLDivElement},
    }

    return (
        <APP_CONTEXT.Provider value={APP}>
            <Auth_context_provider>
                <Device_context_provider>
                    <App_notification_context_provider>
                        <div className="app_container" id="app_container">

                            <Navigation/>

                            <div className="app_content_container" id="app_content_container">

                                <div onClick={() => {set_nav_state(false)}} className="app_content_blur" id="app_content_blur"/>

                                <AnimatePresence exitBeforeEnter onExitComplete={on_unmount}>
                                    <motion.main key={Router.pathname} initial={{ opacity: 0}} animate={{opacity: 1, transition: {duration: 0.25}}} exit={{opacity: 0, transition: {duration: 0.1}}}>
                                        {children}
                                    </motion.main>
                                </AnimatePresence>

                                <AnimatePresence exitBeforeEnter>
                                    
                                    <App_notification/>
                                    
                                </AnimatePresence>
                                
                            </div>
                            
                            
                        </div>
                    </App_notification_context_provider>
                </Device_context_provider>
            </Auth_context_provider>
        </APP_CONTEXT.Provider>
    );
}

export const APP_CONTEXT: any = React.createContext(null)
