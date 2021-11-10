import React, {ReactElement, useState, useEffect} from 'react';
import { Pack  } from "../types"
import { GetServerSideProps } from 'next'
import Pack_preview from '../components/pack_previews';
import Link from 'next/dist/client/link';
import Image from "next/image"
import { createParallaxByElementId } from '../lib/parallax';
import Footer from '../components/footer';

export default function Browse(props: any) {
	const recent_packs: Pack[] = props.recent_packs
	
	return (
		<>
			<div className="browse_container">
				<Title_section pack={recent_packs[0]}/>
				<Packs_section packs={recent_packs} header="Recent Packs"/>
				<Packs_section packs={recent_packs} header="Most Popular"/>
				
			</div>
			<Footer/>
		</>
	);
}

export function Title_section(props: {pack: Pack,}) {
	const pack = props.pack
	createParallaxByElementId("title_pack_background_image")
	return (
		<div className="title_pack_container">

			<div className="title_pack_preview_container">

				<div className="content_container">
					<h2>A New Story</h2>
					<h1>Nature Of Life</h1>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et lectus eu tincidunt faucibus. Vel venenatis eget euismod nulla ut. eget euismod nulla ut. eget euismod nulla ut. eget euismod nulla ut.</p>
					<button>View Pack</button>
				</div>

				<div className="background_container">
					<Image src={pack.previewImage} layout="fill" priority={true} className="preview_image" id="title_pack_background_image"/>
					<div className="background_blur" />
				</div>
			</div>

		</div>
	);
}
export function Packs_section(props: {packs: Pack[], header: string}) {
	//Packs Response from server.
	const packs: Pack[] = props.packs
	//JSX RecentPacks that will be rendered
	const [recent_packs_jsx, set_recent_packs_jsx] = useState(() => {
		let jsx_recent_packs: ReactElement<Pack>[] = []
		for(let pack of packs) {
			jsx_recent_packs.push(<Pack_preview key={pack._id} pack={pack}/>)
		}
		return jsx_recent_packs
	})
	
	return (
		<div className="packs_container">
			
			<div className="info_container">
				<h1>– {props.header}</h1>
				<Link href="#" scroll={false}><a>View all</a></Link>
			</div>

			<div className="previews_container">
				{recent_packs_jsx}
			</div>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async(context) => {
	const recent_packs: Pack[] = await (await fetch(`http://localhost:3000/api/get_recent_packs`)).json()
	const title_pack: Pack = await (await fetch(`http://localhost:3000/api/get_title_pack`)).json()
	return{
		props: {
			recent_packs,
			title_pack
		}
	}
} 
