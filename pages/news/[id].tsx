import React, { ReactElement } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from "next/link"
import Footer from '../../components/footer';
import { Nav_shadow } from "../../components/navigation";
import { Patchnote } from '../../types';
import Image from "next/image"
import {formatDistanceStrict} from "date-fns"
import Markdown from 'markdown-to-jsx';
import { useParallax } from '../../lib/custom_hooks';
import { useRouter } from 'next/router';
import Head from 'next/head';

//Frontend
export default function Patch(props: {patchnote: string}) {
	const router = useRouter()
  	const patchnote = check_if_json(props.patchnote) ? JSON.parse(props.patchnote) : props.patchnote
	
	
	useParallax("patch_background_image")
	if(!patchnote) return router.push("/news", "/news", {scroll: false})
	const distance = formatDistanceStrict(new Date(patchnote.info.date), new Date())
	
	return (
		<>
			<Head>
				<title>{`Spritearc - ${patchnote.info.title}`}</title>
				<meta name="description" content={`Download or create opensource Pixelart assets to share it with the world! We have more then thousands of assets you can freely download and use in your projects.`}/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`Spritearc - Home`}/>
				<meta property="og:description" content={`Download or create opensource Pixelart assets to share it with the world! We have more then thousands of assets you can freely download and use in your projects.`}/>
				<meta property="og:image" content={``}/>

				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content={`Spritearc - Home`}/>
				<meta name="twitter:description" content={`Download or create opensource Pixelart assets to share it with the world! We have more then thousands of assets you can freely download and use in your projects.`}/>
				<meta name="twitter:image:src" content={``}/>
            </Head>
			<div className="patch_container">
				
				<div className="patch_header_container">
					<Image quality="100%" priority={true} src={`/images/${patchnote.info.image}`} layout="fill" alt="A Background image for header. Represent a cool planet." className="patch_background_image" id="patch_background_image"/>
					<div className="patch_preview_blur"></div>
				</div>

				<div className="patch_content_container">
					<div className="patch_main_content_container">
						<div className="patch_main_content" id="patch_main_content">
							<h2>{patchnote.info.update}</h2>
							<h1>{patchnote.info.title}</h1>
							<h4 style={{marginBottom: ".7rem"}}>{distance} ago</h4>
							<Markdown options={{forceBlock: true}} >{patchnote.content}</Markdown>
							
							<div className="patch_go_back">
								<Link href="/news" scroll={false}>
									<a>Go back</a>
								</Link>
							</div>
							
						</div>
					</div>

					<Forward_container/>
				</div>
				
				<Nav_shadow/>
			</div>
			<Footer/>
	</>
	);
}
//Container That Renders all Forward_items
function Forward_container(): ReactElement {
	return (
		<div className="patch_forward_container">
	
			<Forward_item img={"/logos/twitter.png"} header="Follow us on Twitter" description="You also can follow us on twitter to get notified whenever we release a new update!" link='https://twitter.com/Spritearc' background_color='#26A3F3'/>
	
		</div>
	);

}
//Creating a Forward item. Used by Forward_container
function Forward_item(props: {img: string, header: string, description: string, link: string, background_color?: string}) {
	return (
		<>
			<a href={`${props.link}`} target="_blank" rel='noreferrer' className="patch_forward_content_container">

				<div className="patch_forward_img_container">
					{props.background_color &&
						<div style={{backgroundColor: props.background_color}} className='patch_forward_img_background'></div>
					}
					<Image className="patch_forward_image" layout="fill" src={props.img} alt="" />
				</div>
				
				<div className="patch_forward_info_content">
					<h2>{props.header}</h2>
					<p>{props.description}</p>
				</div>
				
			</a>
			<span />
		</>

	);
}

import patchHandler from '../../lib/patch_lib';
import { check_if_json } from '../../lib/custom_lib';
export const getStaticPaths: GetStaticPaths = async () => {

	try {
		const patchnoteList: Patchnote[] = patchHandler.patchnoteList
		const paths = patchnoteList.map((patchnote) => {
			return {params: {id: `${patchnote.id}`}}
		})
		/* const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/get_patchnote_list`) */
		
		/* const patchnoteList: Patchnote[] = await response.json()

		const paths = patchnoteList.map((patchnote) => {

			return {params: {id: `${patchnote.id}`}}
		}) */
		
		return {
			paths,
			fallback: false,
		};

	} catch(err) {
		return {
			paths: [],
			fallback: false,
		};
	}
};

export const getStaticProps: GetStaticProps = async (context) => {
	try {
		if(!context.params) return { props: {patchnote: null}}
		const patch_id = context.params.id
		if(typeof patch_id !== "string") return { props: {patchnote: null}}

		const patchnote = patchHandler.getPatchnote(patch_id)
		if(!patchnote) return { props: {patchnote: null}}

		return{
			props: {patchnote: JSON.stringify(patchnote)},
		}

		

	} catch(err) {
		console.log(err)
		return { props: {patchnote: null}}
	}
	
}