import React, { ReactElement, useState, useMemo} from 'react';
import Image from "next/image"
import Eclipse from "../public/images/eclipse.jpg"
import Router from "next/router"
import Footer from '../components/footer';
import { Nav_shadow } from "../components/navigation";
import { useEffect } from 'react';
import { GetServerSideProps} from 'next'
import { Patchnote } from '../types';
import { formatDistanceStrict } from "date-fns"
import { useParallax } from '../lib/custom_hooks';
function navigateTo(path: string): void {
    Router.push(`${path}`, `${path}` , {scroll: false})
}


const max_patches_per_page = 2
//News Component
export default  function News(props: any): ReactElement {
	//All Patchnotes from server
	const patchnoteList: Patchnote[]  = useMemo(() => {
		return JSON.parse(props.patchnoteList)
	}, [props.patchnoteList])

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
	
	const lastPage = Math.ceil(patchnoteList.length / max_patches_per_page)
	//JSX Elements of initial patchnotes that will be rendered.
	const JSXInitialPatchnotes: ReactElement<Patchnote>[] = (() => {

		const jsxPatchnotes = patchnoteList.map((patchnote) => {

			return (
				<Patchnote_template key={patchnote.id} patchnote={patchnote} />
			)
		});

		return jsxPatchnotes.slice(0, max_patches_per_page)
	})();
	
	//JSX that contains extra patchnotes. Starts as an empty array.
	const [ExtraPatchnotes, setExtraPatchnotes] = useState<ReactElement[]>([])
	
	//Setting Extra patchnotes on
	useEffect(() => {
		//Setting a sessionItem when Page gets increased.
		sessionStorage.setItem("news_page", `${CurrentPage}`)
		//JSX That contains Patchnote_template components.
		const jsxPatchnotes = patchnoteList.map((patchnote) => {
	
			return (
				<Patchnote_template key={patchnote.id} patchnote={patchnote} />
			)
		})
		//
		setExtraPatchnotes(jsxPatchnotes.slice(max_patches_per_page, max_patches_per_page * CurrentPage));
	}, [CurrentPage, setExtraPatchnotes, patchnoteList])

	//Checking if Button Load more should be displayed or not.
	useEffect(() => {
		const getIncrementButton = document.getElementById("increment_page_button") as HTMLDivElement

		if(CurrentPage) {
			//Showing button when CurrentPage is smaller then LastPage
			if(CurrentPage < lastPage) {
				getIncrementButton.style.opacity = ""
				getIncrementButton.style.pointerEvents = ""
				
			} else {
				getIncrementButton.style.opacity = "0"
				getIncrementButton.style.pointerEvents = "none"
			}
		} 
	}, [CurrentPage, lastPage])
	
	//Function to increase CurrentPage.
	function increment_page() {
		
		if(CurrentPage < lastPage) {
			setPage(CurrentPage + 1)
		}
	}
	
	//Creating Parallax for img
	useParallax("news_background_image")
	return (
		<>
			<div className="news_page">

				<div className="content">

					<div className="header_container">

						<div className="background">
							<Image quality="100%" priority={true} src={Eclipse} layout="fill" alt="A pixelart image that displays a universe" className="background_image" id="news_background_image"/>
							<div className="background_blur" />
						</div>

						<div className="patch_list">
							<h2>Recent Updates</h2>
							<h1>Everything New About PixelPalast</h1>
							<p>We will occasionally release updates for PixelPalast. Here you can find our newest upcoming features that you might be interested in. Take a look!</p>
							<span />
						</div>

					</div>

					<div className="content_container">

						<div className="news_all_patch_container">
							{JSXInitialPatchnotes}
							{ExtraPatchnotes}

							<div className="news_load_more_button_container" id="news_load_more_button_container">
								<button onClick={increment_page} id="increment_page_button">Load More</button>
							</div>
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
function Patchnote_template(props: {patchnote: Patchnote}): ReactElement{
	const patchnote: Patchnote = props.patchnote

	const date = useMemo(() => {
		return new Date(patchnote.info.date)
	}, [patchnote.info.date])
	const [Distance, setDistance] = useState<string>(date.toString())
	
	//Setting distance of dates for patchnote template.
	useEffect(() => {
		const distance = formatDistanceStrict(date, new Date())
		setDistance(distance)

	}, [setDistance, date])

	return(
		<>
			<div key={`${patchnote.id}`} onClick={() => {navigateTo(`/news/${patchnote.id}`)}} className="patch_template_container">
				
				<div className="patch_preview_image_container">
					<Image quality="100%" priority={true} layout="fill" src={`/images/${patchnote.info.image}`} alt="A Theme image to represent that Patchnote."  className="patch_preview_image"/>
				</div>

				<div className="patch_information">
					<h2>{patchnote.info.update}</h2>
					<h1>{patchnote.info.title}</h1>
					<h4>{Distance} ago</h4>
				
				</div>
			</div>
		</>
	)
}

//Serverside
import patchHandler from "../lib/patch_lib"
export const getServerSideProps: GetServerSideProps = async () => {
	const patchnoteList: Patchnote[] = patchHandler.patchnoteListOrdered
	
	return {
		props: {
			patchnoteList: JSON.stringify(patchnoteList)
		}
	}
}