import React, {ReactElement, useEffect} from 'react';
import { PackPreview } from "../types"
import { GetServerSideProps } from 'next'
import { motion } from 'framer-motion';
import Image from "next/image"
type PackPreviews = {
	packPreviews: PackPreview[]
}

export default function Packs() {


  return (
	<div className="packs_container">
		
		<div className="title_pack_preview_container">
			
		</div>

		<div className="pack_previews_container">
			<Pack_preview/>
			<Pack_preview/>
			<Pack_preview/>
			<Pack_preview/>
			<Pack_preview/>
		</div>

	</div>
  );
}


export  function Pack_preview_handler() {

	return (
		<>
			<div className="pack_previews_container">


			</div>
		</>
	);
}


export function Pack_preview() {

	return (
		<div className="pack_preview_container">

			<div className="content_container">
				<h1>Lost Sanctuary</h1>
				<h2>A New Story has begun</h2>
			</div>
			
			<div className="background_container">
				<Image src="/packs/pack_1/SampleA.png" layout="fill" className="background_image"/>
				<div className="background_blur" />
				<div className="background_blur_hover" />
			</div>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async(context) => {
	const packsRes = await fetch("http://localhost:3000/api/getPacksPreview")
	const packPreviews: PackPreview = await packsRes.json()
	console.log(packPreviews)
	return{
		props: {
			packPreviews
		}
	}
} 
