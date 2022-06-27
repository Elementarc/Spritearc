import React, { useState } from 'react';
import {motion, AnimatePresence} from "framer-motion"

interface IToggleIconProps {
    iconOne: React.ElementType,
    iconTwo: React.ElementType,
    state: boolean,
    toggleNav: () => void,
    iconClassName?: string,
}

export default function ToggleIcon({iconOne, iconTwo, state, toggleNav, iconClassName}: IToggleIconProps) {
    const IconOne = iconOne
    const IconTwo = iconTwo

    return (
        <motion.div className="toggle_icon_container">

            <AnimatePresence exitBeforeEnter>
                
                {state === true &&
                    <motion.div key="menu" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.1}}}>
                        <IconOne onClick={toggleNav} className={`icon_svg ${iconClassName ?? ''}`} />
                    </motion.div>
                }

                {state === false &&
                    <motion.div key="close" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.1}}}>
                        <IconTwo onClick={toggleNav} className={`icon_svg ${iconClassName ?? ''}`} />
                    </motion.div>
                }
                
            </AnimatePresence>
        </motion.div>
    );
}
