import { useAnimation, motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import React, {useState, useEffect, useContext, useRef, useCallback} from 'react';
import Footer from '../components/footer';
import { capitalize_first_letter_rest_lowercase } from '../lib/custom_lib';
import ExpandIcon from "../public/icons/ExpandIcon.svg"
import ProfileIcon from "../public/icons/ProfileIcon.svg"
import PacksIcon from "../public/icons/PacksIcon.svg"
import CloseIcon from "../public/icons/CloseIcon.svg"
import Users_section from '../components/users_section';
import { validate_search_query } from '../spritearc_lib/validate_lib';
import { Dropdown } from '../components/dropdown';
import PackPreviewsSection from '../components/packPreviewsSection';
import PageContent from '../components/layout/pageContent';
import MetaGenerator from '../components/MetaGenerator';
import SearchBar, { ESearchBarType } from '../components/searchBar';



export default function PageRenderer() {
  return (
	<>
		<MetaGenerator
			title='Spritearc - Search'
			description='Search pixel art assets and sprites with just one click. You can search by tags to find specific genres.' 
			url='https://Spritearc.com/search'
			imageLinkSecure={`https://${process.env.NEXT_PUBLIC_APP_NAME}.com/images/spritearc_wallpaper.png`}
		/>
	
		<SearchPage/>
		<Footer/>
	</>
  );
}

function SearchPage() {
	const router = useRouter()
	const [perspective, setPerspective] = useState<null | string>(null)
	const [size, setSize] = useState<null | string>(null)
	const [license, setLicense] = useState<null | string>(null)
	const [searchQuery, setSearchQuery] = useState<null | string>(null)

	useEffect(() => {
	 	setSearchQuery(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/search/packs/${router.query.query}?perspective=${perspective?? 'null'}&size=${size ?? 'null'}&license=${license ?? ''}`)
	}, [router, license, perspective, size])
	
	return (
		<PageContent>
			<div className='search_top_container'>
				<div className='searchbar_wrapper'>
					<SearchBar placeholder='Search by Tags' type={ESearchBarType.PACKS}/>
				</div>
				<div className='dropdowns'>
					<Dropdown 
						label='Perspective' 
						reset_option='All'  
						options={["Top-Down", "Side-Scroller", "Isometric", "UI"]} 
						active_state={perspective} 
						set_active_state={setPerspective}
					/>
					<Dropdown 
						label='Size' 
						reset_option='All' 
						options={["8x8", "16x16", "32x32", "48x48", "64x64", "80x80", "96x96", "112x112", "128x128", "256x256"]} 
						active_state={size} 
						set_active_state={setSize}
					/>
					<Dropdown 
						label='License' 
						reset_option='All' 
						options={["Opensource", "Attribution"]} 
						active_state={license} 
						set_active_state={setLicense}
					/>
				</div>
			</div>
			<div className='pack_previews_wrapper'>
				<PackPreviewsSection label={`Searching for ${router.query.query ?? ''}`} api={searchQuery ?? ''}/>
			</div>
		</PageContent>
	);
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

