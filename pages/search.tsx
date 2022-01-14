import { useAnimation, motion } from 'framer-motion';
import React, {useState, useEffect, useContext} from 'react';
import Footer from '../components/footer';
import { Nav_shadow } from '../components/navigation';
import Packs_section from '../components/packs_section';
import { capitalize_first_letter_rest_lowercase } from '../lib/custom_lib';
import ExpandIcon from "../public/icons/ExpandIcon.svg"

const search_context: any = React.createContext(null)

export default function Search_page() {
	const [search_query, set_search_query] = useState<string | null>(null)

	useEffect(() => {

		const get_input = document.getElementById("search_input") as HTMLInputElement
		get_input.defaultValue = search_query ? `${search_query}` : ""

	}, [search_query])

	function set_query() {
		const input = document.getElementById("search_input") as HTMLInputElement

		set_search_query(input.value)
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
		<search_context.Provider value={set_search_query}>
			<div className='search_page'>

				<div className='content'>
					<Nav_shadow/>
					<div className='searching_container'>

						<div className='search_input_container'>
							<input type="text" placeholder='Search Tags' id="search_input"/>
							<button onClick={set_query} id="search_button">Search</button>
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
	);
}

function Search_results_packs({search_query}: {search_query: string}) {
	
	return(
		<div className='search_results_user_container'>
			<Packs_section section_name={`Packs that includes '${search_query}'`} api={`/search/${search_query}`} method='POST'/>
		</div>
	)
}

function Search_recommendations() {
	
	const [expand_state, set_expand_state] = useState(false)
	const expand_recommendations_animation = useAnimation()
	const expand_icon_animation = useAnimation()

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
				<Recommendation name='Omegalul'/>
				<Recommendation name='Rpg'/>
				<Recommendation name='Monsters'/>
				<Recommendation name='Rpg'/>
				<Recommendation name='Monsters'/>
				<Recommendation name='Rpg'/>
				<Recommendation name='Monsters'/>
				<Recommendation name='Rpg'/>
				<Recommendation name='Monsters'/>
				<Recommendation name='Rpg'/>
				<Recommendation name='Monsters'/>
				<Recommendation name='Rpg'/>
				<Recommendation name='Monsters'/>
				<Recommendation name='Rpg'/>
				<Recommendation name='Monsters'/>
				<Recommendation name='Rpg'/>
				<Recommendation name='Monsters'/>
				<Recommendation name='Rpg'/>
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
	const set_search_query: any = useContext(search_context)

	
	return(
		<>
			<div onClick={() => {set_search_query(name)}} className='grid_item'>
				<p>{capitalize_first_letter_rest_lowercase(name)}</p>
			</div>
		</>
	)
}

