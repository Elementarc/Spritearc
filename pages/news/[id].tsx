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


//Frontend
export default function Patch(props: {patchnote: Patchnote | null}) {
	const router = useRouter()
  	const patchnote = props.patchnote 
	
	
	useParallax("patch_background_image")
	if(!patchnote) return router.push("/news", "/news", {scroll: false})
	const distance = formatDistanceStrict(new Date(patchnote.info.date), new Date())
	
	return (
		<>
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
  
		  <Forward_item img={"/images/patch1.jpg"} header="Plans for the future" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."/>
		  <Forward_item img={"/images/patch1.jpg"} header="Plans for the future" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."/>
  
	  </div>
	);

}
//Creating a Forward item. Used by Forward_container
function Forward_item(props: any) {
	return (
		<>
			<div className="patch_forward_content_container">

				<div className="patch_forward_img_container">
					<Image className="patch_forward_image" layout="fill" src={props.img} alt="" />
				</div>
				
				<div className="patch_forward_info_content">
					<h2>{props.header}</h2>
					<p>{props.description}</p>
				</div>
				
			</div>
			<span />
		</>

	);
}

export const getStaticPaths: GetStaticPaths = async () => {

	try {
	
		const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/get_patchnote_list`)

		const patchnoteList: Patchnote[] = await response.json()

		const paths = patchnoteList.map((patchnote) => {

			return {params: {id: `${patchnote.id}`}}
		})
		
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
		const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/get_patchnote/${patch_id}`, {method: "GET"})


		const patchnote = await response.json()
		
		
		return{
			props: {patchnote: patchnote},
		}

		

	} catch(err) {
		console.log(err)
		return { props: {patchnote: null}}
	}
	
	
}