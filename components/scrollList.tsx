import React, { MutableRefObject, useEffect, useRef } from 'react';
import { EBreakpoints } from '../lib/breakpoints';
import Overlay from './layout/overlay';
import Sticky from './layout/sticky';

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
    const shadowRefs = useRef<any>([])
    if(!ref) return null

    //Animation to display buttonShadow when scrolling in navigation for better UX
    useEffect(() => {
        const scrollList = ref.current
        if(!scrollList) return
        const shadows = shadowRefs.current
        
        const eventHandler = () => {
            const topShadow = shadows["top_shadow"] as HTMLDivElement
            if(!topShadow) return
            const bottomShadow = shadows["bottom_shadow"] as HTMLDivElement
            if(!bottomShadow) return
            /* if(window.innerWidth <= EBreakpoints.MOBILE) return
            console.log(scrollList.scrollTop) */
            if(scrollList.clientHeight === scrollList.scrollHeight) {
                topShadow.style.boxShadow = `unset`
                bottomShadow.style.boxShadow = `unset`
                return
            }

            if(scrollList.scrollTop > 0) {
                topShadow.style.boxShadow = `0px 3px 24px 5px rgba(0, 0, 0, .65)`
            } else {
                topShadow.style.boxShadow = `0px 3px 24px 5px rgba(0, 0, 0, 0)`
            }

            if(scrollList.scrollTop < (scrollList.scrollHeight - scrollList.clientHeight)) {
                bottomShadow.style.boxShadow = `0px -3px 24px 5px rgba(0, 0, 0, .7)`
            } else {
                bottomShadow.style.boxShadow = `0px 3px 24px 5px rgba(0, 0, 0, 0)`
            }
            
            topShadow.style.transform = `translateY(${scrollList.scrollTop}px)`
            bottomShadow.style.transform = `translateY(${scrollList.scrollTop}px)`
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
    }, [ref, shadowRefs])

    return (
        <div ref={ref} className={`scroll_list_container ${className ?? ''}`}>
            <div ref={(el) => shadowRefs.current["top_shadow"] = el} className='top_shadow' />
            {children}
            <div ref={(el) => shadowRefs.current["bottom_shadow"] = el} className='bottom_shadow' />
        </div>
    );
}
