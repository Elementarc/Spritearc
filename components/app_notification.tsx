import React, {useContext, useEffect} from 'react';
import { AnimatePresence } from 'framer-motion';
import { App_notification_context } from '../context/app_notification_context_provider';
import {motion} from "framer-motion";
import { NOTIFICATION_ACTIONS } from "../context/app_notification_context_provider"
import { App_notification_context_type } from '../types';
import { APP_CONTEXT } from './layout';
//Component that renders an App notification
export default function App_notification() {
    const App_notification: App_notification_context_type = useContext(App_notification_context)
    const APP: any = useContext(APP_CONTEXT)
    const notification = App_notification.app_notification
     
    //Setting maxWidth and maxHeight of fixed container to page container
    useEffect(() => {
        const app_fixed_container = document.getElementById("app_notification_container") as HTMLDivElement
        const app_content_container = APP.app_content_element() as HTMLDivElement

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

    }, [notification, APP])

    //Button function
    function button_func() {
        notification.callb ? notification.callb() : () => {}
        App_notification.dispatch_app_notification({type: NOTIFICATION_ACTIONS.CLOSE})
    }

    return (
        <AnimatePresence exitBeforeEnter>
            {notification.toggle &&

                <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2}}} exit={{opacity: 0, transition: {duration: .2}}} className="app_notification_container" id="app_notification_container">
                
                    <motion.div initial={{scale: .8}} animate={{scale: 1}} exit={{scale: .8}} className={`notification_container ${notification.success? "notification_success_container" : "notification_error_container"}`}>
                        
                        <h1>{notification.title}</h1>
                        <p>{notification.message}</p>
                        
                        <button onClick={button_func}>{notification.button_label}</button>
                    
                    </motion.div>
                    
                </motion.div>
            }
            
        </AnimatePresence>
    );
}


