import React, { useState, useEffect, useReducer} from 'react';
import { Pack } from '../types';
import Link from 'next/link';
import Pack_stars_raiting from './pack_stars_raiting';
import { useAnimation , motion} from 'framer-motion';
import Image from 'next/image';
import Loader from './loading';
import ExpandIcon from "../public/icons/ExpandIcon.svg"
import { check_if_json, SORT_ACTIONS, sort_packs_section } from '../lib/custom_lib';


export default function Packs_section({section_name, api, method, body}: {section_name: string, api: string, method: string, body?: any, sort_action?: string | null | undefined}) {
	const [packs, set_packs] = useState<null | Pack[] | []>(null)
	const [page, set_page] = useState(1)
	const [sort_action, set_sort_action] = useState(() => {
		if(process.browser) {
			const init_sort_action = sessionStorage.getItem(`${section_name.toLowerCase()}_sort_action`)

			return init_sort_action ? init_sort_action : null
		}
	})
	const [toggle_sort_by_state, set_toggle_sort_by_state] = useState(false)
	
	//Getting Packs from server and setting it. Also checking if initial Sort_action
	useEffect(() => {
		async function get_packs() {
			console.log("Got packs from api")
			const response_recent_pack = await fetch(`${api}?page=${page}`, {
				method: method.toUpperCase(),
				headers: {
					"Content-Type": "application/json"
				},
				body: body ? check_if_json(body) ? JSON.stringify(body): null : null,
			})

			if(response_recent_pack.status === 200) {

				const response_obj: {packs: Pack[], max_page: number} = await response_recent_pack.json()

				if(sort_action) {

					const sorted_packs = sort_packs_section(response_obj.packs, sort_action)
					set_packs(sorted_packs)
				} else {
					set_packs(response_obj.packs)
				}
				

				function toggle_load_more() {
					const counter_cointainer = document.getElementById("load_more_container") as HTMLDivElement

					if(!counter_cointainer) return
					if(response_obj.max_page === page) {
						
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


	}, [set_packs, page, api, method, body])

	//animation for 
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

	//Chaning packs order whenever sort changes
	useEffect(() => {
		if(!packs) return
		if(!sort_action) return
		const sorted_packs = sort_packs_section(packs, sort_action)
		set_packs(sorted_packs)

	}, [sort_action])

	function sort_packs(sort_action: string) {
		if(!packs) return
		if(packs.length < 2) return

		sessionStorage.setItem(`${section_name.toLowerCase()}_sort_action`, sort_action)
		const sorted_packs = sort_packs_section(packs, sort_action)
		
		set_sort_action(sort_action)
		set_packs(sorted_packs)
	}
	
	return (
		<>
			
			<div className='packs_section_container'>

				<div className="packs_section_info">
					<h1>– {section_name}</h1>

					<motion.div animate={sort_by_animation} className='drop_down_container'>
						<div onClick={() => {set_toggle_sort_by_state(!toggle_sort_by_state)}} className='info'>
							<h4>{sort_action ? `Sort by ${sort_action.split("_")[1]}` : "Sort By"}</h4>
							<ExpandIcon/>
						</div>

						<div className='grid_sort_item' onClick={() => {sort_packs(SORT_ACTIONS.BY_RATING); set_toggle_sort_by_state(false)}}>Rating</div>
						<div className='grid_sort_item' onClick={() => {sort_packs(SORT_ACTIONS.BY_RECENT); set_toggle_sort_by_state(false)}}>Recent</div>
						<div className='grid_sort_item' onClick={() => {sort_packs(SORT_ACTIONS.BY_DOWNLOADS); set_toggle_sort_by_state(false)}}>Downloads</div>
					</motion.div>

				</div>

				<Pack_previews packs={packs}/>

				{ packs && packs.length > 0 &&
					<div className='load_more_container' id="load_more_container">
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