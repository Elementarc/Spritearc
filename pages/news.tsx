import React, { ReactElement, useState, useMemo} from 'react';
import Image from "next/image"
import Eclipse from "../public/images/eclipse.jpg"
import Router from "next/router"
import Footer from '../components/footer';
import { Nav_shadow } from "../components/navigation";
import { useEffect } from 'react';
import { Patchnote } from '../types';
import { formatDistanceStrict } from "date-fns"
import { useParallax } from '../lib/custom_hooks';
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Loader from '../components/loading';



function navigateTo(path: string): void {
    Router.push(`${path}`, `${path}` , {scroll: false})
}

//News Component
export default  function News(): ReactElement {
	const [patchnotes, set_patchnotes] = useState<null | Patchnote[] | []>(null)
	const [page, set_page] = useState(1)

	useEffect(() => {
		const controller = new AbortController()
		
		async function fetch_patchnotes() {

			function display_load_more(state: boolean) {
				const load_more = document.getElementById("news_load_more_button_container") as HTMLDivElement
				if(!load_more) return
				if(state === true) {
					load_more.style.display = ""
				} else {
					load_more.style.display = "none"
				}
			}

			try {
				display_load_more(false)
				const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/get_patchnote_list?page=${page}`, {
					method: "GET",
					signal: controller.signal,
				})
				

				if(response.status === 200) {
					const patchnote_obj: {patchnotes: Patchnote[], max_page: number} = await response.json()
					const patchnotes: Patchnote[] = patchnote_obj.patchnotes
					const max_pages: number = patchnote_obj.max_page

					if( page >= max_pages) {
						display_load_more(false)
						
					} else {
						display_load_more(true)
						console.log("test")
					}
					
					set_patchnotes(patchnotes)
				} else {
					set_patchnotes([])
					display_load_more(false)
				}

			} catch(err) {
				//Coudlnt reach server
				display_load_more(false)
			}
		}

		fetch_patchnotes()

		return(() => {
			controller.abort()
		})
	}, [page, set_patchnotes])
	
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
							<h1>Everything New About {process.env.NEXT_PUBLIC_APP_NAME}</h1>
							<p>We will occasionally release updates for {process.env.NEXT_PUBLIC_APP_NAME}. Here you can find our newest upcoming features that you might be interested in. Take a look!</p>
							<span />
						</div>

					</div>

					<div className="content_container">

						<div className="news_all_patch_container">
							{patchnotes && patchnotes.length > 0 &&
								<Patchnote_templates patchnotes={patchnotes}/>
							}
							{patchnotes === null &&
								<Loader loading={true} main_color={true}/>
							}

							<div className="news_load_more_button_container" id="news_load_more_button_container">
								<button onClick={() => {set_page(page + 1)}} id="increment_page_button">Load More</button>
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
function Patchnote_templates(props: {patchnotes: Patchnote[]}): ReactElement{
	const patchnotes: Patchnote[] | [] = props.patchnotes
	
	
	let patchnote_templates = []
	for(let patchnote of patchnotes) {
		const distance = formatDistanceStrict(new Date(patchnote.info.date), new Date())

		patchnote_templates.push(
			<div key={`${patchnote.id}`} onClick={() => {navigateTo(`/news/${patchnote.id}`)}} className="patch_template_container">
				
				<div className="patch_preview_image_container">
					<Image quality="100%" priority={true} layout="fill" src={`/images/${patchnote.info.image}`} alt="A Theme image to represent that Patchnote."  className="patch_preview_image"/>
				</div>

				<div className="patch_information">
					<h2>{patchnote.info.update}</h2>
					<h1>{patchnote.info.title}</h1>
					<h4>{distance} ago</h4>
				
				</div>
			</div>
		)
	}

	return(
		<>
			{patchnote_templates}
		</>
	)
}

