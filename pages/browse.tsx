import React, { useState, useEffect} from 'react';
import { Pack } from "../types"
import Pack_preview from '../components/pack_preview';
import Link from 'next/dist/client/link';
import Image from "next/image"
import { useParallax } from '../lib/custom_hooks';
import Footer from '../components/footer';
import { Nav_shadow } from '../components/navigation';
import Loading from "../components/loading"
import Packs_section from '../components/packs_section';

export default function Browse() {
	const [recent_packs, set_recent_packs] = useState<any>([])
	
	useEffect(() => {

		async function get_title_pack() {

			const response_recent_pack = await fetch(`/api/get_recent_packs`)
			if(response_recent_pack.status === 200) {
				const response_obj: {body: Pack[] | null} = await response_recent_pack.json()
				set_recent_packs(response_obj.body as any) 
			} else {
				set_recent_packs(false) 
			}
			
		}
		get_title_pack()

	}, [set_recent_packs])
	
	return (
		<>
			<div className="browse_page">
				
				<div className="content">
					<Title_section/>
					<Packs_section header="Recent Packs" packs={recent_packs}/>
					<Nav_shadow/>
				</div>

				<Footer/>
			</div>
		</>
	);
}

function Title_section() {
	const [title_pack, set_title_pack] = useState<any>(null)

	useEffect(() => {
		
		async function get_title_pack() {
			const response_title_pack = await fetch(`/api/get_title_pack`)
			
			if(response_title_pack.status === 200) {
				const response_obj: {body: Pack | null} = await response_title_pack.json()
				set_title_pack(response_obj.body as any)
			} else {
				set_title_pack(false)
			}
			
		}

		get_title_pack()
	}, [set_title_pack])

	useParallax("title_pack_background_image", title_pack)
	const pack = title_pack as any
	return (
		<div className="title_pack_container">
			
			{title_pack &&

				<div className="title_pack_preview_container">
						
					<div className="content_container">
						<h2>A New Story</h2>
						<h1>Nature Of Life</h1>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et lectus eu tincidunt faucibus. Vel venenatis eget euismod nulla ut. eget euismod nulla ut. eget euismod nulla ut. eget euismod nulla ut.</p>
						<Link href={`/pack?id=${pack._id}`} scroll={false}>View Pack</Link>
					</div>

					<div className="background_container">
						<Image src={`/packs/${pack._id}/${pack.preview_image}`} alt="Preview image" layout="fill" priority={true} className="preview_image" id="title_pack_background_image"/>
						<div className="background_blur" />
					</div>

				</div>

			}
			{title_pack === null &&
				null
				
			}
			

		</div>
	);
	
	
}

/* function Packs_section(props: { header: string}) {
	const [recent_packs, set_recent_packs] = useState<any>(null)
	//Packs Response from server.
	//JSX RecentPacks that will be rendered
	
	function return_jsx_packs() {
		let jsx_recent_packs: ReactElement<Pack_info>[] = []
		if(recent_packs) {
			for(let pack of recent_packs) {
				jsx_recent_packs.push(<Pack_preview key={pack._id} pack={pack}/>)
			}
		}
		
		return jsx_recent_packs
	}

	useEffect(() => {

		async function get_title_pack() {

			const response_recent_pack = await fetch(`/api/get_recent_packs`)
			if(response_recent_pack.status === 200) {
				const response_obj: {body: Pack_info[] | null} = await response_recent_pack.json()
				set_recent_packs(response_obj.body as any) 
			} else {
				set_recent_packs(false) 
			}
			
			
		}
		get_title_pack()
	}, [set_recent_packs])
	
	//If Recent_packs are available
	return (
		<div className="packs_container">
			
			<div className="info">
				<h1>– {props.header}</h1>
				<Link href="#" scroll={false}><a>View all</a></Link>
			</div>

			<div className="previews_container">
				{recent_packs &&
					return_jsx_packs()
				}
				{recent_packs === null &&
					null
				}
			</div>
			
		</div>
	);
	
} */