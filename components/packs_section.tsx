import React, { useState, useEffect} from 'react';
import { Pack, Server_response_packs } from '../types';
import Pack_stars_raiting from './pack_stars_raiting';
import { useAnimation } from 'framer-motion';
import Image from 'next/image';
import Loading from './loading';
import { sort_packs_section } from '../lib/custom_lib';
import { useRouter } from 'next/router';
import { Drop_down } from './dropdown';

export default function Packs_section({section_name, api, method, body}: {section_name: string, api: string, method: string, body?: string, sort_action?: string | null | undefined}) {
	const [sort_action, set_sort_action] = useState<null | string>(null)
	const [toggle_sort_by_state, set_toggle_sort_by_state] = useState(false)
	const [packs, set_packs] = useState<null | Pack[] | []>(null)
	const [toggle_packs, set_toggle_packs] = useState(true)
	const [current_page, set_current_page] = useState(() => {
		if(typeof window === "undefined") return 1
		try {
			const page = sessionStorage.getItem(section_name)
			if(page) return parseInt(page)
			return 1
		} catch(err) {
			console.log(err)
			return 1
		}
		
	})
	const [available_pages, set_available_pages] = useState(0)
	useEffect(() => {
		sessionStorage.setItem(section_name, `${current_page}`)
	}, [section_name, current_page])
	//Checking sessionstorage if sort_action exists. Setting sort_action if yes
	useEffect(() => {
		const sort_action =  sessionStorage.getItem(`${section_name}_sort_action`) ? sessionStorage.getItem(`${section_name}_sort_action`) : null
		set_sort_action(sort_action)
	}, [set_sort_action, section_name])

	//Setting sort action in sessionStorage
	useEffect(() => {
		if(!sort_action) return sessionStorage.removeItem(`${section_name}_sort_action`) 
		if(sort_action) return sessionStorage.setItem(`${section_name}_sort_action`, sort_action) 
	}, [sort_action])

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
					body: body ? body : null,
				})
				
				
				const response_obj = await response.json() as Server_response_packs
				
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

	function next_page() {
		if(available_pages > current_page) return set_current_page(current_page + 1)
	}

	return (
		<>
			
			<div className='packs_section_container'>

				<div className="packs_section_info">
					<h1 onClick={() => {set_toggle_packs(!toggle_packs)}}>{toggle_packs ? `–` : "+"} {section_name}</h1>
					
					{toggle_packs &&
						<Drop_down label='Sort by' reset_option='None' options={["Recent","Rating", "Downloads"]} active_state={sort_action} set_active_state={set_sort_action} />
					}

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
				<Image loading='lazy' unoptimized={true} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/packs/${pack.username.toLowerCase()}_${pack._id}/${pack.preview}`} alt="An image that represents this pack full of assets" layout="fill" className="background_image"/>
				<div className="background_blur" />
				<div className="background_blur_hover" />
			</div>

		</div>

	);
}