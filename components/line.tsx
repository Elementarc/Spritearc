import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Line({display, opacity}: {display: boolean, opacity: number}) {

    return (
            <div className='line_wrapper'>
                <AnimatePresence exitBeforeEnter>
                    {display &&
                    <motion.div initial={{opacity: 0}} animate={{opacity: opacity, transition: {duration: .2, delay: .1}}} exit={{opacity: 0}} className='line' />
                    }
                </AnimatePresence>
            </div>
    );
}
