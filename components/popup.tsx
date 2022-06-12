import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {AnimatePresence, motion} from "framer-motion";
import { PopupProviderContext } from '../context/popupProvider';
import Button from './button';
import useButtonEnter from '../hooks/useButtonEnter';

export interface IPopup {
    success?: boolean,
    timer?: number,
    title?: string, message: string,
    buttonLabel?: string,
    cancelLabel?: string, 
    buttonOnClick?: (signal: AbortSignal) => any,
    cancelOnClick?: (signal: AbortSignal) => any,
    COMPONENT?: JSX.Element
}

export enum EPopupType {
    SUCCESS = "success",
    ERROR = "error",
    DEFAULT = "default"
}

export default function PopupRenderer() {
    const popupProvider = useContext(PopupProviderContext)
    if(!popupProvider) return null
    const popup = popupProvider.popup
    const setPopup = popupProvider.setPopup
    const random_number = Math.random()

    return (
        <AnimatePresence exitBeforeEnter>
            {popup && <Popup key={`popup_${random_number}`} popup={popup} setPopup={setPopup}/>}
        </AnimatePresence>
    );
}

/**
 * A simple popup component that does display a small info box of given properties. You can also pass a component and it will make sure to only render that component.
 * @param props.COMPONENT If given, will only render component.
 * @param props.timer will set a timer when the main button will be available to click.
 * @param props.success does change the theme of the info box. Negative / successful infobox.
 * @param props.buttonOnClick callback function that will be triggert when button is clicked. If callback given it wont close on its own. You would have call setPopup(null) in its callback.
 * @returns 
 */
function Popup(props: {popup: IPopup, setPopup: React.Dispatch<React.SetStateAction<IPopup | null>>}) {
    const [timer, setTimer] = useState(props?.popup?.timer ?? 0)
    const [loading, setLoading] = useState(false)
    const abortControllerRef = useRef(new AbortController())
    const title = props.popup.title 
    const message = props.popup.message 
    const buttonLabel = props.popup.buttonLabel 
    const cancelLabel = props.popup.cancelLabel 
    const success = props.popup.success 
    const COMPONENT = props.popup.COMPONENT
    const buttonOnClick = props.popup.buttonOnClick
    const cancelOnClick = props.popup.cancelOnClick

    const onClick = useCallback(async() => {
        if(timer) return

        if(buttonOnClick) {
            setLoading(true)
            await buttonOnClick(abortControllerRef.current.signal)
        } else {
            props.setPopup(null)
        }
    }, [timer])
    
    //memoized because used in event when pressing ESC to close popup
    const memoCancelFunc = useCallback(() => {
        if(cancelOnClick) cancelOnClick(abortControllerRef.current.signal)
        props.setPopup(null)

    }, [props.setPopup, cancelOnClick])

    //Timer
    useEffect(() => {
        let timerId: NodeJS.Timer

        if(timer > 0) {
            timerId = setTimeout(() => {
                setTimer(timer - 1)
            }, 1000);
        }

        

        return () => {
            clearTimeout(timerId)
        }
    }, [timer])
    
    useEffect(() => {
        function cancelPopup(e: any) {
            if(e.keyCode !== 27) return
            memoCancelFunc()
        }
        window.addEventListener("keyup", cancelPopup)
        return() => {
            window.removeEventListener("keyup", cancelPopup)
            abortControllerRef.current.abort()
        }
    }, [memoCancelFunc])

    useEffect(() => {

      return () => {
        abortControllerRef.current.abort()
      };
    }, [abortControllerRef])
    
    return (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2}}} exit={{opacity: 0, transition: {duration: .2}}} className='popup'>
            <motion.div initial={{scale: .8}} animate={{scale: 1}} exit={{scale: .8}} className='popup_content_container'>
                {!COMPONENT &&
                    <>
                        {title && <h1 className={`big ${success ? 'success' : 'error'}`}>{title}</h1>}

                        {message && <p className='default'>{message}</p>}

                        {buttonLabel && 
                            <Button onClick={onClick} timer={timer} className={success ? 'primary default' : 'error default'} btnLabel={buttonLabel} loading={loading} />
                        }

                        <h4 onClick={memoCancelFunc}>{cancelLabel ?? "Close window"}</h4>
                        
                    </>
                }
                {COMPONENT && COMPONENT}
            </motion.div>
            <div onClick={memoCancelFunc} className='popup_background'></div>
        </motion.div>
    );
}






