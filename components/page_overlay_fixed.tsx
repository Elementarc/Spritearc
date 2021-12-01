import { AnimatePresence , motion} from 'framer-motion';
import React, {useState, useEffect} from 'react';

export default function Page_overlay_fixed(props: {page_id: string | null, className?: string, children: any }) {
    const page_id = props.page_id ? props.page_id : ""
    const className = props.className ? props.className : "page_overlay_fixed"
    
    //Setting maxWidth and maxHeight of fixed container to page container
    useEffect(() => {
        const page_message_container_fixed = document.getElementById(className) as HTMLDivElement
        const page = document.getElementById(page_id) as HTMLDivElement

        const observer = new ResizeObserver(() => {
            page_message_container_fixed.style.height = `${window.innerHeight}px`
            page_message_container_fixed.style.maxHeight = `${page.offsetHeight}px`
            page_message_container_fixed.style.maxWidth = `${page.offsetWidth}px`
        })

        observer.observe(page)
        
        return(() => {
            observer.unobserve(page)
        })
    }, [])
    
    return (
        <>
            
            <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2}}} exit={{opacity: 0, transition: {duration: .2}}} className={`page_overlay_fixed ${className}`} id={className}>
                {props.children}
            </motion.div>

        </>
    );
}
