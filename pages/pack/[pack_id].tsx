import React, {ReactElement, useEffect, useContext, useState, useCallback, useRef} from 'react';
import Footer from '../../components/footer';
import {Pack_content, Pack, Public_user, Pack_rating, App_notification_context_type, Auth_context_type, Server_response, Server_response_pack, Server_response_pack_rating, Server_response_public_user} from "../../types"
import Link from 'next/dist/client/link';
import Image from 'next/dist/client/image';
import { Nav_shadow } from '../../components/navigation';
import { useParallax } from '../../lib/custom_hooks';
import ArrowIcon from "../../public/icons/ArrowIcon.svg"
import CloseIcon from "../../public/icons/CloseIcon.svg"
import ReportIcon from "../../public/icons/ReportIcon.svg"
import { useRouter } from 'next/router';
import { AnimatePresence , motion} from 'framer-motion';
import H1_with_deco from '../../components/h1_with_deco';
import { format_date } from '../../lib/date_lib';
import { capitalize_first_letter_rest_lowercase } from '../../lib/custom_lib';
import StarEmptyIcon from "../../public/icons/StarEmptyIcon.svg"
import StarIcon from "../../public/icons/StarIcon.svg"
import Pack_star_raiting from '../../components/pack_stars_raiting';
import Fixed_app_content_overlay from '../../components/fixed_app_content_overlay';
import ThrashIcon from "../../public/icons/ThrashIcon.svg"
import { App_notification_context } from "../../context/app_notification_context_provider";
import {NOTIFICATION_ACTIONS} from "../../context/app_notification_context_provider"
import Head from 'next/dist/shared/lib/head'
import { Auth_context } from '../../context/auth_context_provider';
import { GetServerSideProps } from 'next'
import https from "https"
import http from "http"
import HelpIcon from "../../public/icons/HelpIcon.svg"
import { validate_paypal_donation_link } from '../../spritearc_lib/validate_lib';
import Loading from '../../components/loading';

const PACK_PAGE_CONTEXT: any = React.createContext(null)


export default function Pack_page_handler({server_pack_response}: {server_pack_response: Server_response_pack}) {
    const pack = server_pack_response.pack

    return (
        <div>
            {pack &&
                <Pack_page pack={pack} />
            }
        </div>
    );
}

function Pack_page(props: {pack: Pack}) {
    const App_notification: App_notification_context_type = useContext(App_notification_context)
    const Auth: Auth_context_type = useContext(Auth_context)
    const pack = props.pack

    return(
        <>
            <Head>
				<title>{`${pack?.username} - ${pack?.title}`}</title>
				<meta property="description" content={`${pack?.description}`}/>
                <meta property='keywords' content={`pixel art,${pack?.tags.join(",")}`}/>

				<meta property="og:url" content={`https://Spritearc.com/pack?id=${pack?._id}`}/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`${pack?.username} - ${pack?.title}`}/>
				<meta property="og:description" content={`${pack?.description}`}/>
				<meta property="og:image" content={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/packs/${pack?._id}/${pack?.preview}`}/>
				<meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/packs/${pack?._id}/${pack?.preview}`}/>

				<meta property="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content={`https://Spritearc.com/pack?id=${pack._id}`}/>
				<meta property="twitter:title" content={`${pack?.username} - ${pack.title}`}/>
				<meta property="twitter:description" content={`${pack?.description}`} />
				<meta property="twitter:image" content={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/packs/${pack?._id}/${pack?.preview}`}/>
            </Head>

            <Memo_user_pack pack={pack} App_notification={App_notification} Auth={Auth}/>
        </>
    )
}
function User_pack(props: {pack: Pack, App_notification: App_notification_context_type, Auth: Auth_context_type}) {
    const router = useRouter()
    const pack_id = router.query.pack_id as string
    const Auth = props.Auth
    
    //
    const [toggle_download_container, set_toggle_download_container] = useState(false)
    //Props
    const pack: Pack = props.pack
    const user: Public_user = Auth?.user?.public_user
    const own_pack = user?.username.length > 0 ? user?.username.toLowerCase() === pack?.username.toLowerCase() : false
    
    //Context
    const App_notification: App_notification_context_type = props.App_notification
    //State that saves currently clicked asset as a url string.
    const [focus_img_src, set_focus_img_src] = useState<null | string>(null)
    //State to toggle delete pack confirmation container
    const [delete_confirmation_state, set_delete_confirmation_state] = useState(false)
    const [report_confirmation_state, set_report_confirmation_state] = useState(false)
    //Pack ratings
    const [prev_pack_ratings, set_prev_pack_ratings] = useState<Pack_rating[]>(pack.ratings)

    //Creating parallax effect for Image
    useParallax("title_pack_background_image")

    //Toggling arrow svg when scrollY > 0
    useEffect(() => {
        //Function that toggles the arrow. Getting called whenever scrolling is happening.
        function toggle_arrow() {
            const arrow_down = document.getElementById("arrow_down") as HTMLDivElement
            if(!arrow_down) return
            if(window.scrollY > 0 ) {
                arrow_down.style.opacity = "0"
            } else {
                arrow_down.style.opacity = "1"
            }
        }

        window.addEventListener("scroll", toggle_arrow)
        
        return(() => {
            window.removeEventListener("scroll", toggle_arrow)
        })
    }, [])
  
    
    function toggle_asset(src: string) {
        if(src) {
            set_focus_img_src(src)
        } else {
            set_focus_img_src(null)
        }
    }
    function report_pack_validation() {
        const report_input = document.getElementById("report_input") as HTMLInputElement
        const report_pack_error_message = document.getElementById("report_pack_error_message") as HTMLParagraphElement
        const get_report_button = document.getElementById("report_submit_button") as HTMLButtonElement
        const report_input_regex = new RegExp(/^[a-zA-Z0-9\.\,\-\_?! ]{25,250}$/)

        if(report_input.value.length < 25) {

            get_report_button.classList.add("disabled_button")
            report_pack_error_message.innerText = "Atleast 25 characters"
            report_input.classList.add("input_error")
            return false
        }

        if(report_input_regex.test(report_input.value) === true) {
            get_report_button.classList.remove("disabled_button")
            report_pack_error_message.innerText = ""
            report_input.classList.remove("input_error")
            return true
        }
        else {
            get_report_button.classList.add("disabled_button")
            report_pack_error_message.innerText = "Allowed characters: a-z A-Z 0-9 . , - _ ? !"
            report_input.classList.add("input_error")
            return false
        }
    }
    function go_back() {
        const prev_path = sessionStorage.getItem("prev_path")
        if(!prev_path) return router.push("/browse", "/browse", {scroll: false})
        
        router.push(prev_path, prev_path, {scroll: false})
        
    }
    

    async function submit_pack_report() {
        const valid_report_reason = report_pack_validation()
        const report_input = document.getElementById("report_input") as HTMLInputElement
        if(!valid_report_reason) return
        const pack_id = router.query.pack_id

        if(!pack_id) return

        if(typeof pack_id !== "string") return
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/report_pack/${pack_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({reason: report_input.value})
            })

            const response_obj = await response.json() as Server_response

            if(response_obj.success === true) {
                App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Thank you for helping us!", message: response_obj.message, button_label: "Ok", callb: () => {set_report_confirmation_state(false)}}})
            } else {
                App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Something went wrong!", message: response_obj.message, button_label: "Ok"}})
            }

        } catch(err) {
            //Couldnt reach server
        }
    }
    async function delete_pack() {
        const pack_id = router.query.pack_id

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/delete_pack/${pack_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            })
    
            const response_obj = await response.json() as Server_response

            if(!response_obj.success) return App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Something went wrong!", message: response_obj.message, button_label: "Ok"}})
            return App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully deleted pack!", message: `You now will be redirected.`, button_label: "Ok", callb: go_back}})

        } catch(err) {
            //Coudlnt reach server
        }
        

    }
    async function download_pack() {
        if(typeof pack_id !== "string") return
        const a = document.getElementById("download_pack_link") as HTMLAnchorElement
        a.click()
    }
    
    return (
        <PACK_PAGE_CONTEXT.Provider value={{pack: pack, toggle_asset}}>

            <div className="pack_page" id="pack_page">

                <AnimatePresence exitBeforeEnter>
                    <Fixed_app_content_overlay>

                        <div className='pack_fix_overlay'>

                            <div className='pack_nav_container'>
                                <div className='close_pack_container' id="close_pack">

                                    <div onClick={() => {go_back()}} className="icon_container">
                                        <CloseIcon className="close_icon"/>
                                        <div className="hover_box">Close Pack</div>
                                    </div>

                                </div>
                                
                                <AnimatePresence exitBeforeEnter>

                                    {delete_confirmation_state &&
                                        <motion.div key="delete_pack" initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, transition: {duration: .2, type: "tween"}}} className='delete_pack_confirmation_container'>
                                            <motion.div initial={{opacity: 0, scale: .8}} animate={{opacity: 1, scale: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, scale: .8, transition: {duration: .2, type: "tween"}}}  className='confirmation_content'>
                                                <h1>Delete Pack?</h1>
                                                <p>Do you want to delete this pack? Remember, after deleting it wont be recoverable and all stats will be lost.</p>
                                                <button onClick={delete_pack}>Yes, delete pack!</button>
                                                <h4 onClick={() => {set_delete_confirmation_state(false)}}>No, dont delete pack</h4>
                                            </motion.div>

                                            <div onClick={() => {set_delete_confirmation_state(false)}} className='delete_pack_confirmation_background' />
                                        </motion.div>
                                    }

                                    {report_confirmation_state &&
                                        <motion.div key="report_pack"initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, transition: {duration: .2, type: "tween"}}} className='report_pack_confirmation_container'>
                                            
                                            <motion.div initial={{opacity: 0, scale: .8}} animate={{opacity: 1, scale: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, scale: .8, transition: {duration: .2, type: "tween"}}}  className='confirmation_content'>
                                                <h1>Report Pack</h1>
                                                <input onKeyUp={report_pack_validation} type="text" placeholder='Reason' id="report_input"/>
                                                <p className='report_pack_error_message' id="report_pack_error_message"></p>
                                                <button className='disabled_button' id="report_submit_button" onClick={submit_pack_report}>Report pack</button>
                                                <h4 onClick={() => {set_report_confirmation_state(false)}}>I changed my mind.</h4>
                                            </motion.div>

                                            <div onClick={() => {set_report_confirmation_state(false)}} className='report_pack_confirmation_background' />

                                        </motion.div>
                                    }

                                </AnimatePresence>

                                <div className='pack_actions_fixed_container'>

                                    <div className='pack_actions_container'>

                                        <Pack_action Action_icon={ReportIcon} name='Report Pack' callb={() => {set_report_confirmation_state(!delete_confirmation_state)}}/>
                                        {user && (user.username === pack.username || user.role === "admin") &&
                                            <Pack_action Action_icon={ThrashIcon} name='Delete Pack' callb={() => {set_delete_confirmation_state(!delete_confirmation_state)}}/>
                                        }

                                    </div>

                                </div>
                                    
                            </div>
                            
                            <AnimatePresence exitBeforeEnter>
                                {typeof focus_img_src === "string" &&
                                    
                                    <motion.div onClick={() => {set_focus_img_src(null)}} initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: 0.1}}} exit={{opacity: 0, transition: {duration: 0.1}}} className="focus_image_container">
                                        
                                        <div onClick={() => {set_focus_img_src("/")}} className="asset_fixed_image_container">
                                            <Image loading='lazy' unoptimized={true} src={focus_img_src} alt="Represents a pack assets but bigger in size." layout="fill" id="asset_fixed_image"></Image>

                                            <div className="close_asset" id="close_pack">

                                                <div className="close">
                                                    <CloseIcon className="close_icon"/>
                                                </div>

                                            </div>
                                        </div>

                                    </motion.div>
                                    
                                }
                            </AnimatePresence>

                            <AnimatePresence exitBeforeEnter>
                                {toggle_download_container &&

                                    <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: 0.2}}} exit={{opacity: 0, transition: {duration: 0.2}}} className='pack_download_container'>
                                        <Download_popup username={pack.username} pack={pack} set_toggle_download_container={set_toggle_download_container}/>
                                    </motion.div>

                                }
                            </AnimatePresence>
                            
                        </div>

                        
                    </Fixed_app_content_overlay>
                </AnimatePresence>

                <div className="content" id="content">
        
                    <div className="preview_container" id="preview_container">
                        <div className="background">
						    <Image loading='lazy' unoptimized={true} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/packs/${pack.username.toLowerCase()}_${pack._id}/${pack.preview}`} alt="Preview Image" layout="fill" className="preview_image" id="title_pack_background_image"/>
                            <div className="background_blur" />
                        </div>

                        <div className="pack_info">
                            <div className="header_container">

                                <H1_with_deco title={pack.title}/>

                                <p>{pack.description}</p>
                                <button onClick={download_pack}>Download Pack</button>
                                <div onClick={() => {set_toggle_download_container(true)}} id="download_pack_link" style={{display: "none", opacity: 0, pointerEvents: "none"}}>download</div>
                            </div>

                            {!own_pack &&
                                <Memo_rate_pack user={user} set_prev_pack_ratings={set_prev_pack_ratings} prev_pack_ratings={prev_pack_ratings} App_notification={App_notification}/>
                            }
                            

                            <Pack_stats pack={pack} own_pack={own_pack} prev_pack_ratings={prev_pack_ratings}/>

                            <div className="arrow_container">
                                <ArrowIcon height="45px" width="45px" className="arrow_down" id="arrow_down"/>
                            </div>
                        </div>

                    </div>
                    
                    <Pack_assets_section pack={pack}/>

                    <Nav_shadow/>
                </div>
                
                <Footer/>

            </div>

        </PACK_PAGE_CONTEXT.Provider>
    );
}

function Rate_pack(props: {user: Public_user | null, set_prev_pack_ratings: any, prev_pack_ratings: any, App_notification: App_notification_context_type}) {
    const set_prev_pack_ratings = props.set_prev_pack_ratings
    const prev_pack_ratings = props.prev_pack_ratings
    const App_notification = props.App_notification
    const user = props.user
    const router = useRouter()
    //Filled stars
    let stars_jsx: ReactElement[] = []
    for(let i = 0; i < 5; i++) {
        stars_jsx.push(
            <div onMouseEnter={mouse_enter} onClick={submit_rating} onMouseLeave={mouse_leave} key={`full_rate_star_${i}`} className='full_rate_star' id={`${i}`}>
                <StarIcon/>
            </div>
        )
    }
    
    //Empty stars
    let empty_stars_jsx: ReactElement[] = []
    for(let i = 0; i < 5; i++) {
        empty_stars_jsx.push(
            <div key={`empty_rate_star_${i}`} className='empty_rate_star'>
                <StarEmptyIcon/>
            </div>
        )
    }
    
    const user_has_rated = useCallback(() => {
        function user_has_rated(): null | Pack_rating {
            let user_rated_obj: null | Pack_rating = null
            
            if(user) {
                for(let rating of prev_pack_ratings) {
                    if(rating.user_id === user._id) {
                        
                        user_rated_obj = {
                            user_id: rating.user_id,
                            rating: rating.rating
                        }
                    }
                }
            }
            
            
            if(!user_rated_obj) return null
            return user_rated_obj
        }
        return user_has_rated()
    }, [prev_pack_ratings, user])

    function mouse_enter(e: any) {
        if(user_has_rated()) return
        const id = parseInt(e.target.id)
        const stars = document.getElementsByClassName(`full_rate_star`) as HTMLCollection
        
        const stars_arr = Array.from(stars)

        for(let i = 0; i <= id; i++) {
            stars_arr[i].classList.add("visible_star")
        }
        
    }

    function mouse_leave(e: any) {
        if(user_has_rated()) return
        const id = parseInt(e.target.id)
        const stars = document.getElementsByClassName(`full_rate_star`) as HTMLCollection
        
        const stars_arr = Array.from(stars)

        for(let i = 0; i <= id; i++) {
            stars_arr[i].classList.remove("visible_star")
        }
        
    }

    async function submit_rating(e: any) {
        
        if(user?.username.length === 0) {
            App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Please Login!", message: "You have to log into your account to be able to rate packs!", button_label: "ok"}})
            return
        }
        const rating = parseInt(e.target.id)
        
        const pack_id = router.query.pack_id

        if(!pack_id) return
        if(typeof pack_id !== "string") return

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/rate_pack?pack_id=${pack_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({rating: rating + 1})
            })

            
            const response_obj = await response.json() as Server_response_pack_rating
            
            if(!response_obj.success) return App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Something went wrong!", message: response_obj.message, button_label: "Okay"}})
            
            let updated_pack_ratings = [...prev_pack_ratings, {user_id: response_obj.user_id, rating: response_obj.rating}]
            set_prev_pack_ratings(updated_pack_ratings)
            
        } catch(err) {
            //Couldnt reach server
        }
    }

    useEffect(() => {
        const user_rating = user_has_rated()
        if(!user_rating) return
        const stars = document.getElementsByClassName(`full_rate_star`) as HTMLCollection
        const stars_arr = Array.from(stars)

        for(let i = 0; i < stars_arr.length; i++) {
            
            stars_arr[i].classList.add("already_rated")
            
            if(i <= user_rating.rating - 1) {

                if(stars_arr[i]) {
                    stars_arr[i].classList.add("visible_star")
                }
                
            }
        }
        
    }, [user_has_rated, prev_pack_ratings])

    return (
        <div className='rate_pack_container'>
            <h1>{user_has_rated() ? "You Rated" : "Rate This Pack"}</h1>
            <div className='rate_pack_stars_container'>

                <div className='empty_stars_container'>
                    
                    {empty_stars_jsx}
                    
                </div>

                <div className='full_stars_container'>
                    {stars_jsx}
                </div>
            </div>
            
        </div>
    );  
}

export const Memo_user_pack = React.memo(User_pack)
export const Memo_rate_pack = React.memo(Rate_pack)


function Download_popup(props: {username: string, pack: Pack, set_toggle_download_container: React.Dispatch<React.SetStateAction<boolean>>}) {
    const username = props.username
    const download_link = `${process.env.NEXT_PUBLIC_SPRITEARC_API}/download_pack?pack_id=${props.pack._id}&author=${props.pack.username}`
    const [timer, set_timer] = useState<null | number>(null)
    const [public_user, set_public_user] = useState<null | Public_user>(null)
    const [tip_available, set_tip_available] = useState<null | boolean>(null)
    const [toggle_download_window, set_toggle_download_window] = useState(false)
    const timer_id: any = useRef(0)
    const pack_title = props.pack.title
    const set_toggle_download_container = props.set_toggle_download_container
    const open_download_window = useCallback(() => {
        function open_download_window() {
            set_tip_available(false)
            set_toggle_download_window(true)
        }
        open_download_window()
    }, [set_tip_available, set_toggle_download_window])
    
   
    useEffect(() => {
        const controller = new AbortController()

        async function get_public_user() {

            try {
               
                const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/get_public_user/${username}`, {
                    method: "POST",
                    headers: {
						"Content-Type": "application/json"
					},
                    signal: controller.signal,
                })

                const response_obj = await response.json() as Server_response_public_user
                const public_user = response_obj?.public_user
                if(!public_user) return

                set_public_user(public_user)
                if(!public_user.paypal_donation_link) return open_download_window()
                const valid_donation_link = validate_paypal_donation_link(`${public_user?.paypal_donation_link}`)
                if(typeof valid_donation_link === "string") return open_download_window()
                if(!valid_donation_link) return open_download_window()
                
                set_tip_available(true)
                    
            } catch(err) {
                //Could not reach server
            }
            
        }
        get_public_user()

        return(() => {
            controller.abort()
        })
    }, [username, open_download_window])

    useEffect(() => {
        const download_button = document.getElementById("download_button") as HTMLButtonElement
        if(!download_button) return
        
        if(timer === 0) {
            download_button.setAttribute("href", download_link)
            download_button.setAttribute("download", pack_title.split(" ").join("_"))
            download_button.click()
            download_button.removeAttribute("href")
            download_button.removeAttribute("download")
            set_timer(null)
            
            set_toggle_download_container(false)
        } else {
            if(!timer) return
            timer_id.current = setTimeout(() => {
                set_timer(timer - 1)
            }, 1000);
        }

        return(() => {
            clearTimeout(timer_id)
        })
    }, [timer, set_timer, timer_id, set_toggle_download_container, download_link, pack_title])

    return (
        <>
            <motion.div initial={{scale: .8}} animate={{scale: 1, transition: {duration: 0.2}}} exit={{scale: .8, transition: {duration: 0.2}}} className='prev_download_container'>

                {public_user === null &&
                    <Loading loading={true} main_color={true}></Loading>
                }
                {public_user &&
                    <div className='user_representation_container'>

                        <>
                            {tip_available &&
                                <>
                                    <div className='user_banner_container'>
                                        <Image loading='lazy' unoptimized={true} id="profile_banner" src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_banners/${public_user.profile_banner}`} alt={`Profile banner for the user ${public_user.username}`} layout='fill'></Image>
                                        <div className='blur' />
                                    </div>

                                    <div className='user_portrait_container'>

                                        <div className='portrait_circle'>

                                            <div className='portrait'>
                                                
                                                <Image loading='lazy' unoptimized={true} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${public_user.profile_picture}`} alt={`Profile banner for the user ${public_user.username}`} layout='fill'></Image>

                                            </div>

                                        </div>

                                    </div>

                                    <div className='user_info_container'>
                                        <Link href={`/user/${public_user.username.toLowerCase()}`} scroll={false}>{`${public_user?.username}`}</Link>
                                    </div>

                                
                                    <div className='tip_container'>
                                        <h1>Support The Artist</h1>
                                        <p>This asset pack is free but you can tip the artist {`'${public_user.username}'`} to show your appreciation. Please keep in mind that donations / tips can not be refunded.</p>
                                        <a onClick={open_download_window} href={`${public_user?.paypal_donation_link}`} rel="noreferrer" target={'_blank'} className='tip_artist_button'>Tip</a>
                                        <h4 onClick={open_download_window}>Proceed to download</h4>
                                    </div>
                                </>
                            }
                            
                            {toggle_download_window &&
                                <div className='download_container'>
                                    <h1>Download Pack!</h1>
                                    <p>Please make sure to read the license so you exactly know how to properly use all the assets and sprites from this pack! You can start the download by clicking the download button below!</p>
                                    <a onClick={() => {if(timer === null) set_timer(5)}} className='download_button' id="download_button">{timer ? timer : "Download"}</a>

                                </div>
                            }
                        </>
                    </div>
                }
                
            </motion.div>
            <div onClick={() => {props.set_toggle_download_container(false)}} className='download_container_background'></div>
        </>
    );
}

function Pack_stats(props: {pack: Pack, own_pack: boolean, prev_pack_ratings: Pack_rating[]}) {
    const pack = props.pack
    const own_pack = props.own_pack
    const prev_pack_ratings = props.prev_pack_ratings
    const router = useRouter()

    function pack_tags_jsx() {
        const tags = pack?.tags

        try {
            const tags_jsx = tags.map((tag) => {
                return <h4 key={`tag_${tag}`} className='tag_link' onClick={() => {router.push(`/search?query=${tag.toLowerCase()}`,`/search?query=${tag.toLowerCase()}`, {scroll: false})}}>{tag.toUpperCase()}</h4>
            })

            return tags_jsx
        } catch(err) {
            return []
        }
        
    }

    return (
        <div style={own_pack ? {marginTop: "16rem"} : {}} className="stats_container"> 
            <span className="top_line" />

            <div className="grid_container">
                
                <div className="grid_item">

                    <div className="item_1">
                        <p>Creator:</p>
                    </div>

                    <Link href={`/user/${pack?.username.toLowerCase()}`} scroll={false}>{pack?.username}</Link>
                </div>

                <div className="grid_item">

                    <div className="item_1">
                        <p>Released:</p>
                    </div>

                    <div className="item_2">{format_date(new Date(pack?.date))}</div>
                </div>

                <div className="grid_item">

                    <div className="item_1">
                        <p>Rating:</p>
                    </div>


                    <div className="item_2">
                        <Pack_star_raiting ratings={prev_pack_ratings}/>
                    </div>
                </div>

                <div className="grid_item">

                    <div className="item_1">
                        <p>Downloads:</p>
                    </div>

                    <div className="item_2">{`${pack?.downloads}`}</div>
                </div>

                <div className="grid_item">

                    <div className="item_1">
                        <p>License:</p>
                    </div>

                    <div className="item_2">
                        <p className='pack_license'>
                            {pack?.license.toUpperCase()}
                            <Link href='/license' scroll={false}>
                                <a>
                                    <HelpIcon/>
                                </a>
                            </Link>
                        </p>
                        
                    </div>
                </div>

                
                <div className="grid_item">

                    <div className="item_1">
                        <p>Tags:</p>
                    </div>

                    <div className="item_2">
                        <div className='tags_container'>
                            {pack_tags_jsx()}
                        </div>
                    </div>
                </div>

            </div>

            <span className="bottom_line" />
        </div>
    )
}

//Component that creates a section with assets
function Pack_assets_section(props: {pack: Pack}): ReactElement {
    const pack: Pack = props.pack

    const section_jsx = []
    //Looping through content to create a section for each content
    for(let i = 0; i < pack.content.length; i++) {
        
        section_jsx.push(
            <div key={`section_${i}`} className="section_container">
                <h1>{"– "} {capitalize_first_letter_rest_lowercase(pack.content[i].section_name)}</h1>
                <Pack_asset pack_content={pack.content[i]} pack_id={`${pack._id}`} username={pack.username}/>
            </div>
        )
    }
    
    return (
        <div className="asset_sections_container">

            <div className="section_container">
                {section_jsx}
            </div>
            
        </div>
    );
}

//Component that creates assets from pack.
function Pack_asset(props: {pack_content: Pack_content, pack_id: string, username: string}): ReactElement {
    const PACK_PAGE: any = useContext(PACK_PAGE_CONTEXT)
    const pack_id = props.pack_id
    const pack_content = props.pack_content

    const show_asset = PACK_PAGE.toggle_asset as (src: string) => void
    
    
    //Array of assets as jsx
    const assets_jsx = []
    for(let i = 0; i < pack_content.section_images.length; i++) {
        assets_jsx.push(
            <div onClick={() => {show_asset(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/packs/${props.username.toLowerCase()}_${pack_id.toString()}/${pack_content.section_images[i]}`)}} key={`${pack_content.section_images[i]}_${i}`} className="asset">
                <Image loading='lazy' unoptimized={true} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/packs/${props.username.toLowerCase()}_${pack_id.toString()}/${pack_content.section_images[i]}`}  quality="100%" layout="fill"  alt={`Representing one asset from this pack`}  className="patch_preview_image"/>
            </div>
        )
    }
    
    return (
        <div onContextMenu={(e) => {e.preventDefault()}} className="assets_grid_container">
            {assets_jsx}
        </div>
    );
}
//Compontent that represents an icon for the pack navigation
function Pack_action({Action_icon, name, callb}: {Action_icon:any, name: string, callb: ()=>void}) {
  return (
    <div className='pack_action' onClick={callb}>
        <Action_icon/>
        <p>{name}</p>
    </div>
  );
}


export const getServerSideProps: GetServerSideProps = async (context) => {

    try {
        const agent = process.env.NEXT_PUBLIC_ENV === "development" ? new http.Agent() : new https.Agent({
            rejectUnauthorized: false
        })
        
        const pack_id = context?.params?.pack_id
        if(!pack_id) throw new Error("Could not find id")
        const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/get_pack/${pack_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // @ts-ignore: Unreachable code error
            agent
        })
    
        
        const response_obj = await response.json() as Server_response_pack
        
        if(!response_obj.success) return {redirect: {destination: "/browse", permanent: false}} 
    
        return {
            props: {
                server_pack_response: response_obj
            }
        }

    } catch (err) {
        return {redirect: {destination: "/browse", permanent: false}} 
    }
}

