import React from 'react'
import { Nav_shadow } from '../navigation';

/**
 * A Simple Component that should wrap the content that actually takes space in the page. Please do not put The footer in here ;).
 * @param param0 
 * @returns 
 */
export default function PageContent({children}: any) {
    
    return (
        <div onContextMenu={(e) => {e.preventDefault()}} className='page_content'>

            {children}
            <Nav_shadow/>

        </div>
    );
}

