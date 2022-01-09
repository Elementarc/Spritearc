import React, { useState, useEffect} from 'react';
import { Pack } from "../types"
import Link from 'next/dist/client/link';
import Image from "next/image"
import { useParallax } from '../lib/custom_hooks';
import Footer from '../components/footer';
import { Nav_shadow } from '../components/navigation';
import Packs_section from '../components/packs_section';
export default function Browse() {
	
	
	return (
		<>
			<div className="browse_page">
				
				<div className="content">
					<Packs_section section_name='Recent Packs' api="/api/recent_packs" method='GET'/>
					<Nav_shadow/>
				</div>

				<Footer/>
			</div>
		</>
	);
}

function Title_pack_section() {
	const [title_pack, set_title_pack] = useState<any>(null)

	useEffect(() => {
		
		async function get_title_pack() {
			const response_title_pack = await fetch(`/api/get_recent_packs`)
			
			if(response_title_pack.status === 200) {
				const response_obj: {body: Pack | null} = await response_title_pack.json()

				set_title_pack((response_obj.body as any)[0])
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
						<h2>A New Story</h2>
						<h1>Nature Of Life</h1>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et lectus eu tincidunt faucibus. Vel venenatis eget euismod nulla ut. eget euismod nulla ut. eget euismod nulla ut. eget euismod nulla ut.</p>
						<Link href={`/pack?id=${title_pack._id}`} scroll={false}>View Pack</Link>
					</div>

					<div className="background_container">
						<Image src={`/packs/${title_pack._id}/${title_pack.preview_image}`} alt="Preview image" layout="fill" priority={true} className="preview_image" id="title_pack_background_image"/>
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