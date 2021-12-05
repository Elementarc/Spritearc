import React, {useContext, useEffect, useState} from 'react';
import {motion} from "framer-motion";
import { App_context, Dispatch_notification } from '../types';
import { APP_CONTEXT } from './layout';
import { NOTIFICATION_ACTIONS } from "../components/layout"

export default function App_notification(props: {notification: Dispatch_notification}) {
    const APP: App_context = useContext(APP_CONTEXT)
    const notification = props.notification
    
    //Setting maxWidth and maxHeight of fixed container to page container
    useEffect(() => {
        const app_fixed_container = document.getElementById("app_overlay_fixed") as HTMLDivElement
        const app_content_container = document.getElementById("app_content_container") as HTMLDivElement

        const observer = new ResizeObserver(() => {
            
            if(app_fixed_container && app_content_container && notification) {
                
                app_fixed_container.style.maxHeight = `${app_content_container.offsetHeight}px`
                app_fixed_container.style.maxWidth = `${app_content_container.offsetWidth}px`
            }
            
        })

        observer.observe(app_content_container)
        
        return(() => {
            observer.unobserve(app_content_container)
        })

    }, [notification])

    //Button function
    function button_func() {
        notification.callb ? notification.callb() : () => {}
        APP.dispatch_app_notification({type: NOTIFICATION_ACTIONS.CLOSE})
    }

    return (
        <>
            <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2}}} exit={{opacity: 0, transition: {duration: .2}}} className="app_overlay_fixed" id="app_overlay_fixed">
            
                <motion.div initial={{scale: .8}} animate={{scale: 1}} exit={{scale: .8}} className={`notification_container ${notification.success? "notification_success_container" : "notification_error_container"}`}>
                    
                    <h1>{notification.title}</h1>
                    <p>{notification.message}</p>
                    
                    <button onClick={button_func}>{notification.button_label}</button>
                
                </motion.div>
                
            </motion.div>
        </>
    );
}


