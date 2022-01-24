import React, { useState, useEffect} from 'react';
import { Pack } from "../types"
import Link from 'next/dist/client/link';
import Image from "next/image"
import { useParallax } from '../lib/custom_hooks';
import Footer from '../components/footer';
import { Nav_shadow } from '../components/navigation';
import Packs_section from '../components/packs_section';
import Head from 'next/head';

export default function Browse() {

	return (
		<>
			<Head>
				<title>Browse through thousands of free Pixelart assets and sprites</title>
				<meta name="description" content="Find sprites and assets from thousands of packs and download them."/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Browse through thousands of free Pixelart assets and sprites"/>
				<meta property="og:description" content="Find sprites and assets from thousands of packs and download them."/>
				<meta property="og:image" content=""/>

				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content=""/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content="Browse through thousands of free Pixelart assets and sprites"/>
				<meta name="twitter:description" content="Find sprites and assets from thousands of packs and download them."/>
				<meta name="twitter:image" content=""/>
            </Head>

			<div className="browse_page">
				
				<div className="content">
					<Title_pack_section/>
					<Packs_section section_name='Recent Packs' api="/recent_packs" method='POST'/>
					<Packs_section section_name='Most Popular' api="/recent_packs" method='POST'/>
					<Nav_shadow/>
				</div>

				<Footer/>
			</div>
		</>
	);
}

function Title_pack_section() {
	const [title_pack, set_title_pack] = useState<Pack | null | false>(null)

	useEffect(() => {
		
		async function get_title_pack() {
			const response_title_pack = await fetch(`/title_pack`, {
				method: "POST"
			})
			
			if(response_title_pack.status === 200) {
				const response_obj: {pack: Pack | null} = await response_title_pack.json()

				set_title_pack((response_obj.pack as any))
			} else {
				set_title_pack(false)
			}
			
		}
		
		get_title_pack()
	}, [set_title_pack])
	
	useParallax("title_pack_background_image", title_pack)
	
	return (
		<div className="title_pack_container">
			
			{title_pack &&

				<div className="title_pack_preview_container">
						
					<div className="content_container">
						<h2>WINNER OF THE MONTH!</h2>
						<h1>{title_pack.title}</h1>
						<p>{title_pack.description}</p>
						<Link href={`/pack?id=${title_pack._id}`} scroll={false}>View Pack</Link>
					</div>

					<div className="background_container">
						<Image src={`${process.env.NEXT_PUBLIC_BASE_PATH}/packs/${title_pack._id}/${title_pack.preview}`} alt="Preview image" layout="fill" priority={true} className="preview_image" id="title_pack_background_image"/>
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