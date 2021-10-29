import React, { ReactElement} from 'react';
import Head from "next/head"
import Image from "next/image"
import Eclipse from "../public/images/eclipse.jpg"
import Footer from '../components/footer';
import { getAllPatchInfos } from "../lib/patch"
import { GetStaticProps } from 'next'
import { FullPatchInformation } from '../types';
import { navigateTo } from '../lib/pixels';

//News Component
export default  function News(props: any): ReactElement {
	
	return (
		<>
			<Head>
				<title>Everything new about Pixels</title>
				<meta name="description" content="You can see the patchnotes of our application"/>
			</Head>

			<div className="news_container">
				<div className="news_header_container">

					<div className="background_container">
						<div className="background_image_container">
							<Image quality="100%" priority={true} src={Eclipse} layout="fill" alt="A Background image for header. Represent a cool planet." className="background_image"/>
						</div>
						<div className="background_blur" />
					</div>

					<div className="header_content_container">
						<h2>Recent Updates</h2>
						<h1>Everything New About PixelPalast</h1>
						<p>We will release occasional updates for PixelPalast. If you want to stay tuned you should come here and visit sometimes.</p>
						<span />
					</div>
					
				</div>
				
				<div className="news_content_container">
					<Patch_template_component patch={props.patchArray}/>
				</div>
				<Footer />
			</div>
		</>
	);
}

//Component to create a Patch template
function Patch_template_component(props: any): ReactElement{
	const patch: FullPatchInformation[] = props.patch

	function generate_patch_templates(): ReactElement[] {
		const jsxArray = patch.map((patch: FullPatchInformation) => {
			return(
				<div onClick={() => {navigateTo(`/news/${patch.id}`)}} key={`${patch.id}`} className="patch_template_container">
					<div className="patch_preview_image_container">
						<Image quality="100%" priority={true} layout="fill" src={`/images/${patch.image}`}  className="patch_preview_image"/>
					</div>
					<div className="patch_information">
						<h2>{patch.update}</h2>
						<h1>{patch.title}</h1>
						<p>{patch.date}</p>
					</div>
				</div>
			)
		})
		return(jsxArray)
	}

	return(
		<>
			{generate_patch_templates()}
		</>
	)
}


export const getStaticProps: GetStaticProps = async () => {
	const patchArray: FullPatchInformation[] = getAllPatchInfos()

	return{
		props: {
			patchArray
		}
	}
}