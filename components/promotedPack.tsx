import React, {useEffect, useState} from 'react';
import { useParallax } from '../lib/custom_hooks';
import { Pack } from '../types';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Button from './button';

export default function PromotedPack() {
    const [promo_pack, set_promo_pack] = useState<Pack | null | false>(null)
	const router = useRouter()
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
			<div className="promoted_pack_container">
				{promo_pack &&

					<div className="promoted_pack_preview_container">
							
						<div className="promoted_pack_content_container">
							<h2 className='big'>Promoted Pack</h2>
							<h1 className='big'>{promo_pack.title}</h1>
							<p className='big'>{promo_pack.description}</p>
							
							<div className='button_wrapper'>
								<Button onClick={() => {router.push(`/pack/${promo_pack._id}`, `/pack/${promo_pack._id}`, {scroll: false})}} className='button primary default' btnLabel='View Pack'/>
							</div>
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
