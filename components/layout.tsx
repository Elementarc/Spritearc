
import React, {useState, useEffect} from 'react';
import {AppContext} from "../types"
import Navigation from './navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
export const appContext: any = React.createContext(null)

export default function Layout( { children }: any) {
    const Router = useRouter()
    
    //Setting IsDesktop to tell other Components if App is mobileDevice or DesktopDevice
    const [isDesktop, setIsDesktop] = useState<undefined | boolean>(undefined)
    const [NavState, setNavState] = useState(false);
    //Context that gets Send to all childs
    const appContextObj: AppContext = {
        isDesktop: isDesktop,
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

            if(deviceWidth > 1024){
                setIsDesktop(true)
            } else {
                setIsDesktop(false)
            }
        }
        checkApplicationWidth()
        
        window.addEventListener("resize", checkApplicationWidth)
        return(() => {
            window.removeEventListener("resize", checkApplicationWidth)
        })
    }, []);
    
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