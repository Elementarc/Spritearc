import Image from 'next/image';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { PopupProviderContext } from '../context/popupProvider';



interface IButton {
    loading?: boolean | null | undefined,
    btnClassName?: string,
    containerClassName?: string,
    btnLabel: string,
    id?: string
    clickWithEnter?: boolean
    keyUpCondition?: (e?: any) => boolean
    onClick?: (e?: any) => any
}

/**
 * Button component that do a lot of different things. 
 * @param loading if truthy displays a loading animation, otherwise just the btnLabel
 * @param btnLabel the button label that should be used for that button.
 * @param containerClassName recommended to add when custom styling is needed for the whole container.
 * @param btnClassName used to give the button element it's classnames.
 * @param onClick function that gets triggert when button is clicked.
 * @returns 
 */
export default function Button(props: IButton) {
    const popupContext = useContext(PopupProviderContext)
    const popup = popupContext?.popup
    const clickWithEnter = props.clickWithEnter
    const button = useRef<null | HTMLButtonElement>(null)
    const loading = props.loading

    async function btnOnClick(e: any) {
        if(props?.onClick && !loading) await props.onClick()
    }

    //Eventlistener to trigger button with enter.
    useEffect(() => {
        if(!clickWithEnter) return
        
        function keyEvent(e: any) {
            if(e.keyCode !== 13) return

            switch (button.current?.id) {
                //Pressing enter checks if id of button is popup_button to then click the button.
                case "popup_button": {
                    button.current?.click() 
                    break;
                }
                    
                //Pressing enter does not trigger any button clicks unless there is no popup anymore.
                default: {
                    if(popupContext?.popup) break
                    button.current?.click() 
                    break;
                }
            }
             
        }

        window.addEventListener("keyup", keyEvent)
        return() => {
            window.removeEventListener("keyup", keyEvent)
        }
    }, [button, popup, clickWithEnter])

    return (
        <div className={`button_container ${props.containerClassName ?? ""}`}>
            {props.loading && 
                <div className="spinner_container">
                    <div className='image_container'>
                        <Image unoptimized={true}  src={`/images/loading_fast.gif`} layout="fill" />
                    </div>
                </div>
            }

            <button id={props.id ?? ""} ref={(el) => button.current = el} style={loading ? {color: "rgba(0,0,0,0)"} : {color: "rgba(0,0,0,1)"}} onClick={async(e) => {await btnOnClick(e)}} className={props.btnClassName ?? ""}>
                {props.btnLabel}
            </button>
            
        </div>
        
    );
}
