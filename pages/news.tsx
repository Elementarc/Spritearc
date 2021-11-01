import React, { ReactElement, useState} from 'react';
import Head from "next/head"
import Image from "next/image"
import Eclipse from "../public/images/eclipse.jpg"
import Footer from '../components/footer';
import { useEffect } from 'react';
import { GetStaticProps } from 'next'
import { Patchnote } from '../types';
import { navigateTo } from '../lib/router_lib';
const maxPatchesPerPage = 4

//News Component
export default  function News(props: any): ReactElement {
	const patchnoteList: Patchnote[] = JSON.parse(props.patchnoteList)
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
	const maxPage = Math.ceil(patchnoteList.length / maxPatchesPerPage)
	//Setting session storage
	useEffect(() => {
		sessionStorage.setItem("newsPage", `${page}`)
	}, [page])
	//Togglin load more button when max page is reached
	useEffect(() => {
		const getIncrementButton = document.getElementById("increment_page_button") as HTMLDivElement
		
		function showButton() {
			console.log()
			if(page < maxPage) {
				getIncrementButton.style.display = ""
				
			} else {
				getIncrementButton.style.display = "none"
			}
		}
		showButton()
	}, [page, maxPage])
	
	//Adding + 1 to page state
	function increment_page() {
		if(page < maxPage) {
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
					<Patch_template_component patchnoteList={patchnoteList} page= {page} />

					<div className="news_load_more_button_container" id="news_load_more_button_container">
						<button onClick={increment_page} id="increment_page_button">Load More</button>
					</div>
				</div>
				
				<Footer />
			</div>
		</>
	);
}


//Component to create a Patch template
function Patch_template_component(props: any): ReactElement{
	const patchnoteList: Patchnote[] = props.patchnoteList
	const page = props.page
	console.log(page)
	//Generating Default patches. Rendering Array based on maxPatchesPerPage & page.
	function Patchnote_template(): ReactElement[] {
		const jsxPatch = patchnoteList.map((patchnote) => {

			return (
				<div key={`${patchnote.id}`} onClick={() => {navigateTo(`/news/${patchnote.id}`)}} className="patch_template_container">
					<div className="patch_preview_image_container">
						<Image quality="100%" priority={true} layout="fill" src={`/images/${patchnote.info.image}`} alt="A Theme image to represent that Patchnote."  className="patch_preview_image"/>
					</div>
					<div className="patch_information">
						<h2>{patchnote.info.update}</h2>
						<h1>{patchnote.info.title}</h1>
						<p>{patchnote.info.date}</p>
					</div>
				</div>
			)
		})
		
		return(jsxPatch.slice(0, maxPatchesPerPage * page))
	}
	

	return(
		<>
			{Patchnote_template() }
		</>
	)
}



//Serverside
import patchHandler from "../lib/patch_lib"
export const getStaticProps: GetStaticProps = async () => {
	//Getting an array of all patchnotes
	const patchnoteList = patchHandler.patchnoteListOrdered

	return{
		props: {
			patchnoteList: JSON.stringify(patchnoteList)
		}
	}
	
}