import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {AnimatePresence, motion} from "framer-motion";
import { PopupProviderContext } from '../context/popupProvider';
import Button from './button';
import useButtonEnter from '../hooks/useButtonEnter';
import KingHeader from './kingHeader';

export interface IPopup {
    success?: boolean,
    timer?: number,
    title?: string, 
    message?: string,
    buttonLabel?: string,
    cancelLabel?: string, 
    component?: JSX.Element
    buttonOnClick?: (signal: AbortSignal) => any,
    cancelOnClick?: () => any,
    
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
 * A simple popup component that does display a small info box of given properties.
 * @param props.COMPONENT If given, will only render component.
 * @param props.timer will set a timer when the main button will be available to click.
 * @param props.success does change the theme of the info box. Negative / successful infobox.
 * @param props.buttonOnClick callback function that will be triggert when button is clicked. If callback given it wont close on its own. You would have call setPopup(null) in its callback.
 * @returns 
 */
function Popup({popup, setPopup}: {popup: IPopup, setPopup: React.Dispatch<React.SetStateAction<IPopup | null>>}) {
    const [delay, setDelay] = useState(popup.timer ?? 0)
    const [loading, setLoading] = useState(false)
    const abortControllerRef = useRef<null | AbortController>(null)

    const onClick = useCallback(async() => {
        abortControllerRef.current = new AbortController()
        if(delay) return

        if(popup.buttonOnClick) {
            setLoading(true)
            await popup.buttonOnClick(abortControllerRef.current.signal)
        } else {
            setPopup(null)
        }
    }, [delay, setPopup, popup])
    
    //memoized because used in event when pressing ESC to close popup
    const memoCancelFunc = useCallback(() => {
        if(popup.cancelOnClick) popup.cancelOnClick()
        setPopup(null)

    }, [setPopup, popup])

    //Timer
    useEffect(() => {
        let timerId: NodeJS.Timer
        if(delay > 0) {
            timerId = setTimeout(() => {
                setDelay(delay - 1)
            }, 1000);
        }

        return () => {
            clearTimeout(timerId)
        }
    }, [delay])
    
    useEffect(() => {
        function cancelPopup(e: any) {
            if(e.keyCode !== 27) return
            memoCancelFunc()
        }
        window.addEventListener("keyup", cancelPopup)
        return() => {
            window.removeEventListener("keyup", cancelPopup)
        }
    }, [memoCancelFunc])

    useEffect(() => {

      return () => {
        if(abortControllerRef) abortControllerRef?.current?.abort()
      };
    }, [abortControllerRef])
    
    return (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2}}} exit={{opacity: 0, transition: {duration: .2}}} className='popup'>
            <motion.div initial={{scale: .8}} animate={{scale: 1}} exit={{scale: .8}} className='popup_content_container'>
                <>
                    {popup.title && <KingHeader className={`${popup.success === undefined ? 'default' : popup.success ? 'success' : 'error'}`} title={popup.title}/>}

                    {popup.message && <p className='default'>{popup.message}</p>}

                    {popup.component && popup.component}

                    {popup.buttonLabel && 
                        <Button onClick={onClick} timer={delay} className={`${popup.success === undefined ? 'primary default' : popup.success ? 'primary default' : 'error default'}`} btnLabel={popup.buttonLabel} loading={loading} />
                    }

                    <h4 onClick={memoCancelFunc}>{popup.cancelLabel ?? "Close window"}</h4>
                    
                </>
            </motion.div>
            <div onClick={memoCancelFunc} className='popup_background'></div>
        </motion.div>
    );
}






