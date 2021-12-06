import React, {useContext, useEffect} from 'react';
import { AnimatePresence } from 'framer-motion';
import { App_notification_context } from '../context/app_notification_provider';
import {motion} from "framer-motion";
import { NOTIFICATION_ACTIONS } from "../components/layout"

export default function App_notification() {
    const App_notification: any = useContext(App_notification_context)
    const notification = App_notification.app_notification
     
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
        App_notification.dispatch_app_notification({type: NOTIFICATION_ACTIONS.CLOSE})
    }

    return (
        <AnimatePresence exitBeforeEnter>
            {notification.toggle &&

                <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2}}} exit={{opacity: 0, transition: {duration: .2}}} className="app_overlay_fixed" id="app_overlay_fixed">
                
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


