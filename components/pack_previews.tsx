import React, {ReactElement, useState, useEffect} from 'react';
import Link from 'next/dist/client/link';
import { Pack , RecentPacksResponse} from '../types';
import Image from 'next/dist/client/image';


export function Recent_packs(props: {recentPacksResponse: RecentPacksResponse}) {
	//Packs Response from server.
	const recentPacks: Pack[] = props.recentPacksResponse.packs
	const lastPage = props.recentPacksResponse.lastPage

	//JSX RecentPacks that will be rendered
	const [RecentPacks, setRecentPacks] = useState(() => {
		let jsxRecentPacks: ReactElement<Pack>[] = []
		for(let pack of recentPacks) {
			jsxRecentPacks.push(<Pack_preview key={pack._id} pack={pack}/>)
		}
		return jsxRecentPacks
	})
	const [Page, setPage] = useState(1)
	
	//Fetches more RecentPacks from Server to then set setRecentPack that displays it.
	useEffect(() => {
		async function getRecentPacksFromServer() {
			//Fetch call for recentpacks with page query. 
			const recentPacksRes: RecentPacksResponse = await (await fetch(`http://localhost:3000/api/getRecentPacks?page=${Page}`)).json()
			//Creating a jsxArray of Pack_preview components.
			let jsxRecentPacks: ReactElement<Pack>[] = []
			for(let pack of recentPacksRes.packs) {
				jsxRecentPacks.push(<Pack_preview key={pack._id} pack={pack}/>)
			}
			//Setting RecentPacks to new JsxRecentPacks that is gonna be displayed.
			setRecentPacks(jsxRecentPacks)
		}
		getRecentPacksFromServer()
	}, [Page, setRecentPacks])
	
	return (
		<div className="recent_packs_container">
			
			<div className="recent_packs_info_container">
				<h1>– Recent Packs</h1>
				<Link href="#" scroll={false}><a>View all</a></Link>
			</div>

			<div className="packs_container">
				{RecentPacks}
			</div>

			<Packs_navigator page={Page} setPage={setPage} lastPage={lastPage}/>
		</div>
	);
}

export default function Packs_navigator(props: {page: number, setPage: any, lastPage: number}) {
	const page = props.page
	const setPage = props.setPage
	const lastPage = props.lastPage
	//Setting value of input to page. Also Checking if buttons should be displayed.
	useEffect(() => {
		const getPageInput = document.getElementById("Packs_navigator_page_input") as HTMLInputElement
		const getPrevButton = document.getElementById("prev_page") as HTMLButtonElement
		const getNextButton = document.getElementById("next_page") as HTMLButtonElement
		getPageInput.value = page.toString()

		//Prev Button will be shown if page > 1
		if(page > 1) {
			
			getPrevButton.style.opacity = "1"
			getPrevButton.style.pointerEvents = ""
		} else {
			getPrevButton.style.opacity = "0"
			getPrevButton.style.pointerEvents = "none"
		}
		//Hide Packs_navigator when no next page is available.
		if(page === lastPage ) {
			
			getNextButton.style.opacity = "0"
			getNextButton.style.pointerEvents = "none"
		} else {
			getNextButton.style.opacity = ""
			getNextButton.style.pointerEvents = ""
		}
	}, [page])

	function increase_page() {
		if(page < lastPage) {
			setPage(page + 1)
		}
	}

	function decrease_page() {
		if(page > 1) {
			setPage(page - 1)
		}
	}
	return (
		<div className="page_navigator_container">
			<button onClick={decrease_page} className="prev_page" id="prev_page">Prev Page</button>
			<input type="text" name="" id="Packs_navigator_page_input"/>
			<button onClick={increase_page} className="next_page" id="next_page">Next Page</button>
		</div>
	);
}
//Component that represents 1 Pack preview. Takes a Pack obj as a property.
export function Pack_preview(props: {pack: Pack}) {
    const pack: Pack = props.pack
	return (
        <Link href={`/pack?id=${pack._id}`}>
            <div className="pack_preview_container">

                <div className="content_container">
                    <h1>{pack.title}</h1>
                    <h2>{pack.subTitle}</h2>
                </div>
                
                <div className="background_container">
                    <Image priority={true} src={pack.previewImage} layout="fill" className="background_image"/>
                    
                    <div className="background_blur" />
                    <div className="background_blur_hover" />
                </div>

            </div>
        </Link>
	);
}