import React, { useState, useEffect} from 'react';
import { Pack, Server_response_packs } from '../types';
import Pack_stars_raiting from './pack_stars_raiting';
import { useAnimation , motion} from 'framer-motion';
import Image from 'next/image';
import Loading from './loading';
import ExpandIcon from "../public/icons/ExpandIcon.svg"
import { check_if_json, SORT_ACTIONS, sort_packs_section } from '../lib/custom_lib';
import { useRouter } from 'next/router';

export default function Packs_section({section_name, api, method, body}: {section_name: string, api: string, method: string, body?: any, sort_action?: string | null | undefined}) {
	const [sort_action, set_sort_action] = useState<null | string | undefined>(null)
	const [toggle_sort_by_state, set_toggle_sort_by_state] = useState(false)
	const [packs, set_packs] = useState<null | Pack[] | []>(null)
	const [toggle_packs, set_toggle_packs] = useState(true)
	const [current_page, set_current_page] = useState(1)
	const [available_pages, set_available_pages] = useState(0)

	//Checking sessionstorage if sort_action exists. Setting sort_action if yes
	useEffect(() => {
		const sort_action =  sessionStorage.getItem(`${section_name}_sort_action`) ? sessionStorage.getItem(`${section_name}_sort_action`) : null
		set_sort_action(sort_action)
	}, [set_sort_action, section_name])

	useEffect(() => {
		function display_load_more(toggle: boolean) {
			const counter_cointainer = document.getElementById(`${section_name}_load_more_container`) as HTMLDivElement

			if(!counter_cointainer) return
			if(toggle === true) {
				counter_cointainer.style.display = "grid"
			} else {
				counter_cointainer.style.display = "none"
			}
		}

		console.log(current_page, available_pages)
		if(current_page < available_pages) {
			display_load_more(true)
		} else {
			display_load_more(false)
		}
	}, [current_page, available_pages, section_name])

	//Getting packs from server. Setting it aswell
	useEffect(() => {
		const controller = new AbortController()
		async function get_packs() {
			
			try {
			
				const response = await fetch(`${api}?page=${current_page}`, {
					method: method.toUpperCase(),
					headers: {
						"Content-Type": "application/json"
					},
					credentials: "include",
					signal: controller.signal,
					body: body ? check_if_json(body) ? body: JSON.stringify(body) : null,
				})
				
				const response_obj = await response.json() as Server_response_packs

				console.log(response_obj.packs)
				set_packs(response_obj.packs)
				set_available_pages(response_obj.available_pages)

			} catch(err) {
				
				//
			}
		}
		get_packs()

		return(() => {
			controller.abort()
		})
	}, [set_packs, current_page, api, method, body, section_name])
	
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
	function next_page() {
		if(available_pages > current_page) return set_current_page(current_page + 1)
	}

	return (
		<>
			
			<div className='packs_section_container'>

				<div className="packs_section_info">
					<h1 onClick={() => {set_toggle_packs(!toggle_packs)}}>{toggle_packs ? `–` : "+"} {section_name}</h1>

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

				{ toggle_packs &&
					<>
						<>
						
							<Pack_previews packs={sort_action ? sort_packs_section(packs ? packs : null, sort_action) : packs ? packs : null}/>
						
						</>

						<>
							{ packs && available_pages > current_page &&
								<div className='load_more_container' id={`${section_name}_load_more_container`}>
									<span />
									<h1 onClick={next_page}>Load more</h1>
									<span />
								</div>
							}
						</>
					</>
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
				? <Loading loading={true} main_color={true}></Loading>
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
	const router = useRouter()
    const pack: Pack = props.pack

	return (
        
		<div onContextMenu={(e) => {e.preventDefault()}} onClick={() => {router.push(`/pack/${pack._id}`, `/pack/${pack._id}`, {scroll: false})}} className="pack_preview_container">

			<div className="content_container">
				<Pack_stars_raiting ratings={pack.ratings}/>
				<h1>{pack.title}</h1>
			</div>
			
			<div className="background_container">
				<Image loading='lazy' unoptimized={true} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/packs/${pack._id}/${pack.preview}`} alt="An image that represents this pack full of assets" layout="fill" className="background_image"/>
				<div className="background_blur" />
				<div className="background_blur_hover" />
			</div>

		</div>

	);
}