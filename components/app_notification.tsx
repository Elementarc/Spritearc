import React, {useContext, useEffect, useRef} from 'react';
import { AnimatePresence } from 'framer-motion';
import { App_notification_context } from '../context/app_notification_context_provider';
import {motion} from "framer-motion";
import { NOTIFICATION_ACTIONS } from "../context/app_notification_context_provider"
import { App_notification_context_type } from '../types';
import { APP_CONTEXT } from './layout';

//Component that renders an App notification
export default function App_notification() {
    const App_notification: App_notification_context_type = useContext(App_notification_context)
    const button_ref = useRef<any>(null)
    const notification = App_notification.notification
    let timer: any

    //Button function
    function button_func() {
        notification.callb ? notification.callb() : () => {}
        App_notification.dispatch({type: NOTIFICATION_ACTIONS.CLOSE, payload: null})
        
        
    }

    //Eventlistener to click okay button when pressing enter
    useEffect(() => {
        if(!notification.toggle) return
        
        function click_button(e: any) {
            if(!button_ref.current) return

            if(e.keyCode !== 13) return
            button_ref.current.click()
        }
        
        window.addEventListener("keyup", click_button)
        return(() => {
            window.removeEventListener("keyup", click_button)
        })
    }, [notification])

    return (
        <AnimatePresence exitBeforeEnter>
            {notification.toggle &&
                    
                <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2}}} exit={{opacity: 0, transition: {duration: .2}}} className="app_notification_container" id="app_notification_container">
                
                    <motion.div initial={{scale: .8}} animate={{scale: 1}} exit={{scale: .8}} className={`notification_container ${notification.success? "notification_success_container" : "notification_error_container"}`}>
                        
                        <h1>{notification.title}</h1>
                        <p>{notification.message}</p>
                        
                        <button ref={button_ref} onClick={button_func}>{notification.button_label}</button>
                    
                    </motion.div>
                    
                </motion.div>
            }
            
        </AnimatePresence>
    );
}


