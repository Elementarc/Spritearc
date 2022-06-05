import React from 'react';

export default function Conditional(props: {checkFunc: () => boolean, children: any}) {
    const render = props.checkFunc()
    if(!render) return null
    
    return (
        <>
            {render &&
                props.children
            }
        </>
    );
}
