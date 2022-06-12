import React from 'react'
import ViewPort from './viewPort';
import PopupRenderer from '../popup';

/**
 * A Simple Component that is used as a page. Used in layout to wrap all content in a page wrapper.
 * @param param0 
 * @returns 
 */
export default function Page({children}: any) {
    
    return (
        <div className='page'>

            {children}

            <ViewPort >
                <PopupRenderer />
            </ViewPort>

            <ViewPort zIndex={-1}>
                <div className='background_gradient' />
            </ViewPort>
        </div>
    );
}

