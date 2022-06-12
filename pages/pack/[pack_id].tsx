import React, {ReactElement, useEffect, useContext, useState, useCallback, useRef} from 'react';
import Footer from '../../components/footer';
import {Public_user, Pack_rating, Auth_context_type, Server_response_pack, Server_response_pack_rating, Server_response_public_user, Server_response_credits, App_dispatch_notification} from "../../types"
import Image from 'next/dist/client/image';
import { Nav_shadow } from '../../components/navigation';
import { useParallax } from '../../lib/custom_hooks';
import ArrowIcon from "../../public/icons/ArrowIcon.svg"
import CloseIcon from "../../public/icons/CloseIcon.svg"
import { useRouter } from 'next/router';
import H1_with_deco from '../../components/h1_with_deco';
import { format_date } from '../../lib/date_lib';
import { capitalize_first_letter_rest_lowercase } from '../../lib/custom_lib';
import StarEmptyIcon from "../../public/icons/StarEmptyIcon.svg"
import StarIcon from "../../public/icons/StarIcon.svg"
import ThrashIcon from "../../public/icons/ThrashIcon.svg"
import { Auth_context } from '../../context/auth_context_provider';
import { GetServerSideProps } from 'next'
import https from "https"
import http from "http"
import Overlay from '../../components/layout/overlay';
import Action_button from '../../components/actionButton';
import Sticky from '../../components/layout/sticky';
import Grid from '../../components/layout/grid';
import Conditional from '../../components/conditional';
import { PopupProviderContext } from '../../context/popupProvider';
import apiCaller from '../../lib/apiCaller';
import Header from '../../components/MetaGenerator';
import PageContent from '../../components/layout/pageContent';
import Section from '../../components/section';
import PackAssetsSection from '../../components/packAssetsSection';
import { Pack } from '../../types';
import Rating from '../../components/rating';
import Flex from '../../components/layout/flex';
import Stats, {IStats} from '../../components/stats';
import Button from '../../components/button';
import PackStats from '../../components/packStats';
import useButtonEnter from '../../hooks/useButtonEnter';

export default function PageRenderer(props: {pack: Pack}) {
    const Auth = useContext(Auth_context) as Auth_context_type
    const pack = props.pack
    const title = `${pack?.username} - ${pack?.title}`
    const description = `${pack?.description}`
    const url = `https://Spritearc.com/pack?id=${pack?._id}`
    const imageLinkSecure = `${process.env.NEXT_PUBLIC_SPRITEARC_API}/packs/${pack?._id}/${pack?.preview}`

    return(
        <>
            <Header title={`${title}`} description={description} url={url} imageLinkSecure={imageLinkSecure}  />

            <PackPage pack={pack} Auth={Auth}/>

            <Footer/>
        </>
    )
}

function PackPage(props: {pack: Pack, Auth: Auth_context_type}) {
    //Props
    const user = props.Auth.user.public_user
    const pack: Pack = props.pack
    
    
    //states 
    const popupProvider = useContext(PopupProviderContext)
    const router = useRouter()

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
    
    function goBack() {
        const prev_path = sessionStorage.getItem("prev_path")
        if(!prev_path) return router.push("/browse", "/browse", {scroll: false})
        
        router.push(prev_path, prev_path, {scroll: false})
        
    }
    async function deletePack(signal: AbortSignal) {
        const pack_id = router.query.pack_id as string;
        try {
        
            const serverResponse = await apiCaller.deletePack(pack_id, signal);
            
            if(!serverResponse) {
                popupProvider?.setPopup({
                    success: false, 
                    title: "Could'nt delete pack!", 
                    message: "Something went wrong while trying to delete your pack. Please contact and admin or try again later.", 
                    buttonLabel: "Okay", 
                    cancelLabel: "Close Window",
                })
                return
            }
            

            if(serverResponse.success) {
                popupProvider?.setPopup({
                    success: true, 
                    title: "Successfully deleted pack!", 
                    message: "We will now redirect you to our browse page", 
                    buttonLabel: "Okay", 
                    cancelLabel: "Close Window",
                    cancelOnClick: () => {router.push("/browse", "/browse", {scroll: false})},  
                    buttonOnClick: async() => {router.push("/browse", "/browse", {scroll: false}); popupProvider.setPopup(null)}, 
                })
            } else {
                popupProvider?.setPopup({
                    success: false, 
                    title: "Could'nt delete Pack!", 
                    message: serverResponse.message, 
                    buttonLabel: "Okay", 
                })
            }
            
        } catch (error) {
            //Err handling
        }
    }
    async function buyPackPromotion(signal: AbortSignal) {
        return new Promise(async(resolve) => {
            const pack_id = router.query.pack_id as string
                
            try {
                const serverResponse = await apiCaller.buyPackPromotion(pack_id, signal)
                
                if(!serverResponse?.success) {
                    popupProvider?.setPopup({
                        success: false,
                        title: "Already Promoted",
                        message: "You could not promote this pack because it probably already is promoted", 
                        buttonLabel: "Okay", 
                        cancelLabel: "Close window", 
                    })
                    resolve(false)
                    return
                }
                
                popupProvider?.setPopup({
                    success: true,
                    title: "Success!", 
                    message: "You successfully bought a pack promotion! Your pack will now be randomly displayed at our browse page. Keep your community growing!", 
                    buttonLabel: "Okay", 
                    cancelLabel: "Close window", 
                })
                resolve(true)
            } catch(err) {
                //Error or aborted
            }
        })

    }

    function checkPromoAction(): boolean {
        if(user && (user.username === pack.username || user.role === "admin")) return true
        else return false
    }
    function checkDeleteAction(): boolean {
        if(user && (user.username === pack.username || user.role === "admin")) return true
        else return false
    }
    function displayPromoPopup() {
        const text = "Your pack will be added to the promotion list for 2 days. Promoted packs will be shown randomly at the top of our browse page. This is recommended to grow your community and increase your discoverability!"
        popupProvider?.setPopup({
            success: true,
            title: "Promotion",
            message: text, 
            buttonLabel: "Pay 250 Sprite-Credits", 
            cancelLabel: "No, thank you", 
            buttonOnClick: (signal) => buyPackPromotion(signal),
        })
    }
    function displayPackDeletePopup() {
        const text = "Are you sure that you want to delete this pack? Remember, it wont be recoverable again and all its stats will be lost."
        popupProvider?.setPopup({
            success: false, 
            title: "Delete Pack?", 
            message: text, 
            buttonLabel: "Delete Pack", 
            cancelLabel: "Changed my mind", 
            buttonOnClick: deletePack,
        })
    }
    function createAssetsSections() {
        let assetSectionsJsx = []
        for(let packContent of pack.content) {
            assetSectionsJsx.push(
                <Section key={`section_${packContent.section_name}`} label={capitalize_first_letter_rest_lowercase(packContent.section_name)}>
                    <PackAssetsSection pack={pack} images={packContent.section_images}/>
                </Section>
            )
        }

        return assetSectionsJsx
    }
    

    
    return (
        <>
            <PageContent>
                <Overlay>
                    <Sticky top='3.5rem'>

                        <Grid className='pack_overlay_grid'>

                            <Grid templateColumn='1fr' templateRow='auto' rowGap='2rem' justifyItems='start' alignContent='start'>

                                <Action_button Icon={CloseIcon} label='Close Pack' positive={true} onClickFunc={() => {goBack()}}/>

                                <Conditional checkFunc={checkPromoAction}>
                                    <Action_button Icon={StarIcon} label='Promote Pack' positive={true} onClickFunc={() => {displayPromoPopup()}}/>
                                </Conditional>

                            </Grid>

                            <Grid templateColumn='1fr' templateRow='auto' justifyItems='end' alignContent='start' rowGap='2rem'>

                                <Conditional checkFunc={checkDeleteAction}> 
                                    <Action_button Icon={ThrashIcon} label='Delete Pack' positive={false} onClickFunc={() => {displayPackDeletePopup()}}/>
                                </Conditional>

                            </Grid>

                        </Grid>
                        
                    </Sticky>
                </Overlay>

                <PackPreview pack={pack} authUser={user}/>
                
                {createAssetsSections()}

            </PageContent>
        </>
    );
}

function PackPreview(props: {pack: Pack, authUser: Public_user}) {
    const authUser: Public_user = props.authUser
    const ref = useRef<null | HTMLElement>(null)
    const popupProvider = useContext(PopupProviderContext)
    const pack = props.pack
    const downloadLink = `${process.env.NEXT_PUBLIC_SPRITEARC_API}/download_pack?pack_id=${pack._id}&author=${pack.username}`
    const own_pack = authUser?.username?.length ? authUser.username.toLowerCase() === pack.username.toLowerCase() : false
    const [prev_pack_ratings, set_prev_pack_ratings] = useState<Pack_rating[]>(pack.ratings)

    function displayDownloadPopup() {
        const text = "Please make sure to read the license so you exactly know how to properly use all the assets and sprites from this pack! You can start the download by clicking the download button below!"
        popupProvider?.setPopup({
            success: true,
            timer: 5,
            title: "Download",
            message: text,
            buttonLabel: "Download Pack",
            cancelLabel: "Close window",
            buttonOnClick: downloadPack
        })
    }
    function downloadPack() {
        const download_button = ref.current
        if(!download_button) return
        
        download_button.setAttribute("href", downloadLink)
        download_button.setAttribute("download", downloadLink.split(" ").join("_"))
        download_button.click()
        download_button.removeAttribute("href")
        download_button.removeAttribute("download")
        popupProvider?.setPopup(null)
    }
    return(
        <>
            <a style={{display: "none"}} ref={(el) => {ref.current = el}}></a>
            <div className="preview_container" id="preview_container">
                <div className="background">
                    <Image loading='lazy' unoptimized={true} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/packs/${pack.username.toLowerCase()}_${pack._id}/${pack.preview}`} alt="Preview Image" layout="fill" className="preview_image" id="title_pack_background_image"/>
                    <div className="background_blur" />
                </div>

                <div className="pack_info">
                    <div className="header_container">

                        <H1_with_deco title={pack.title}/>

                        <p>{pack.description}</p>
                        <div className='button_wrapper'>
                            <Button className='primary big' onClick={displayDownloadPopup} btnLabel='Download Pack'/>
                        </div>
                    </div>

                    {!own_pack &&
                        <PackRate authUser={authUser} set_prev_pack_ratings={set_prev_pack_ratings} prev_pack_ratings={prev_pack_ratings}/>
                    }

                    <PackStats pack={pack} ownPack={own_pack}></PackStats>

                    <div className="arrow_container">
                        <ArrowIcon height="45px" width="45px" className="arrow_down" id="arrow_down"/>
                    </div>
                </div>

            </div>
        </>
    )
}

function PackRate(props: {authUser: Public_user | null, set_prev_pack_ratings: any, prev_pack_ratings: any}) {
    const popupProvider = useContext(PopupProviderContext)
    const set_prev_pack_ratings = props.set_prev_pack_ratings
    const prev_pack_ratings = props.prev_pack_ratings
    const user = props.authUser
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
            popupProvider?.setPopup({
                title: "Please Login!",
                success: false,
                message: "You have to have an account to be able to rate packs.",
                buttonLabel: "Okay",
            })
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
            
            if(!response_obj.success) {
                popupProvider?.setPopup({
                    title: "Something went wrong!",
                    success: false,
                    message: response_obj?.message,
                    buttonLabel: "Okay",
                })
            }
            
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


//API CALL TO GET PACK
export const getServerSideProps: GetServerSideProps = async (context) => {
    const redirect = {redirect: {destination: "/browse", permanent: false}} 
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
    
        if(!response_obj.pack) return redirect

        return {
            props: {
                pack: response_obj.pack
            }
        }

    } catch (err) {
        return redirect
    }
}

