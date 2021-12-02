import React, {useContext, useEffect} from 'react';
import {AnimatePresence, motion} from "framer-motion";
import { App_context, Notification } from '../types';
import { APP_CONTEXT } from './layout';

export default function App_notification(props: {notification: Notification}) {
    const APP: App_context = useContext(APP_CONTEXT)
    const success = props.notification.success
    const toggle = props.notification.toggle
    const title = props.notification.title 
    const message = props.notification.message
    const button_label = props.notification.button_label
    const callb = props.notification.callb ? props.notification.callb : () => {}
    
    //Setting maxWidth and maxHeight of fixed container to page container
    useEffect(() => {
        const app_fixed_container = document.getElementById("app_overlay_fixed") as HTMLDivElement
        const app_content_container = document.getElementById("app_content_container") as HTMLDivElement

        const observer = new ResizeObserver(() => {
            
            if(app_fixed_container && app_content_container && props.notification) {
                
                app_fixed_container.style.maxHeight = `${app_content_container.offsetHeight}px`
                app_fixed_container.style.maxWidth = `${app_content_container.offsetWidth}px`
            }
            
        })

        observer.observe(app_content_container)
        
        return(() => {
            observer.unobserve(app_content_container)
        })

    }, [props.notification])

    //Button function
    function button_func() {
        callb()
        
        APP.create_notification({
            toggle: false,
            success: false,
            title: null,
            message: null,
            button_label: null,
            callb: () => {}
        })
    }

    return (
        <>
            <AnimatePresence exitBeforeEnter>
                {toggle &&

                    <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2}}} exit={{opacity: 0, transition: {duration: .2}}} className="app_overlay_fixed" id="app_overlay_fixed">
                    
                        <motion.div initial={{scale: .8}} animate={{scale: 1}} exit={{scale: .8}} className={`${success? "notification_success_container" : "notification_error_container"}`}>
                            
                            <h1>{title}</h1>
                            <p>{message}</p>
                            <button onClick={button_func}>{button_label}</button>
                        
                        </motion.div>
                    </motion.div>

                }
            </AnimatePresence>

        </>
    );
}
