
import React, {useState, useEffect} from 'react';
import {AppContext, Pack} from "../types"
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
//Components
import Navigation from './navigation';
import app from 'next/app';
export const appContext: any = React.createContext(null)

export default function Layout( { children }: any) {
    const Router = useRouter()
    
    //Setting IsDesktop to tell other Components if App is mobileDevice or DesktopDevice
    const [isMobile, setIsMobile] = useState<undefined | boolean>(undefined)
    const [NavState, setNavState] = useState(false);
    //Context that gets Send to all childs
    const appContextObj: AppContext = {
        isMobile: isMobile,
        nav:  {
            navState: NavState,
            setNavState: setNavState,
        }
    }
    //Checks if Application IsDesktop or not
    useEffect(() => {
        history.scrollRestoration = "manual"
        function checkApplicationWidth(){
            const deviceWidth = window.innerWidth

            if(deviceWidth > 768){
                setIsMobile(false)
            } else {
                setIsMobile(true)
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
        if(NavState === false) {
            app_content_blur.style.opacity = "0"
            app_content_blur.style.pointerEvents = "none"
        } else {
            app_content_blur.style.opacity = ".7"
            app_content_blur.style.pointerEvents = "all"
        }
    }, [NavState])
    return (
        <appContext.Provider value={appContextObj}>
            <div className="app_container" id="app_container">
                <Navigation/>
                <div className="app_content_container" id="app_content_container">
                    <div onClick={() => {setNavState(false)}} className="app_content_blur" id="app_content_blur"/>
                    <AnimatePresence exitBeforeEnter onExitComplete={() => window.scrollTo(0, 0)}>
                        <motion.main key={Router.pathname} initial={{ opacity: 0}} animate={{opacity: 1, transition: {duration: 0.25}}} exit={{opacity: 0, transition: {duration: 0.1}}}>
                            {children}
                        </motion.main>
                    </AnimatePresence>
                </div>
            </div>
        </appContext.Provider>
    );
}

