
import React, {useEffect, useContext} from 'react';
import {App_context, App_navigation_context_type, Public_user} from "../types"
import { AnimatePresence, motion } from 'framer-motion';
import App_notification from './app_notification';
import { useRouter } from 'next/router';
import Navigation from './navigation';
import { Auth_context } from "../context/auth_context_provider";
import Device_context_provider from '../context/device_context_provider';
import App_notification_context_provider from '../context/app_notification_context_provider';
import Navigation_context_provider, {Navigation_context} from '../context/navigation_context_provider';
import { USER_DISPATCH_ACTIONS } from '../context/auth_context_provider';

export const APP_CONTEXT: any = React.createContext(null)

export default function Layout({children}: any ) {
    const router = useRouter()
    const Auth: any = useContext(Auth_context)

    //Checking if user is signed in or not. Used for whole application.
    useEffect(() => {
        async function is_auth() {
            const response = await fetch("/api/user/is_auth", {method: "POST"})
            
            if(response.status === 200) {
                const user: Public_user = await response.json()
                
                Auth.dispatch_user({type: USER_DISPATCH_ACTIONS.LOGIN, payload: {auth: true, public_user: {...user}}})

            } else {
                Auth.dispatch_user({type: USER_DISPATCH_ACTIONS.LOGOUT, payload: {auth: false}})
            }
            
        }
        is_auth()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    //Function that will be triggert everytime a page unmounts
    function on_unmount() {
        document.documentElement.style.scrollBehavior = "unset"
        window.scrollTo(0, 0)
    }
    
    const APP: App_context = {
        app_content_element: () => {return document.getElementById("app_content_container") as HTMLDivElement},
    }

    return (
        <APP_CONTEXT.Provider value={APP}>
            <Device_context_provider>
                <Navigation_context_provider>
                    <App_notification_context_provider>

                        <div className="app_container" id="app_container">

                            <Navigation/>

                            <div className="app_content_container" id="app_content_container">

                                <App_content_blur/>

                                
                                    <AnimatePresence exitBeforeEnter onExitComplete={on_unmount}>
                                        <motion.main key={router.pathname} initial={{ opacity: 0}} animate={{opacity: 1, transition: {duration: 0.25}}} exit={{opacity: 0, transition: {duration: 0.1}}}>
                                            {children}
                                        </motion.main>
                                    </AnimatePresence>
                                
                                
                                <AnimatePresence exitBeforeEnter>
                                    
                                    <App_notification/>
                                    
                                </AnimatePresence>
                                
                            </div>
                            
                        </div>

                    </App_notification_context_provider>
                </Navigation_context_provider>
            </Device_context_provider>
        </APP_CONTEXT.Provider>
    );
}

export function App_content_blur() {
    const Nav: App_navigation_context_type = useContext(Navigation_context)

    //Toggles app_content_blur whenever navstate toggles.
    useEffect(() => {
        const app_content_blur = document.getElementById("app_content_blur") as HTMLDivElement
        if(Nav.nav_state === false) {
            app_content_blur.style.opacity = "0"
            app_content_blur.style.pointerEvents = "none"
        } else {
            app_content_blur.style.opacity = ".8"
            app_content_blur.style.pointerEvents = "all"
        }
    }, [Nav.nav_state])

    return(
        <div onClick={() => {Nav.set_nav_state(false)}} className="app_content_blur" id="app_content_blur"/>
    )
}

