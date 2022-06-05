import React from 'react';

/**
 * Taking absolute position to take all available space. Should be used as an overlay.
 * Can be given an zIndex to create overlay layers.
 * @param props 
 * @returns 
 */
export default function Overlay(props: {zIndex?: number, children: any}) {
    const zIndex = props.zIndex ?? 10;
    return (
        <div style={{zIndex: `${zIndex}`}} onContextMenu={(e) => e.preventDefault()} className='overlay'>
            {props.children}
        </div>
    );
}
