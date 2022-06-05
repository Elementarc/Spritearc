import React, { useEffect, useRef, useState } from 'react';
import Overlay from './overlay';

/**
 * Creates a container that will move alongside the screen when scrolling. 
 * Component does use it's most nearest relative parent to set it's initial position. Recommended would be at the top of the screen.
 * @param zIndex is used to create different layers of viewports. 
 */
export default function ViewPort(props: {zIndex?: number, children?: any}) {
    const ref = useRef<null | HTMLElement>(null)
    
    useEffect(() => {
        const element = ref.current
        
        if(!element) return
        const parent = element.parentElement
        if(!parent) return

        const observer = new ResizeObserver(() => {
            element.style.maxHeight = `${parent.offsetHeight}px`
        })

        observer.observe(parent)
        return(() => {
            observer.unobserve(parent)
        })
    }, [])

    return (
        <Overlay zIndex={props.zIndex}>
            <div ref={(el) => {ref.current = el}} className='view'>
                {props.children}
            </div>
        </Overlay>
    );
}
