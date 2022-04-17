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
				<title>{`Spritearc - Discover thousands of free pixel art game assets and sprites`}</title>
				<meta name="description" content="Discover the most popular pixel art game assets and sprites like tilesets, characters, weapons, backgrounds, icons and more for free on spritearc.com, the platform for pixel artists."/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Discover pixel art game assets and sprites for free."/>
				<meta property="og:description" content="Discover the most popular pixel art game assets and sprites like tilesets, characters, weapons, backgrounds, icons and more for free on spritearc.com, the platform for pixel artists."/>
				<meta property="og:image" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>

				
				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content="Discover pixel art game assets and sprites for free."/>
				<meta name="twitter:description" content="Discover the most popular pixel art game assets and sprites like tilesets, characters, weapons, backgrounds, icons and more for free on spritearc.com, the platform for pixel artists."/>
				<meta name="twitter:image:src" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>
            </Head>
			
			<div className="browse_content">
				<Title_pack_section/>
				<Packs_section section_name='Most Popular' api={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/most_popular_packs`} method='POST'/>
				<Packs_section section_name='Recent Packs' api={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/recent_packs`} method='POST'/>
				<Nav_shadow/>
			</div>

			<Footer/>
		</>
	);
}

function Title_pack_section() {
	const [promo_pack, set_promo_pack] = useState<Pack | null | false>(null)
	


	useEffect(() => {
		const controller = new AbortController()
		
		async function get_title_pack() {
			try {
			
				const response_title_pack = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/get_promoted_pack`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					signal: controller.signal,
					credentials: "include",
				})
				
				const response_obj = await response_title_pack.json() 

				if(!response_obj?.pack) return set_promo_pack(null)
				return set_promo_pack(response_obj?.pack)

			} catch(err) {
				//Couldnt reach server
			}
		}
		
		get_title_pack()

		return(() => {
			controller.abort()
		})
		
	}, [set_promo_pack])
	
	useParallax("title_pack_background_image", promo_pack)
	
	return (
		<>
			<div className="title_pack_container">
				{promo_pack &&

					<div className="title_pack_preview_container">
							
						<div className="content_container">
							<h2>Promoted Pack</h2>
							<h1>{promo_pack.title}</h1>
							<p>{promo_pack.description}</p>
							<Link href={`/pack/${promo_pack._id}`} scroll={false}>View Pack</Link>
						</div>

						<div className="background_container">
							<Image loading='lazy' unoptimized={true} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/packs/${promo_pack.username.toLowerCase()}_${promo_pack._id}/${promo_pack.preview}`} alt="Preview image" layout="fill" className="preview_image" id="title_pack_background_image"/>
							<div className="background_blur" />
						</div>

					</div>

				}
				{promo_pack === null &&
					null
				}

			</div>
			
		</>
	);
	
	
}