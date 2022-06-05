import React, {useState, useEffect, Children} from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function Section(props: {label: string, children: any, SectionInfoComponent?: any, }) {
    const [displaySectionContent, setDisplaySectionContent] = useState(true)
    const label = props.label
    const SectionInfoComponent = props.SectionInfoComponent

    const contentAnimation = useAnimation()
    const infoComponentAnimation = useAnimation()
    useEffect(() => {
        if(displaySectionContent) {
            contentAnimation.start({
                height: 'auto',
                transition: {duration: .4}
            })

            infoComponentAnimation.start({
                opacity: 1,
                pointerEvents: "unset",
                transition: {duration: .3},
            })

        } else {
            
            contentAnimation.start({
                height: '0px',
                transition: {duration: .4}
            })

            infoComponentAnimation.start({
                opacity: 0,
                transition: {duration: .3},
                pointerEvents: "none",
            })
        }
    }, [displaySectionContent, infoComponentAnimation, contentAnimation])

    return (
        <div className="section_container">

            <div className='section_info'>
                <h1 onClick={() => {setDisplaySectionContent(!displaySectionContent)}}>{displaySectionContent ? `–` : "+"} {label}</h1>
                <motion.div initial={{opacity: 1}} animate={infoComponentAnimation} className='info_component_wrapper'>
                    {SectionInfoComponent && SectionInfoComponent}
                </motion.div>
            </div>
            
            <motion.div initial={{height: "auto"}} animate={contentAnimation} className='section_content'>
                {props.children}
            </motion.div>

        </div>
    );
}
