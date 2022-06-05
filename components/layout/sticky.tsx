import React from 'react';

export default function Sticky(props: {top?: string, zIndex?: number, children: any}) {
    const top = props.top ?? '0rem'
    const zIndex = props.zIndex ?? '0'
    return (
        <div onContextMenu={(e) => e.preventDefault()} style={{
                top: top,
                zIndex: zIndex,
            }} className='sticky_container'
        >
            {props.children}
        </div>
    );
}
