import { useAnimation, motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import React, {useState, useEffect, useContext, useRef, useCallback} from 'react';
import Footer from '../components/footer';
import { Nav_shadow } from '../components/navigation';
import Packs_section from '../components/packs_section';
import { capitalize_first_letter_rest_lowercase } from '../lib/custom_lib';
import ExpandIcon from "../public/icons/ExpandIcon.svg"
import ProfileIcon from "../public/icons/ProfileIcon.svg"
import PacksIcon from "../public/icons/PacksIcon.svg"
import CloseIcon from "../public/icons/CloseIcon.svg"
import Head from 'next/head';
import Users_section from '../components/users_section';
import { validate_search_query } from '../spritearc_lib/validate_lib';
import { Drop_down } from '../components/dropdown';

const search_context: any = React.createContext(null)

export default function Search_page() {
	const router = useRouter()
	const refs: any = useRef([])
	const [show_delete_search_query_icon, set_show_delete_search_query_icon] = useState(false)
	const [search_perspective, set_search_perspective] = useState<null | string>(null)
	const [search_size, set_search_size] = useState<null | string>(null)
	const [search_license, set_search_license] = useState<null | string>(null)
	const [search_packs, set_search_packs] = useState(true)
	const [search_query, set_search_query] = useState("")
	
	function search() {
		const search_input = refs.current["search_input"] as HTMLInputElement
		const valid_search_query = validate_search_query(search_input.value)
		if(!valid_search_query) return

		router.push(`/search?query=${search_input.value.toLowerCase()}`, `/search?query=${search_input.value.toLowerCase()}`, {scroll: false})
	}

	function delete_input_value() {
		const search_input = refs.current["search_input"] as HTMLInputElement

		search_input.value = ""
		validate_input_value()
		set_show_delete_search_query_icon(false)

	}

	function validate_input_value() {
		const search_button = document.getElementById("search_button") as HTMLInputElement
		const search = refs.current["search_input"].value as string
		const valid_search = validate_search_query(search)


		if(valid_search === true) {
			search_button.classList.add("active_search_button")
		} else {
			search_button.classList.remove("active_search_button")
		}
	}
	
	useEffect(() => {
		if(sessionStorage.getItem("search_size")) sessionStorage.getItem("search_size")?.toLowerCase() === "all" ? set_search_perspective(null) : sessionStorage.getItem("search_size")
		if(sessionStorage.getItem("search_perspective")) set_search_perspective(sessionStorage.getItem("search_perspective")) 
		if(sessionStorage.getItem("search_license")) set_search_license(sessionStorage.getItem("search_license")) 
	}, [set_search_size, set_search_perspective, set_search_license])

	useEffect(() => {
		const search_input = refs.current["search_input"]

		if(typeof router?.query?.query === "string") {
			set_search_query(router?.query?.query)
			search_input.value = router?.query?.query
		} else {
			set_search_query("")
			search_input.value = ""
		}

	}, [refs, router])

	useEffect(() => {
		const search_input = refs.current["search_input"] as HTMLInputElement
		search_input.focus()
	}, [refs])

	//Checking if query and setting value of input + setting show_delete_search_query_icon.
	useEffect(() => {

		if(search_query.length === 0) {
			set_show_delete_search_query_icon(false)
		} else {
			set_show_delete_search_query_icon(true)
		}
		validate_input_value()

		window.scrollTo({
			top: 0,
			behavior: "smooth"
		})

	}, [search_query, refs, set_show_delete_search_query_icon])

	useEffect(() => {
		const search_input = refs.current["search_input"] as HTMLInputElement

		function search_by_pressing_enter(e: any) {
			const valid_search = validate_search_query(search_input.value)
			if(typeof valid_search === "string") return
			
			if(search_input === document.activeElement) {
				if(e.keyCode === 13) {
					const search_button = document.getElementById("search_button") as HTMLButtonElement
					search_button.click()
				}
			}
		}

		window.addEventListener("keyup", search_by_pressing_enter)

		return(() => {
			window.removeEventListener("keyup", search_by_pressing_enter)
		})
	}, [refs])

	//Setting event to input to show_delete_search_query_icon should be set to true / false on keyup.
	useEffect(() => {
		const search_input = refs.current["search_input"] as HTMLInputElement

		function toggle_delete_search_query() {

			if(search_input.value.length === 0) return set_show_delete_search_query_icon(false)
			return set_show_delete_search_query_icon(true)
		}
		
		search_input.addEventListener("keyup", toggle_delete_search_query)

		return(() => {
			search_input.removeEventListener("keyup", toggle_delete_search_query)
		})
	}, [refs, set_show_delete_search_query_icon])

	return (
		<>
			<Head>
				<title>{`Spritearc - Search packs`}</title>
				<meta name="description" content={`Find Pixel art assets and sprites with just one click. You can search by tags to find specific genres.`}/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`Spritearc - Search packs`}/>
				<meta property="og:description" content={`Find Pixel art assets and sprites with just one click. You can search by tags to find specific genres.`}/>
				<meta property="og:image" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>


				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content={`Spritearc - Search packs`}/>
				<meta name="twitter:description" content={`Find Pixel art assets and sprites with just one click. You can search by tags to find specific genres.`}/>
				<meta name="twitter:image:src" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>
            </Head>
		
			<search_context.Provider value={{search}}>
				<div className='search_page'>

					<div className='content'>
						<Nav_shadow/>
						<div className='searching_container'>

							<div className='search_input_container'>

								<div className='input_container'>
									<input ref={(el) => {refs.current["search_input"] = el}} onKeyUp={validate_input_value} onChange={validate_input_value} onBlur={validate_input_value} type="text" placeholder={search_packs ? "Search Packs" : "Search Creators"} id="search_input"/>
									
									<div className='delete_search_query_container'>

										{show_delete_search_query_icon &&
											<div onClick={delete_input_value} className='svg_wrapper'>
												<CloseIcon/>
											</div>
										}
										
									</div>

									<div className='toggle_search_state_container'>

										<AnimatePresence exitBeforeEnter>

											{search_packs === false &&
												<motion.div key="search_users" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.12}}} onClick={() => {set_search_packs(!search_packs)}} className='svg_wrapper'>
													<PacksIcon />
												</motion.div>
											}

											{search_packs === true &&
												<motion.div key="search_packs" initial={{scale: 0.9}} animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} exit={{scale: 0, transition: {duration: 0.12}}} onClick={() => {set_search_packs(!search_packs)}} className='svg_wrapper'>
													<ProfileIcon />
												</motion.div>
											}
											
											

										</AnimatePresence>
									</div>
									
								</div>

								<button onClick={search} id="search_button">Search</button>
							</div>

							
							{search_packs &&
								<div className='extra_options_container_wrapper'>
									<Drop_down label='Perspective' reset_option='All'  options={["Top-Down", "Side-Scroller", "Isometric", "UI"]} active_state={search_perspective} set_active_state={set_search_perspective}/>
									<Drop_down label='Size' reset_option='All' options={["8x8", "16x16", "32x32", "48x48", "64x64", "80x80", "96x96", "112x112", "128x128", "256x256"]} active_state={search_size} set_active_state={set_search_size}/>
									<Drop_down label='License' reset_option='All' options={["Opensource", "Attribution"]} active_state={search_license} set_active_state={set_search_license}/>
								</div>
							}
							

						</div>

						{search_packs === true &&
							<Search_recommendations set_search_query={set_search_query}/>
						}
						

						{search_query &&
							<>
								{search_packs === false &&
									<div className='search_results_user_container'>
										<Users_section search_query={search_query} />
									</div>
								}

								{search_packs === true &&
									<Search_results_packs search_query={search_query} search_perspective={search_perspective} search_size={search_size} search_license={search_license}/>
								}
								
							</>
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

function Search_results_packs({search_query, search_perspective, search_size, search_license}: {search_query: string, search_perspective: null | string, search_size: null | string, search_license: null | string}) {
	
	return(
		<div className='search_results_user_container'>
			<Packs_section section_name={`Packs that includes '${search_query}'`} api={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/search/packs/${search_query}`} method='POST' body={JSON.stringify({search_perspective, search_size, search_license})}/>
		</div>
	)
}

function Search_recommendations(props: {set_search_query: React.Dispatch<React.SetStateAction<string>>}) {
	let recommandation_arr = [
		"ALL","Rpg","Fantasy","Medieval",
		"Scifi","Gothic","Arcade",
		"Horror","Thriller","Christmas",
		"Halloween","Romance","Vampire",
		"Mechanical", "Space", "Retro",
		"Mafia", "Farm", "Futuristic",
		"Dungeon","Portrait","Anime",
		"Tiles","Tilemap","Platformer",
		"City","Enviroment","Animals",
		"Classes","Fonts","Asteroids",
		"Animations","Sprites","Characters",
		"Backgrounds","Monsters","Weapons",
		"Furniture","Magic","Food"
		,"Armor", "Aliens", "Atmospheric",
		"Survival",

	]
	const [expand_state, set_expand_state] = useState(false)
	const expand_recommendations_animation = useAnimation()

	useEffect(() => {
		const icon = document.getElementById("expand_icon") as HTMLElement
		const grid_items = document.getElementById("grid_items_container") as HTMLDivElement

		if(!expand_state) {
			grid_items.scrollTop = 0
			expand_recommendations_animation.start({
				height: "",
				overflowY: "hidden",
			})
			icon.style.transform = "scale(1.5) rotate(0deg)"
		} else {
			expand_recommendations_animation.start({
				height: "250px",
				overflowY: "scroll"
			})
			icon.style.transform = "scale(1.5) rotate(180deg)"
		}
	}, [expand_recommendations_animation, expand_state, set_expand_state])


	let recommendation_jsx = []

	for(let recommandation of recommandation_arr) {
		recommendation_jsx.push(
			<Recommendation key={recommandation} name={capitalize_first_letter_rest_lowercase(recommandation)} set_search_query={props.set_search_query}/>
		)
	}
	return(
		<div className='recommendations_container'>
			<motion.div animate={expand_recommendations_animation} className='grid_items_container' id="grid_items_container">
				
				<div className='grid_items'>
					{recommendation_jsx}
				</div>
				
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

function Recommendation({name, set_search_query}: {name: string, set_search_query: React.Dispatch<React.SetStateAction<string>>}) {
	const router = useRouter()
	return(
		<>
			<div onClick={() => {router.push(`/search?query=${name.toLowerCase()}`, `/search?query=${name.toLowerCase()}`, {scroll: false})}} className='grid_item'>
				<p style={name.toLowerCase() === "all" ? {color: "#F7C35E"}: {}}>{capitalize_first_letter_rest_lowercase(name)}</p>
			</div>
		</>
	)
}

