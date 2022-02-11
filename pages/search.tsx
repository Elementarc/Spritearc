import { useAnimation, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React, {useState, useEffect, useContext} from 'react';
import Footer from '../components/footer';
import { Nav_shadow } from '../components/navigation';
import Packs_section from '../components/packs_section';
import { capitalize_first_letter_rest_lowercase } from '../lib/custom_lib';
import ExpandIcon from "../public/icons/ExpandIcon.svg"
import Head from 'next/head';
const search_context: any = React.createContext(null)

export default function Search_page() {
	const router = useRouter()
	const search_query = typeof router.query.query === "string" ? router.query.query : ""
	useEffect(() => {
		const get_input = document.getElementById("search_input") as HTMLInputElement
		if(router.query.query as string) {
			get_input.defaultValue = router.query.query ? `${router.query.query}` : ""
		}
		

	}, [search_query, router.query])

	function search() {
		const input = document.getElementById("search_input") as HTMLInputElement

		router.push(`/search?query=${input.value}`, `/search?query=${input.value}`, {scroll: false})
	}

	function set_input_value(string: string) {
		const input = document.getElementById("search_input") as HTMLInputElement

		input.value = string
	}

	useEffect(() => {
		const get_input = document.getElementById("search_input") as HTMLInputElement

		get_input.focus()

		function search(e: any) {
			if(get_input === document.activeElement) {
				if(e.keyCode === 13) {
					const search_button = document.getElementById("search_button") as HTMLButtonElement
					search_button.click()
				}
			}
		}

		window.addEventListener("keyup", search)

		return(() => {
			window.removeEventListener("keyup", search)
		})
	}, [])
	
	return (
		<>
			<Head>
				<title>{`Spritearc - Search packs`}</title>
				<meta name="description" content={`Find Pixelart assets and sprites with just one click. You can search by tags to find specific genres.`}/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`Spritearc - Search packs`}/>
				<meta property="og:description" content={`Find Pixelart assets and sprites with just one click. You can search by tags to find specific genres.`}/>
				<meta property="og:image" content={`/images/wallpaper.png`}/>

				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content={`Spritearc - Search packs`}/>
				<meta name="twitter:description" content={`Find Pixelart assets and sprites with just one click. You can search by tags to find specific genres.`}/>
				<meta name="twitter:image:src" content={`/images/wallpaper.png`}/>
            </Head>
		
			<search_context.Provider value={{search, set_input_value}}>
				<div className='search_page'>

					<div className='content'>
						<Nav_shadow/>
						<div className='searching_container'>

							<div className='search_input_container'>
								<input type="text" placeholder='Search Tags' id="search_input"/>
								<button onClick={search} id="search_button">Search</button>
							</div>

						</div>

						<Search_recommendations/>

						{search_query &&
							<Search_results_packs search_query={search_query}/>
						} 

						{!search_query &&
							<div className='empty_container'>
								<h1>It looks empty in here :(</h1>
							</div>
						}
					</div>

					<Footer />
				</div>
			</search_context.Provider>

		</>
	);
}

function Search_results_packs({search_query}: {search_query: string}) {
	
	return(
		<div className='search_results_user_container'>
			<Packs_section section_name={`Packs that includes '${search_query}'`} api={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/search/${search_query}`} method='POST'/>
		</div>
	)
}

function Search_recommendations() {
	
	const [expand_state, set_expand_state] = useState(false)
	const expand_recommendations_animation = useAnimation()

	useEffect(() => {
		const icon = document.getElementById("expand_icon") as HTMLElement
		
		if(!expand_state) {
			expand_recommendations_animation.start({
				height: ""
			})
			icon.style.transform = "scale(1.5) rotate(0deg)"
		} else {
			expand_recommendations_animation.start({
				height: "auto"
				
			})
			icon.style.transform = "scale(1.5) rotate(180deg)"
		}
	}, [expand_recommendations_animation, expand_state, set_expand_state])

	return(
		<div className='recommendations_container'>
			<motion.div animate={expand_recommendations_animation} className='grid_items'>
				<Recommendation name='Rpg'/>
				<Recommendation name='Medival'/>
				<Recommendation name='Characters'/>
				<Recommendation name='Backgrounds'/>
				<Recommendation name='Enemies'/>
				<Recommendation name='Weapons'/>
				<Recommendation name='Furniture'/>
				<Recommendation name='Magic'/>
				<Recommendation name='Food'/>
				<Recommendation name='Armor'/>
				<Recommendation name='Scifi'/>
				<Recommendation name='Gothic'/>
			</motion.div>

			<div className='expand_container'>
				<div onClick={() => {set_expand_state(!expand_state)}} className='svg_container'>
					<div className='svg_wrapper'>
						<ExpandIcon id="expand_icon"/>
					</div>
				</div>
			</div>
		</div>
	)
}

function Recommendation({name}: {name: string}) {
	const search_c: any = useContext(search_context)
	
	return(
		<>
			<div onClick={() => {search_c.set_input_value(name); search_c.search()}} className='grid_item'>
				<p>{capitalize_first_letter_rest_lowercase(name)}</p>
			</div>
		</>
	)
}

