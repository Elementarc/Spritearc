import React, {useContext, useEffect} from 'react';
import Link from 'next/dist/client/link';
import { App_context, Pack_info } from '../types';
import Image from 'next/dist/client/image';
import { APP_CONTEXT } from './layout';


export function Packs_navigator(props: {page: number, setPage: any, lastPage: number}) {
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
export default function Pack_preview(props: {pack: Pack_info}) {
	const APP: App_context = useContext(APP_CONTEXT)
    const pack: Pack_info = props.pack

	return (
        <Link href={`/pack?id=${pack._id}`} scroll={false}>

            <div className="pack_preview_container">

                <div className="content_container">
                    <h1>{pack.title}</h1>
                    <h2>{pack.sub_title}</h2>
                </div>
                
                <div className="background_container">
					<Image priority={true} src={`/packs/${pack._id}/${pack.preview_image}`} layout="fill" className="background_image"/>
                    <div className="background_blur" />
                    <div className="background_blur_hover" />
                </div>

            </div>

        </Link>
	);
}