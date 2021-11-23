import React, {ReactElement, useState, useContext} from 'react';
import { App_handler, App_info, Pack_info } from "../types"
import { GetServerSideProps } from 'next'
import Pack_preview from '../components/pack_preview';
import Link from 'next/dist/client/link';
import Image from "next/image"
import { useParallax } from '../lib/custom_hooks';
import Footer from '../components/footer';
import { Nav_shadow } from '../components/navigation';
import { APP_HANDLER , APP_INFO} from '../components/layout';

export default function Browse(props: any) {
	const recent_packs: Pack_info[] | null = props.recent_packs
	const title_pack: Pack_info | null = props.title_pack
	
	return (
		<>
			<div className="browse_page">
				<div className="content">
					<Title_section pack={title_pack}/>
					<Packs_section packs={recent_packs} header="Recent Packs"/>
					<Nav_shadow/>
				</div>

				<Footer/>
			</div>
		</>
	);
}

export function Title_section(props: {pack: Pack_info | null,}) {
	const pack: Pack_info | null = props.pack
	const APP_INFO_CONTEXT: App_info = useContext(APP_INFO)
	const app_path = `${APP_INFO_CONTEXT.sheme}${APP_INFO_CONTEXT.domain_name}:${APP_INFO_CONTEXT.port}`

	useParallax("title_pack_background_image")
	if(pack) {
		
		return (
			<div className="title_pack_container">
	
				<div className="title_pack_preview_container">
					
					<div className="content_container">
						<h2>A New Story</h2>
						<h1>Nature Of Life</h1>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et lectus eu tincidunt faucibus. Vel venenatis eget euismod nulla ut. eget euismod nulla ut. eget euismod nulla ut. eget euismod nulla ut.</p>
						<Link href={`/pack?id=${pack._id}`}>View Pack</Link>
					</div>
	
					<div className="background_container">
						<Image src={`${app_path}/packs/${pack._id}/${pack.preview_image}`} layout="fill" priority={true} className="preview_image" id="title_pack_background_image"/>
						<div className="background_blur" />
					</div>
				</div>
	
			</div>
		);
	} else {
		return null
	}
	
}

export function Packs_section(props: {packs: Pack_info[] | null, header: string}) {
	//Packs Response from server.
	const packs: Pack_info[] | null = props.packs
	//JSX RecentPacks that will be rendered
	const [recent_packs_jsx, set_recent_packs_jsx] = useState(() => {
		let jsx_recent_packs: ReactElement<Pack_info>[] = []
		if(packs) {
			for(let pack of packs) {
				jsx_recent_packs.push(<Pack_preview key={pack._id} pack={pack}/>)
			}
		}
		
		return jsx_recent_packs
	})

	
	//If Recent_packs are available
	if(packs) {

		return (
			<div className="packs_container">
				
				<div className="info">
					<h1>– {props.header}</h1>
					<Link href="#" scroll={false}><a>View all</a></Link>
				</div>
	
				<div className="previews_container">
					{recent_packs_jsx}
				</div>
			</div>
		);
	} else {
		return null
	}
	
	
	
}

export const getServerSideProps: GetServerSideProps = async(context) => {
	const response_recent_pack = await fetch(`http://localhost:3000/api/get_recent_packs`)
	let recent_packs: Pack_info[] | null = null
	if(response_recent_pack.status === 200) {
		const response_obj: {body: Pack_info[] | null} = await response_recent_pack.json()
		recent_packs = response_obj.body
	}

	const response_title_pack = await fetch(`http://localhost:3000/api/get_title_pack`)
	let title_pack: Pack_info | null = null
	if(response_title_pack.status === 200) {
		const response_obj: {body: Pack_info | null} = await response_title_pack.json()
		title_pack = response_obj.body
	}

	return{
		props: {
			recent_packs,
			title_pack,
		}
	}
} 
