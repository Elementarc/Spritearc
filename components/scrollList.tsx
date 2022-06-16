import React, { MutableRefObject, useEffect, useRef } from 'react';

interface IScrollListProps {
    children: any
    className?: string
    innerRef?: React.MutableRefObject<HTMLDivElement | null>
}

/**
 * Displays a shadow at the correct side whenever container is scrolled.
 */
export default function ScrollList({children, className}: IScrollListProps) {
    const ref = useRef<null | HTMLDivElement>(null)
    if(!ref) return null

    //Animation to display buttonShadow when scrolling in navigation for better UX
    useEffect(() => {
        const scrollList = ref.current
        if(!scrollList) return

        const eventHandler = () => {
            if(scrollList.scrollHeight === scrollList.clientHeight) {
                scrollList.style.boxShadow = "unset"
                return
            }

            if(scrollList.scrollHeight !> scrollList.clientHeight) {
                if(scrollList.scrollTop > 0) {
                    scrollList.style.boxShadow = "inset 0px 10px 10px -10px rgba(0, 0, 0, .7)"
    
                } else {
                    scrollList.style.boxShadow = "inset 0px -10px 10px -10px rgba(0, 0, 0, .7)"
                }
            }
            
        }
        eventHandler()
        
        const observer = new ResizeObserver( () => {
            eventHandler()
        })

        observer.observe(scrollList)
        scrollList.addEventListener("scroll", eventHandler)
        return() => {
            scrollList.removeEventListener("scroll", eventHandler) 
            observer.unobserve(scrollList)
        }
    }, [ref])
    return (
        <div ref={ref} className={`scroll_list_container ${className ?? ''}`}>
            {children}
        </div>
    );
}
