import React, {useEffect, useState} from "react"
import { useAnimation, motion } from "framer-motion"
import { useRef } from "react"
import { capitalize_first_letter_rest_lowercase } from "../lib/custom_lib"
import ExpandIcon from "../public/icons/ExpandIcon.svg"

export function Drop_down(props: {label: string, reset_option: string, options: string[], active_state: string | null, set_active_state: React.Dispatch<React.SetStateAction<string | null>>}) {
	const options = [props.reset_option, ...props.options ]
	const label = props.label
	const active_state = props.active_state
	const set_active_state = props.set_active_state
	const [state, set_state] = useState(false)
	const menu_animation = useAnimation()
	const refs = useRef<any>([])
    //Animation for licens container when opening / closing

    useEffect(() => {
		let timer: any
        const selection_container = refs.current["selection_container"] as HTMLDivElement
		const type_menu_animation = menu_animation as any
        if(state === true) {

            type_menu_animation.start({
				transition: {duration: .1, type: "tween"},
                height: "auto",
            })

			
			timer = setTimeout(() => {
				type_menu_animation.start({
					overflowY: "overlay"
				})
			}, 100);
			

        } else {

            menu_animation.start({
				transition: {duration: .1, type: "tween"},
                height: "0px",
                overflowY: "hidden"
            })
        }
        
		return(() => {
			if(selection_container) selection_container.scrollTo(0,0);

			clearTimeout(timer)
		})
    }, [state, menu_animation, refs])
	
	function set_new_active_state(option: string) {

        if(option.toLowerCase() === props.reset_option.toLowerCase()) return set_active_state(null)
        set_active_state(option.toLowerCase())
	}

    function generate_options_jsx() {
        let options_jsx = []
        for(let option of options) {
    
            options_jsx.push(
                <li key={`${label}_${option}`} onClick={() => {set_new_active_state(option); set_state(!state)}}>{`${option}`}</li>
            )
            
        } 

        return options_jsx
    }

	return(
		<div onMouseLeave={() => set_state(false)} className='drop_down_container'>

			<div onClick={() => set_state(!state)} className='option_header'>
                    
                {active_state &&
                    <p>{active_state ? capitalize_first_letter_rest_lowercase(active_state)  : capitalize_first_letter_rest_lowercase(props.label) }</p>
                }
                {active_state === null &&
                    <p>{capitalize_first_letter_rest_lowercase(props.label)}</p>
                }

                <ExpandIcon/>
            </div>

            <motion.div ref={(el) => {refs.current["selection_container"] = el}} animate={menu_animation} className='selection_container' >
                <ul>
                    {generate_options_jsx()}
                </ul>
            </motion.div>

        </div>
	)
}