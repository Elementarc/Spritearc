
import React, {useEffect, useContext} from 'react';
import {App_context, App_navigation_context_type} from "../../types"
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import NavigationRenderer from '../navigation';
import Device_context_provider from '../../context/device_context_provider';
import Navigation_context_provider, {Navigation_context} from '../../context/navigation_context_provider';
import Cookie_alert from '../cookie_alert';
import Page from './page';
import PopupProvider from '../../context/popupProvider';


export default function Layout({children}: any ) {
    const router = useRouter()
    //Disabling auto scroll when going back history

    useEffect(() => {
        history.scrollRestoration = 'manual'
        router.beforePopState((state) => {
            state.options.scroll = false;
            return true;
        });
    }, [router])

    //Function that will be triggert everytime a page unmounts
    function on_unmount() {
        document.documentElement.style.scrollBehavior = "unset"
        window.scrollTo(0, 0)
    }
    
    const APP: App_context = {
        app_content_element: () => {return document.getElementById("app_content_container") as HTMLDivElement},
    }

    return (
        <Device_context_provider>
            <Navigation_context_provider>
                    <PopupProvider>
                        <div className="app_container" id="app_container">

                            <NavigationRenderer/>

                            <div className="app_content_container" id="app_content_container">


                                <App_content_blur/>

                                <AnimatePresence exitBeforeEnter onExitComplete={on_unmount}>
                                    <motion.main key={router.pathname} initial={{ opacity: 0}} animate={{opacity: 1, transition: {duration: 0.25}}} exit={{opacity: 0, transition: {duration: 0.1}}}>
                                        <Page>
                                            {children}
                                        </Page>
                                    </motion.main>
                                </AnimatePresence>

                            </div>
                            
                            <Cookie_alert/>
                        </div>
                    </PopupProvider>
            </Navigation_context_provider>
        </Device_context_provider>
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
