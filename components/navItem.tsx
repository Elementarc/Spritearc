import React, {useContext, useEffect} from "react"
import { useAnimation, motion } from "framer-motion"
import { useRouter } from "next/router"
import { Navigation_context } from "../context/navigation_context_provider"

interface INavItemProps {
    label: string
    icon: any
    link: string
    new?: string,
}

export default function NavItem(props: INavItemProps) {
    const Navigation: any = useContext(Navigation_context)
    const router = useRouter()
    const navItemLabelAnimation = useAnimation()
    const goTo = () => {
        router.push(`${props.link}`, `${props.link}` , {scroll: false})
        Navigation.set_nav_state(false)
    }
    
    //Showing Labels of navItems when toggling navState
    useEffect(() => {
        if(Navigation.nav_state === true) {
            navItemLabelAnimation.start({
                transition: {duration: 0.2},
                opacity: 1,
            })
        } else {
            navItemLabelAnimation.start({
                transition: {duration: 0.2},
                opacity: 0,
            })
        }
    }, [Navigation.nav_state, navItemLabelAnimation]);
    

    function setClassname() {
        if(router.asPath.toLowerCase() === props.link.toLowerCase()) return "active"
        else return "inactive"
    }
    const Icon = props.icon
    return(
        <motion.div onClick={goTo} className={`nav_item_container ${setClassname()}`} >
            <div className="icon_container">
                <Icon className="icon_svg"/>

                {props.new && <h2 className="small">{props.new}</h2>}
            </div>

               {/*  <div ref={labelRef} className="hover_label">
                    <p className={`default ${setClassname()}`}>{props.label}</p>
                </div> */}
            <p className="default">{props.label}</p>
            <span />
        </motion.div>
    )
}