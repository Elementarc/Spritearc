import Image from 'next/image';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    loading?: boolean | null | undefined,
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

const Button: React.FC<IButton> = ({btnLabel, timer, loading, onClick, ...props }) => {
    const buttonRef = useRef<null | HTMLButtonElement>(null)
    
    async function btnOnClick(e: any) {
        buttonRef.current?.blur()
        if(onClick && !loading && !timer) {
            await onClick()
        }
    }
    
    return (
        <div className={`button_container`}>
            {loading && !timer &&
                <div className="spinner_container">
                    <div className='image_container'>
                        <Image unoptimized={true}  src={`/images/loading_fast.gif`} layout="fill" />
                    </div>
                </div>
            }
            <button {...props} type='button' ref={buttonRef} style={loading ? {color: "rgba(0,0,0,0)"} : {color: "rgba(0,0,0,1)"}} onClick={async(e) => {await btnOnClick(e)}} className={props.className ?? ""}>
                {timer 
                    ? `${timer}`
                    : `${btnLabel}`
                } 
            </button>
            
        </div>
        
    );
};

export default Button

