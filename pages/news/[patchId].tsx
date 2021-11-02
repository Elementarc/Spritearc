import React, { ReactElement } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next'
import Footer from '../../components/footer';
import { Patchnote } from '../../types';
import Image from "next/image"
import Router from "next/router"
import {formatDistanceStrict} from "date-fns"
import Markdown from 'markdown-to-jsx';

//Frontend
export default function Patch(props: any) {
  	const patchnote: Patchnote = JSON.parse(props.patchnote)
	const distance = formatDistanceStrict(new Date(patchnote.info.date), new Date())
	
	return (
		<div className="patch_container">
			
			<div className="patch_preview_container">
				<Image quality="100%" priority={true} src={`/images/${patchnote.info.image}`} layout="fill" alt="A Background image for header. Represent a cool planet." className="background_image"/>
				<div className="patch_preview_blur"></div>
			</div>

			<div className="patch_content_container">
				<div className="patch_main_content_container">
					<div className="patch_main_content" id="patch_main_content">
						<h2>{patchnote.info.update}</h2>
						<h1>{patchnote.info.title}</h1>
						<h3>{distance} ago</h3>
						<Markdown options={{forceBlock: true}} >{patchnote.content}</Markdown>
						
						<button className="patch_goback_button" onClick={() => {Router.back()}}>Go Back</button>
					</div>
				</div>

				<Forward_container/>
			</div>

			<Footer/>
	</div>
	);
}
//Container That Renders all Forward_items
function Forward_container(): ReactElement {
	return (
	  <div className="patch_forward_container">
  
		  <Forward_item img={"/images/patch1.jpg"} header="Plans for the future" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."/>
		  <Forward_item img={"/images/patch1.jpg"} header="Plans for the future" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."/>
  
	  </div>
	);
}
//Creating a Forward item. Used by Forward_container
function Forward_item(props: any) {
return (

	<div className="patch_forward_content_container">

		<div className="patch_forward_1_container">

			<div className="patch_forward_img_container">
				<Image layout="fill" src={props.img} alt="" />
			</div>
			
			<div className="patch_forward_info_content">
				<h2>{props.header}</h2>
				<p>{props.description}</p>
			</div>
			
		</div>
		<span />

	</div>

);
}



//Serverside
import patchHandler from '../../lib/patch_lib';

export const getStaticProps: GetStaticProps = async (context) => {
	const params: any = context.params
	const patchnote = JSON.stringify(patchHandler.getPatchnote(params.patchId))


	if(patchnote) {
		return {
			props: {
				patchnote
			}
		}
	} else {
		return {
			notFound: true,
		}
	}
	
}
export const getStaticPaths: GetStaticPaths  = async ()  => {
	const patchnoteList = patchHandler.patchnoteList
    //Prerendering Paths for Patches. Function returns all paths for possible patches.
	const paths: string [] = patchnoteList.map((patch) => {
		
		return `/news/${patch.id}`
	})
    return{
        paths,
        fallback: false,
    }
}










