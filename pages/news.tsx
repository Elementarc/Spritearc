import React, { ReactElement} from 'react';
import Head from "next/head"
import Image from "next/image"
import Eclipse from "../public/images/eclipse.jpg"
import Footer from '../components/footer';
import { getAllPatchInfos } from "../lib/patch"
import { GetStaticProps } from 'next'
import { FullPatchInformation } from '../types';
import { navigateTo } from '../lib/pixels';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
const maxPatchesPerPage = 3
//News Component
export default  function News(props: any): ReactElement {
	const Router = useRouter()
	const page = Router.query.page as string
	const pageInt = parseInt(page)
	//Adding & Removing Load more button based on available pages
	useEffect(() => {
		const getButtonContainer = document.getElementById("news_load_more_button_container") as HTMLDivElement
		

		if(pageInt >= Math.ceil(props.patchInfos.length / maxPatchesPerPage)) {
			getButtonContainer.style.display = "none"
		} else {
			getButtonContainer.style.display = ""
		}
	}, [Router.query.page])


	//Frontend Pagination. Paginating through array
	function load_more_content() {
		if(page) {
			const PageNum = parseInt(page)
			if(PageNum < Math.ceil(props.patchInfos.length / maxPatchesPerPage)) {
				Router.push(`?page=${PageNum + 1}`, undefined, {shallow: true, scroll:false})
			} 
		} else {
			Router.push(`?page=2`, undefined, {shallow: true,  scroll:false})
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
					<Patch_template_component patchInfos={props.patchInfos}/>

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
	const patchInfos: FullPatchInformation[] = props.patchInfos
	
	const Router = useRouter()
	const page = Router.query.page as string

	function generate_page_patch_templates(page: string): ReactElement[] | ReactElement {
		const pageNum = parseInt(page)
		//An Array of Patch Templates for each Array of PatchInfos
		if(page) {
			//An Array of Patch Templates for each Array of PatchInfos
			const jsxArray = patchInfos.map((patch: FullPatchInformation) => {
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

			return(jsxArray.slice(maxPatchesPerPage, maxPatchesPerPage * pageNum))	
		} else {
			return(
				<>
				</>
			)
		}
		

		
		
	}
	function generate_patch_templates() {
		const jsxArray = patchInfos.map((patch: FullPatchInformation) => {
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
			{generate_patch_templates()}
			{generate_page_patch_templates(page)}
		</>
	)
}


export const getServerSideProps: GetStaticProps = async () => {
	const patchInfos: FullPatchInformation[] = getAllPatchInfos()
	
	return{
		props: {
			patchInfos
		}
	}
}