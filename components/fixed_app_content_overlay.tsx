import React, {useContext, useEffect} from 'react';
import {motion} from "framer-motion"
import { APP_CONTEXT } from './layout/layout';

export default function Fixed_app_content_overlay({children}: any) {
    const APP: any = useContext(APP_CONTEXT)

    //Setting maxWidth and maxHeight of fixed container to page container
    useEffect(() => {
        const app_fixed_container = document.getElementById("fixed_app_content_overlay") as HTMLDivElement
        const app_content_container = APP.app_content_element() as HTMLDivElement

        const observer = new ResizeObserver(() => {
            
            if(app_fixed_container && app_content_container) {
                
                app_fixed_container.style.maxHeight = `${app_content_container.offsetHeight}px`
                app_fixed_container.style.maxWidth = `${app_content_container.offsetWidth}px`
            }
            
        })

        observer.observe(app_content_container)
        
        return(() => {
            observer.unobserve(app_content_container)
        })

    }, [APP])

    return (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1, scale: 1, transition: {duration: .2}}} exit={{opacity: 0, transition: {duration: .2}}} className="fixed_app_content_overlay" id="fixed_app_content_overlay">

            {children}
            
        </motion.div>
    );
}
