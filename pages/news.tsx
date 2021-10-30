import React, { ReactElement, useState} from 'react';
import Head from "next/head"
import Image from "next/image"
import Eclipse from "../public/images/eclipse.jpg"
import Footer from '../components/footer';

import { GetStaticProps } from 'next'
import { PatchInformation } from '../types';
import { navigateTo } from '../lib/pixels';
import { useEffect } from 'react';


const maxPatchesPerPage = 4

//News Component
export default  function News(props: any): ReactElement {
	const patch = props.allPatchInfos
	const [page, setPage] = useState(() => {
		if(process.browser) {
			if(sessionStorage.getItem("newsPage")) {
				const page = sessionStorage.getItem("newsPage")
				if(page) {
					return parseInt(page)
				} else {
					return 1
				}
			} else {
				return 1
			}
		} else {
			return 1
		}
		
	})
	//Adding & Removing Load more button based on available pages
	useEffect(() => {
		sessionStorage.setItem("newsPage", `${page}`)
		const getButtonContainer = document.getElementById("news_load_more_button_container") as HTMLDivElement
		
		
		if(page >= Math.ceil(patch.length / maxPatchesPerPage)) {
			getButtonContainer.style.display = "none"
		} else {
			getButtonContainer.style.display = ""
		}
	}, [page, patch.length])

	//Frontend Pagination. Paginating through array
	function load_more_content() {
		if(page < Math.ceil(patch.length / maxPatchesPerPage)) {
			setPage(page + 1)
		}
	}

	return (
		<>
			<Head>
				<title>Pixel News</title>
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
					<Patch_template_component patchInfos={patch} page={page} />

					<div className="news_load_more_button_container" id="news_load_more_button_container">
						<button onClick={load_more_content}>Load More</button>
					</div>
				</div>
				
				<Footer />
			</div>
		</>
	);
}

//Component to create a Patch template
function Patch_template_component(props: any): ReactElement{
	const patch: PatchInformation[] = props.patchInfos
	const page = props.page as number

	//Generating Extra patches based of page State
	function generate_page_patch_templates(page: number, patchInfos: PatchInformation[]): ReactElement[] | ReactElement {
		//An Array of Patch Templates for each Array of PatchInfos
		//An Array of Patch Templates for each Array of PatchInfos
		const jsxArray = patchInfos.map((patch: PatchInformation) => {
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

		return(jsxArray.slice(maxPatchesPerPage, maxPatchesPerPage * page))	
	}

	//Generating Default patches
	function generate_patch_templates(patchInfos: PatchInformation[]): ReactElement[] {
		const jsxArray = patchInfos.map((patch: PatchInformation) => {
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
		return(jsxArray.slice(0, maxPatchesPerPage))
	}

	return(
		<>
			{generate_patch_templates(patch)}
			{generate_page_patch_templates(page, patch)}
		</>
	)
}

import { getAllPatchInfos, getAllPatchIds, getPatchInfo} from "../lib/patch_lib"
export const getServerSideProps: GetStaticProps = async () => {
	const allPatchInfos = getAllPatchInfos(getAllPatchIds())
	return{
		props: {
			allPatchInfos
		}
	}
}