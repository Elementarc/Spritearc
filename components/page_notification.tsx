import { AnimatePresence, motion } from 'framer-motion';
import React, {useState, useContext} from 'react';
import { App_context, Notification } from '../types';
import { APP_CONTEXT } from './layout';
import Page_overlay_fixed from './page_overlay_fixed';

export default function Page_notification(props: Notification) {
    const APP: App_context = useContext(APP_CONTEXT)
    const title = props.title? props.title : ""
    const message = props.message? props.message : ""
    const button_label = props.button_label? props.button_label: ""

    return (
        <>
            <Page_overlay_fixed page_id={props.page_id}>
                <motion.div key="page_notification_container" initial={{scale: .8}} animate={{scale: 1}} exit={{scale: .8}} className="notification_container">
                    <h1>{title}</h1>
                    <p>{message}</p>
                    <button>{button_label}</button>
                </motion.div>
            </Page_overlay_fixed>
        </>
    );
}
