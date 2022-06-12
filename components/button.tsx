import Image from 'next/image';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { PopupProviderContext } from '../context/popupProvider';
import useButtonEnter from '../hooks/useButtonEnter';



interface IButton {
    loading?: boolean | null | undefined,
    className?: string,
    tabIndex?: number;
    btnLabel: string,
    timer?: number,
    onClick?: (e?: any) => any
}

/**
 * Button component that do a lot of different things. 
 * @param loading if truthy displays a loading animation, otherwise just the btnLabel
 * @param btnLabel the button label that should be used for that button.
 * @param className used to give the button element it's classnames.
 * @param onClick function that gets triggert when button is clicked.
 * @returns 
 */
export default function Button(props: IButton) {
    const loading = props.loading
    const buttonRef = useRef<null | HTMLButtonElement>(null)
    
    async function btnOnClick(e: any) {
        buttonRef.current?.blur()
        if(props?.onClick && !loading && !props.timer) {
            await props.onClick()
        }
    }
    
    return (
        <div className={`button_container`}>
            {props.loading && !props.timer &&
                <div className="spinner_container">
                    <div className='image_container'>
                        <Image unoptimized={true}  src={`/images/loading_fast.gif`} layout="fill" />
                    </div>
                </div>
            }
            <button tabIndex={props.tabIndex ?? undefined} type='button' ref={buttonRef} style={loading ? {color: "rgba(0,0,0,0)"} : {color: "rgba(0,0,0,1)"}} onClick={async(e) => {await btnOnClick(e)}} className={props.className ?? ""}>
                {props.timer 
                    ? `${props.timer}`
                    : `${props.btnLabel}`
                } 
            </button>
            
        </div>
        
    );
}
