import React, { useState, useEffect, useCallback, useReducer} from 'react';
import { Pack } from '../types';
import Link from 'next/link';
import Pack_stars_raiting from './pack_stars_raiting';
import { useAnimation , motion} from 'framer-motion';
import Image from 'next/image';
import Loader from './loading';
import ExpandIcon from "../public/icons/ExpandIcon.svg"
import { capitalize_first_letter_rest_lowercase, check_if_json, SORT_ACTIONS, sort_packs_section } from '../lib/custom_lib';

export default function Packs_section({section_name, api, method, body}: {section_name: string, api: string, method: string, body?: any, sort_action?: string | null | undefined}) {
	const [sort_action, set_sort_action] = useState<null | string | undefined>(null)
	const [packs, set_packs] = useState<null | Pack[] | []>(null)
	const [page, set_page] = useState(1)
	const [toggle_sort_by_state, set_toggle_sort_by_state] = useState(false)
	
	//Checking sessionstorage if sort_action exists. Setting sort_action if yes
	useEffect(() => {
		const sort_action =  sessionStorage.getItem(`${section_name}_sort_action`) ? sessionStorage.getItem(`${section_name}_sort_action`) : null
		set_sort_action(sort_action)
	}, [set_sort_action])

	//Getting packs from server. Setting it aswell
	useEffect(() => {
		async function get_packs() {
			
			const api_response = await fetch(`${api}?page=${page}`, {
				method: method.toUpperCase(),
				headers: {
					"Content-Type": "application/json"
				},
				body: body ? check_if_json(body) ? body: JSON.stringify(body) : null,
			})
			
			if(api_response.status === 200) {
				const response_packs_obj: {packs: Pack[], max_page: number} = await api_response.json()
				
				set_packs(response_packs_obj.packs)

				function toggle_load_more() {

					
					const counter_cointainer = document.getElementById(`${section_name}_load_more_container`) as HTMLDivElement

					if(!counter_cointainer) return
					if(response_packs_obj.max_page === page || response_packs_obj.packs.length === 0) {
						
						counter_cointainer.style.display = "none"
					} else {
						counter_cointainer.style.display = ""
					}
				}
				toggle_load_more()
			} else {
				
				set_packs([])
			}
		}
		get_packs()
	}, [set_packs, page, api, method, body, section_name])
	
	//animation for when clicking Sort by button on a packsection
	const sort_by_animation = useAnimation()
	useEffect(() => {
		
		if(toggle_sort_by_state) {

			sort_by_animation.start({
				overflow: "unset",
			})

		} else {

			sort_by_animation.start({
				overflow: "hidden",
			})

		}

	}, [toggle_sort_by_state, sort_by_animation])

	//Function that sets sort_action when clicking on a sort_item
	function set_sort_action_and_session_storage(sort_action: string | null) {

		if(!sort_action) {
			sessionStorage.removeItem(`${section_name}_sort_action`)
			set_sort_action(null)
		} else {
			sessionStorage.setItem(`${section_name}_sort_action`, sort_action)
			set_sort_action(sort_action)
		}

		set_toggle_sort_by_state(false)
	}

	//Function that Makes section name more beautiful
	function set_section_name(section_name: string) {
		
		try {
			const splitted_section_name = section_name.split(" ")
			let word_arr = [""]
			for(let i = 0; i < section_name.length; i ++) {
				if(splitted_section_name[i]) {
					word_arr.push(capitalize_first_letter_rest_lowercase(splitted_section_name[i]))
				}
				
			}
	
			return word_arr.join(" ")
		} catch( err ) {
			return section_name
		}
		
	}
	
	return (
		<>
			
			<div className='packs_section_container'>

				<div className="packs_section_info">
					<h1>– {set_section_name(section_name)}</h1>

					<motion.div animate={sort_by_animation} className='drop_down_container'>
						<div className='info_container'>
							<div onClick={() => {set_toggle_sort_by_state(!toggle_sort_by_state)}} className='info'>
								<h4>{sort_action ? `Sort by ${sort_action.split("_")[1].toLowerCase()}` : "Sort by"}</h4>
								<ExpandIcon/>
							</div>
						</div>

						<div className='grid_sort_item' onClick={() => {set_sort_action_and_session_storage(null)}}>None</div>
						<div className='grid_sort_item' onClick={() => {set_sort_action_and_session_storage(SORT_ACTIONS.BY_RATING)}}>Rating</div>
						<div className='grid_sort_item' onClick={() => {set_sort_action_and_session_storage(SORT_ACTIONS.BY_RECENT)}}>Recent</div>
						<div className='grid_sort_item' onClick={() => {set_sort_action_and_session_storage(SORT_ACTIONS.BY_DOWNLOADS)}}>Downloads</div>
					</motion.div>

				</div>

				<Pack_previews packs={sort_action ? sort_packs_section(packs ? packs : null, sort_action) : packs ? packs : null}/>
				

				{ packs &&
					<div className='load_more_container' id={`${section_name}_load_more_container`}>
						<span />
						<h1 onClick={() => {set_page(page + 1)}}>Load more</h1>
						<span />
					</div>
				}
				
			</div>
			
		</>
		
	)
}

function Pack_previews(props: { packs: Pack[] | null}) {
	const packs = props.packs

	const pack_previews_jsx = []
	if(packs) {
		for(let pack of packs) {
			pack_previews_jsx.push(
				<Pack_preview key={pack._id.toString()} pack={pack}/>
			)
		}
	}
    
    
	return (

		<div className="previews_container">
			{packs === null 
				? <Loader loading={true} main_color={true}></Loader>
				: <>
					{pack_previews_jsx.length > 0 &&
						pack_previews_jsx
					}
					{pack_previews_jsx.length === 0 &&
						<div className='no_packs_container'>
							<h1>No Packs found!</h1>
						</div>
					}
				</>
			}
		</div>

	);
	
}

//Component that represents 1 Pack preview. Takes a Pack obj as a property.
function Pack_preview(props: {pack: Pack}) {
    const pack: Pack = props.pack

	return (
        <Link href={`/pack?id=${pack._id}`} scroll={false}>
			
            <div className="pack_preview_container">

                <div className="content_container">
					<Pack_stars_raiting ratings={pack.ratings}/>
                    <h1>{pack.title}</h1>
                </div>
                
                <div className="background_container">
					<Image priority={true} src={`${process.env.NEXT_PUBLIC_BASE_PATH}/packs/${pack._id}/${pack.preview}`} alt="An image that represents this pack full of assets" layout="fill" className="background_image"/>
                    <div className="background_blur" />
                    <div className="background_blur_hover" />
                </div>

            </div>

        </Link>
	);
}