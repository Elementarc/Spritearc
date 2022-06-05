import { useRouter } from 'next/router';
import React from 'react';
import { Pack } from '../types';
import Image from 'next/image';
import Rating from './rating';
import { motion } from 'framer-motion';

export default function PackPreview(props: {pack: Pack}) {
	const router = useRouter()
    const pack: Pack = props.pack

	return (
        
		<motion.div layout onContextMenu={(e) => {e.preventDefault()}} onClick={() => {router.push(`/pack/${pack._id}`, `/pack/${pack._id}`, {scroll: false})}} className="pack_preview_container">

			<div className="content_container">
				<Rating avgRating={pack.avg_rating} raitingCount={pack.ratings.length}/>
				<h1>{pack.title}</h1>
			</div>
			
			<div className="background_container">
				<Image loading='lazy' unoptimized={true} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/packs/${pack.username.toLowerCase()}_${pack._id}/${pack.preview}`} alt="An image that represents this pack full of assets" layout="fill" className="background_image"/>
				<div className="background_blur" />
				<div className="background_blur_hover" />
				<div className="background_blur_hover_2" />
			</div>

		</motion.div>

	);
}
