import React, { ReactElement, useState, useCallback} from 'react';
import Head from "next/head"
import Image from "next/image"
import Eclipse from "../public/images/eclipse.jpg"
import Router from "next/router"
import Footer from '../components/footer';
import { useEffect } from 'react';
import { GetStaticProps} from 'next'
import { Patchnote } from '../types';
import { formatDistanceStrict } from "date-fns"
import { motion, useViewportScroll} from 'framer-motion';
function navigateTo(path: string): void {
    Router.push(`${path}`, `${path}` , {scroll: false})
}

const maxPages = 4
//News Component
export default  function News(props: any): ReactElement {
	//All Patchnotes
	const patchnoteList: Patchnote[] = JSON.parse(props.patchnoteList)
	const [CurrentPage, setPage] = useState(() => {
		if(process.browser) {
			const page = sessionStorage.getItem("news_page")
			if(typeof page === "string") {
				return parseInt(page)
			} else {
				return 1
			}
		} else {
			return 1
		}
	})
	const lastPage = Math.ceil(patchnoteList.length / maxPages)
	//JSX Elements of Initial Patchnotes that will be rendered
	const JSXInitialPatchnotes: ReactElement<Patchnote>[] = (() => {

		const jsxPatchnotes = patchnoteList.map((patchnote) => {

			return (
				<Patchnote_template key={patchnote.id} patchnote={patchnote} />
			)
		});

		return jsxPatchnotes.slice(0, maxPages)
	})();
	
	//JSX Elements That renders More Patchnotes based on Page state
	const [ExtraPatchnotes, setExtraPatchnotes] = useState<ReactElement[]>([])
	
	//Creating extra patchnotes whenever currentpage gets increased
	useEffect(() => {
		sessionStorage.setItem("news_page", `${CurrentPage}`)
		function create_extra_patchnotes() {
			const jsxPatchnotes = patchnoteList.map((patchnote) => {
	
				return (
					<Patchnote_template key={patchnote.id} patchnote={patchnote} />
				)
			})
	
			setExtraPatchnotes(jsxPatchnotes.slice(maxPages, maxPages * CurrentPage));
		}
		create_extra_patchnotes()
	}, [CurrentPage])

	//Button Load More. Checking if button should be displayed
	useEffect(() => {
		const getIncrementButton = document.getElementById("increment_page_button") as HTMLDivElement

		function showButton(page: number | undefined) {
			if(page) {
				//Showing button when not reached last page
				if(page < lastPage) {
					getIncrementButton.style.opacity = ""
					getIncrementButton.style.pointerEvents = ""
					
				} else {
					getIncrementButton.style.opacity = "0"
					getIncrementButton.style.pointerEvents = "none"
				}
			} 
		}

		showButton(CurrentPage)
	}, [CurrentPage, lastPage])
	
	//Adding + 1 to page query
	function increment_page() {
		
		if(CurrentPage < lastPage) {
			setPage(CurrentPage + 1)
		}
	}
	
	//Parallax effect for backgroundImage
	const { scrollY } = useViewportScroll()
	useEffect(() => {
		const getBackgroundImagContainer = document.getElementById("news_background_image_container") as HTMLDivElement
		function parallax() {
			getBackgroundImagContainer.style.transform = `translateY(-${scrollY.get() / 3.5}px)`
		}

		window.addEventListener("scroll", parallax)

		return(() => {
			window.removeEventListener("scroll", parallax)
		})
	}, [])

	return (
		<>
			<Head>
				<title>Pixel News</title>
				<meta name="description" content="You can see the patchnotes of our application"/>
			</Head>

			<div className="news_container">

				<div className="news_header_container">

					<div className="news_background_container">
						<motion.div className="news_background_image_container" id="news_background_image_container">
							<Image quality="100%" priority={true} src={Eclipse} layout="fixed" alt="A Background image for header. Represent a cool planet." className="news_background_image" id="news_background_image"/>
						</motion.div>
						<div className="news_background_blur" />
					</div>

					<div className="header_content_container">
						<h2>Recent Updates</h2>
						<h1>Everything New About PixelPalast</h1>
						<p>We will release occasional updates for PixelPalast. If you want to stay tuned you should come here and visit sometimes.</p>
						<span />
					</div>
					
				</div>
				
				<div className="news_content_container">

					<div className="news_all_patch_container">
						{JSXInitialPatchnotes}
						{ExtraPatchnotes}
					</div>
					

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
function Patchnote_template(props: any): ReactElement{
	const patchnote: Patchnote = props.patchnote
	const date = new Date(patchnote.info.date)
	const distance = formatDistanceStrict(date, new Date())
	

	return(
		<>
			<div key={`${patchnote.id}`} onClick={() => {navigateTo(`/news/${patchnote.id}`)}} className="patch_template_container">
				<div className="patch_preview_image_container">
					<Image quality="100%" priority={true} layout="fill" src={`/images/${patchnote.info.image}`} alt="A Theme image to represent that Patchnote."  className="patch_preview_image"/>
				</div>
				<div className="patch_information">
					<h2>{patchnote.info.update}</h2>
					<h1>{patchnote.info.title}</h1>
					<p>{distance} ago</p>
				</div>
			</div>
		</>
	)
}



//Serverside
import patchHandler from "../lib/patch_lib"
export const getStaticProps: GetStaticProps = async () => {
	const patchnoteList: Patchnote[] = patchHandler.patchnoteListOrdered
	
	return {
		props: {
			patchnoteList: JSON.stringify(patchnoteList)
		}
	}
}