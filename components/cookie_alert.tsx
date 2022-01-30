import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';

export default function Cookie_alert() {
    const [acknowledged_cookie, set_acknowledged_cookie] = useState<null | boolean>(null)

    useEffect(() => {
        const acknowledged = localStorage.getItem("acknowledged_cookie")

        if(acknowledged === "true") {
            return set_acknowledged_cookie(true)
        } else {
            return set_acknowledged_cookie(false)
        }

    }, [set_acknowledged_cookie])

    function acknowledge_cookie () {
        localStorage.setItem("acknowledged_cookie", "true")
        set_acknowledged_cookie(true)
    }

    const animation = useAnimation()
    useEffect(() => {
        let timer: any
        timer = setTimeout(() => {
            if(acknowledged_cookie === false ) {
                animation.start({
                    transition: {duration: 1},
                    y: 0,
                })
            } else {
                animation.start({
                    transition: {duration: 1},
                    y: 100,
                })
            }
        }, 2000);
        
        return(() => {
            clearTimeout(timer)
        })
        
    }, [acknowledged_cookie])
    return (
        <>
            <AnimatePresence exitBeforeEnter>
                {acknowledged_cookie === false &&
                    <motion.div initial={{y: 100}} animate={animation} exit={{y: 100, transition: {duration: .5}}} className='cookie_alert_container'>
                        <div className='cookie_text'>
                            <p>We use cookies to ensure you will have the best user experience. You can read more about it<Link href={"/cookies"} scroll={false}>{` here.`}</Link></p>
                            
                        </div>
                        
                        <div className='cookie_button'>
                            <button onClick={acknowledge_cookie}>Got it</button>
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
        </>
    );
}
