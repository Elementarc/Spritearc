import React, {useEffect, useState} from "react"
import { Public_user } from "../types"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import Loading from "./loading"

export default function Users_section({search_query}: {search_query: string}) {
	const [page, set_page] = useState(1)
	const [found_users_arr, set_found_users_arr] = useState<null | Public_user[] | []>(null)
    const [toggle_section, set_toggle_section] = useState(true)
    
    function next_page() {
		set_page(page + 1)
	}

    useEffect(() => {
        const users_section = document.getElementById("user_previews_container") as HTMLDivElement
        if(!users_section) return

        if(toggle_section) {
            users_section.style.display = "grid"
        } else {
            users_section.style.display = "none"
        }
        
    }, [toggle_section])
    
	useEffect(() => {

		function display_load_more(toggle: boolean) {
			const found_users_container = document.getElementById("load_more_users_container") as HTMLDivElement

			if(toggle) {
				found_users_container.style.display = "grid"
			} else {
				found_users_container.style.display = "none"
			}
			
		}

		async function search_users() {
            
			try {
                    
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/search/users/${search_query}?page=${page}`, {
                    method: "POST"
                })
                
				const response_obj = await response.json()
				if(!response_obj.success) return set_found_users_arr([])
				
				if(page < response_obj?.available_pages) {
					display_load_more(true)
				} else {
					display_load_more(false)
				}
				set_found_users_arr(response_obj?.users)

			} catch (err) {
				//Something went wrong
			}
			
		}
		search_users()

	}, [search_query, page])

	return(
		<>
			<div className='users_section_container' id="users_section_container">
				<h1 onClick={() => set_toggle_section(!toggle_section)}>{`${toggle_section ? `–` : `+` } Creators named '${search_query}'`}</h1>

				<User_previews public_users={found_users_arr}/>

				<div className='load_more_container' id="load_more_users_container">
					<span />
					<h1 onClick={next_page}>Load more</h1>
					<span />
				</div>
			</div>
		</>
	)
}

function User_previews({public_users}: {public_users: Public_user[] | null | []}) {
    
	const jsx_public_users = public_users?.map((public_user) => {

		return <User_preview key={public_user?.username} public_user={public_user}/>
	})
	
	return(
		<>
            
			<div className='user_previews_container' id="user_previews_container">

                {!public_users &&
                    <Loading loading={true} main_color={true}/>
                }
                
                <>
                    {jsx_public_users && jsx_public_users?.length === 0 &&
                        <div className='no_users_container'>
                            <h1>No Creators found!</h1>
                        </div>
                    }
                    
                    {
                        jsx_public_users
                    }
                </>

			</div>
		</>
	)
}

function User_preview({public_user}: {public_user: Public_user}) {
	const router = useRouter()
	return(
		<div className='user_container'>
			<div onClick={() => {router.push(`/user/${public_user?.username}`, `/user/${public_user?.username}`, {scroll: false})}} className='user_portrait_container'>
				<Image unoptimized={true} alt={`Profile picture of ${public_user?.username}.`} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${public_user?.profile_picture}`} layout="fill"></Image>
			</div>
			<Link href={`/user/${public_user?.username}`} scroll={false}>{public_user?.username}</Link>
		</div>
	)
}