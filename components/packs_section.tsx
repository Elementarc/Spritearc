import React, {ReactElement, useState, useEffect} from 'react';
 import { Pack } from '../types';
import Link from 'next/link';
import Pack_preview from './pack_preview';
import Loader from './loading';


export default function Packs_section({section_name, api, method, body}: {section_name: string, api: string, method: string, body?: any}) {
	const [packs, set_packs] = useState<Pack[] | null>(null)
	const [page, set_page] = useState(1)

	
	//Getting recent packs
	useEffect(() => {
		async function get_packs() {
			
			const response_recent_pack = await fetch(`${api}?page=${page}`, {
				method: method.toUpperCase(),
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(body),
			})

			if(response_recent_pack.status === 200) {

				const response_obj: {packs: Pack[] | null, max_page: number} = await response_recent_pack.json()
				
	
				set_packs(response_obj.packs as Pack[]) 

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


	return (
		<>
			
				
				
				<div className='packs_section_container'>

				
					<Packs_preview_grid header={section_name} packs={packs}/>

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

function Packs_preview_grid(props: { header: string , packs: Pack[] | null}) {
	const packs = props.packs

	const jsx_packs = []
	if(packs) {
		for(let pack of packs) {
			jsx_packs.push(
				<Pack_preview key={pack._id.toString()} pack={pack}/>
			)
		}
	}
    
    
	return (
		<div className="packs_preview_grid">
			
			<div className="info">
				<h1>– {props.header}</h1>
				
			</div>

			<div className="previews_container">
				{packs === null 
					? <Loader loading={true} main_color={true}></Loader>
					: <>
						{jsx_packs.length > 0 &&
							jsx_packs
						}
						{jsx_packs.length === 0 &&
							<div className='no_packs_container'>
								<h1>No Packs found!</h1>
							</div>
						}
					</>
				}
			</div>
			
		</div>
	);
	
}