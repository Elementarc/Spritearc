import React, { ReactElement, useState} from 'react';
import Image from "next/image"
import Eclipse from "../public/images/eclipse.jpg"
import Router from "next/router"
import Footer from '../components/footer';
import { Nav_shadow } from "../components/navigation";
import { Patchnote } from '../types';
import { formatDistanceStrict } from "date-fns"
import { useParallax } from '../lib/custom_hooks';
import { GetStaticProps} from 'next'
import Loader from '../components/loading';
import Head from 'next/head';


function navigateTo(path: string): void {
    Router.push(`${path}`, `${path}` , {scroll: false})
}

//News Component
export default  function News(props: {patchnoteListOrdered: string}): ReactElement {
	const patchnoteListOrdered = check_if_json(props.patchnoteListOrdered) ? JSON.parse(props.patchnoteListOrdered) : null

	//Creating Parallax for img
	useParallax("news_background_image")
	return (
		<>
			<Head>
				<title>{`Spritearc - News`}</title>
				<meta name="description" content={`Read about our newest upcoming features and learn about our intentions!`}/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`Spritearc - News`}/>
				<meta property="og:description" content={`Read about our newest upcoming features and learn about our intentions!`}/>
				<meta property="og:image" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/wallpaper.png`}/>


				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content={`Spritearc - News`}/>
				<meta name="twitter:description" content={`Read about our newest upcoming features and learn about our intentions!`}/>
				<meta name="twitter:image:src" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/wallpaper.png`}/>
            </Head>
			
			<div className="news_page">

				<div className="content">

					<div className="header_container">

						<div className="background">
							<Image loading='lazy' unoptimized={true} quality="100%" src={Eclipse} layout="fill" alt="A pixelart image that displays a universe" className="background_image" id="news_background_image"/>
							<div className="background_blur" />
						</div>
						
						<div className="patch_list">
							<h2>Recent Updates</h2>
							<h1>Everything New About {process.env.NEXT_PUBLIC_APP_NAME}</h1>
							<p>We will occasionally release updates for {process.env.NEXT_PUBLIC_APP_NAME}. Here you can find our newest upcoming features that you might be interested in. Take a look!</p>
							<span />
						</div>

					</div>

					<div className="content_container">

						<div className="news_all_patch_container">
							{patchnoteListOrdered && patchnoteListOrdered.length > 0 &&
								<Patchnote_templates patchnotes={patchnoteListOrdered}/>
							}
							{patchnoteListOrdered === null &&
								<Loader loading={true} main_color={true}/>
							}

						</div>

					</div>

					<Nav_shadow/>

				</div>
				<Footer />
			</div>
		</>
	);
}


//Component to create a Patch template
function Patchnote_templates(props: {patchnotes: Patchnote[]}): ReactElement{
	const patchnotes: Patchnote[] | [] = props.patchnotes
	
	
	let patchnote_templates = []
	for(let patchnote of patchnotes) {
		const distance = formatDistanceStrict(new Date(patchnote.info.date), new Date())

		patchnote_templates.push(
			<div key={`${patchnote.id}`} onClick={() => {navigateTo(`/news/${patchnote.id}`)}} className="patch_template_container">
				
				<div className="patch_preview_image_container">
					<Image loading='lazy' unoptimized={true} quality="100%"  layout="fill" src={`/images/${patchnote.info.image}`} alt="A Theme image to represent that Patchnote."  className="patch_preview_image"/>
				</div>

				<div className="patch_information">
					<h2>{patchnote.info.update}</h2>
					<h1>{patchnote.info.title}</h1>
					<h4>{distance} ago</h4>
				
				</div>
			</div>
		)
	}

	return(
		<>
			{patchnote_templates}
		</>
	)
}

import patchHandler from '../lib/patch_lib';
import { check_if_json } from '../lib/custom_lib';
export const getStaticProps: GetStaticProps = async (context) => {
	try {
		const patchnoteListOrderd = patchHandler.patchnoteListOrdered

		return{
			props: {patchnoteListOrdered: JSON.stringify(patchnoteListOrderd)},
		}

	} catch(err) {
		console.log(err)
		return { props: {patchnote: null}}
	}
	
	
}

