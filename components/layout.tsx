
import React, {useState, useEffect, useReducer} from 'react';
import {App_context, Dispatch_notification, Notification, Notification_actions} from "../types"
import { AnimatePresence, motion } from 'framer-motion';
import App_notification from './app_notification';
import { useRouter } from 'next/router';
import Navigation from './navigation';

export const NOTIFICATION_ACTIONS: Notification_actions = {
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
    CLOSE: "CLOSE",
}

const init_notification_obj: Notification = {
    title: null,
    message: null,
    button_label: null,
    callb: () => {}
}

//Reducer function to handle notification state
function app_notification_reducer(state: Dispatch_notification, action: {type: string, payload?: Notification}): any {
    const { type, payload } = action

    if(!type) return state

    switch ( type ) {

        case NOTIFICATION_ACTIONS.SUCCESS : {

            if(!payload) return state

            return state = {
                toggle: true,
                success: true,
                title: payload.title,
                message: payload.message,
                button_label: payload.button_label,
                callb: payload.callb
            }
            
        }

        case NOTIFICATION_ACTIONS.ERROR : {

            if(!payload) return state

            return state = {
                toggle: true,
                success: false,
                title: payload.title,
                message: payload.message,
                button_label: payload.button_label,
                callb: payload.callb
            }

        }

        case NOTIFICATION_ACTIONS.CLOSE : {

            return state = {
                toggle: false,
                success: false,
                title: null,
                message: null,
                button_label: null,
                callb: () => {}
            }

        }

        default : {

            return state = {
                toggle: false,
                success: false,
                title: null,
                message: null,
                button_label: null,
                callb: () => {}
            }
            
        }

    }
}

export default function Layout( { children }: any ) {
    //App notification reducer. Used to create app_notifications.
    const [app_notification, dispatch_app_notification] = useReducer(app_notification_reducer, init_notification_obj)

    //Setting IsDesktop to tell other Components if App is mobileDevice or DesktopDevice
    const [is_mobile, set_is_mobile] = useState<undefined | boolean>(undefined)

    //Toggling navigation.
    const [nav_state, set_nav_state] = useState(false);
    
    const Router = useRouter()
    
    
    //Function that will be triggert everytime a page unmounts
    function on_unmount() {
        document.documentElement.style.scrollBehavior = "unset"
        window.scrollTo(0, 0)
    }

    
    
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
        is_mobile: is_mobile,
        nav:  {
            nav_state: nav_state,
            set_nav_state: set_nav_state,
        },
        dispatch_app_notification,
        app_content_element: () => {return document.getElementById("app_content_container") as HTMLDivElement},
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


                    <AnimatePresence exitBeforeEnter>
                        {app_notification.toggle &&
                            <App_notification notification={app_notification}/>
                        }
                    </AnimatePresence>
                    
                </div>
                
                
            </div>

        </APP_CONTEXT.Provider>
    );
}

export const APP_CONTEXT: any = React.createContext(null)
