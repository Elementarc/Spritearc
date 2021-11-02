import React, { ReactElement } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next'
import Footer from '../../components/footer';
import { Patchnote } from '../../types';
import Image from "next/image"
import Router from "next/router"
import { parse } from "node-html-parser"


//Frontend
export default function Patch(props: any) {
  	const patchnote: Patchnote = JSON.parse(props.patchnote)
	const html = Array.from(parse(patchnote.content).childNodes)
	

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
						<h1>{patchnote.info.title}, {patchnote.info.date}</h1>
						
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placerat fermentum tellus tellus sed justo elementum nunc, vel. Lacus, ipsum eleifend eget erat faucibus lectus. Aenean ultricies ullamcorper convallis lorem. Aliquam elit sociis nec tellus nibh. Elit turpis tempus placerat mi. Mollis lectus sed risus nisi, et. Dignissim urna, vitae sed laoreet ut at neque netus.</p>
						<br />
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placerat fermentum tellus tellus sed justo elementum nunc, vel.</p>
						<br />
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placerat fermentum tellus tellus sed justo elementum nunc, vel. Lacus, ipsum eleifend eget erat faucibus lectus. Aenean ultricies ullamcorper convallis lorem. Aliquam elit sociis nec tellus nibh. Elit turpis tempus placerat mi. Mollis lectus sed risus nisi, et. Dignissim urna, vitae sed laoreet ut at neque netus.  Mollis lectus sed risus nisi,  Mollis lectus sed risus nisi.</p>

						<img src={""} alt="" />
						<h1 style={{marginTop: "2rem"}}>PixelPalast</h1>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placerat fermentum tellus tellus sed justo elementum nunc, vel. Lacus, ipsum eleifend eget erat faucibus lectus. Aenean ultricies ullamcorper convallis lorem. Aliquam elit sociis nec tellus nibh. Elit turpis tempus placerat mi. Mollis lectus sed risus nisi, et. Dignissim urna, vitae sed laoreet ut at neque netus.</p>
						<br />
						<p style={{marginBottom: "2rem"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placerat fermentum tellus tellus sed justo elementum nunc, vel. Lacus, ipsum eleifend eget erat faucibus lectus. Aenean ultricies ullamcorper convallis lorem. Aliquam elit sociis nec tellus nibh. Elit turpis tempus placerat mi. Mollis lectus sed risus nisi, et. Dignissim urna, vitae sed laoreet ut at neque netus.  Mollis lectus sed risus nisi,  Mollis lectus sed risus nisi.</p>
						<button onClick={() => {Router.back()}} style={{marginBottom: "6rem"}}>Go Back</button>
					</div>
				</div>

			</div>

			<Footer/>
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










