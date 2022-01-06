import { GetServerSideProps } from 'next';
import React, {ReactElement, useEffect, useContext, useState} from 'react';
import Footer from '../components/footer';
import {Pack_content, Pack, Pack_rating} from "../types"
import Link from 'next/dist/client/link';
import Image from 'next/dist/client/image';
import { Nav_shadow } from '../components/navigation';
import { useParallax } from '../lib/custom_hooks';
import { APP_CONTEXT } from "../components/layout";
import { App_context } from '../types';
import {format} from "date-fns"
import ArrowIcon from "../public/icons/ArrowIcon.svg"
import CloseIcon from "../public/icons/CloseIcon.svg"
import StarEmpty from "../public/icons/StarEmptyIcon.svg"
import StarHalf from "../public/icons/StarHalfIcon.svg"
import Star from "../public/icons/StarIcon.svg"
import { useRouter } from 'next/router';
import { AnimatePresence , motion} from 'framer-motion';
import H1_with_deco from '../components/h1_with_deco';
import { Device_context } from '../context/device_context_provider';
import { format_date } from '../lib/date_lib';
import { get_pack_by_id } from '../lib/mongo_lib';
import { ObjectId } from 'mongodb';
import { capitalize_first_letter_rest_lowercase } from '../lib/custom_lib';
const PACK_PAGE_CONTEXT: any = React.createContext(null)


//Renders the full Pack
export default function Pack_page(props: {pack: Pack}) {
    //State that saves currently clicked asset as a url string.
    const [focus_img_src, set_focus_img_src] = useState("/")
    //State that toggles focus of asset.
    const [show_focus_img, set_show_focus_img] = useState(false)
    
    //Contexts
    const Device = useContext(Device_context)
    const Router = useRouter()

    //Props
    const pack: Pack = JSON.parse(`${props.pack}`)
    
    function go_back() {
        const prev_path = sessionStorage.getItem("prev_path")
        if(!prev_path) return Router.push("/browse", "/browse", {scroll: false})
        
        Router.push(prev_path, prev_path, {scroll: false})
        
    }
    
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

    //Creating parallax effect for Image
    useParallax("title_pack_background_image")
    
    //Function that sets img src + toggles show_focus_img to true.
    function toggle_asset(e: any) {
        if(e.target.src) {
            set_focus_img_src(e.target.src)
        } else {
            set_focus_img_src("/")
        }
        set_show_focus_img(true)
    }

    //Setting max_height and max_width of fixed asset_fixed_image_container in page Component.
    useEffect(() => {
        const get_page = document.getElementById("pack_page") as HTMLDivElement
        const get_fixed_asset = document.getElementById("asset_fixed_container") as HTMLDivElement

        function set_sizes() {
            if(show_focus_img) {
                
                get_fixed_asset.style.maxWidth = `${get_page.offsetWidth}px`
                get_fixed_asset.style.maxHeight = `${get_page.offsetHeight}px`
            }
        }

        set_sizes()
        window.addEventListener("resize", set_sizes)
        return(() => {
            window.removeEventListener("resize", set_sizes)
        })
    }, [show_focus_img])
    
    return (
        <PACK_PAGE_CONTEXT.Provider value={{pack: pack, toggle_asset}}>

            <div className="pack_page" id="pack_page">

                <AnimatePresence exitBeforeEnter>
                    {show_focus_img &&

                        <motion.div onClick={() => {set_focus_img_src("/"), set_show_focus_img(false)}} initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: 0.1}}} exit={{opacity: 0, transition: {duration: 0.1}}} className="asset_fixed_container" id="asset_fixed_container">
                            
                            <div className="asset_fixed_image_container">
                                <Image src={focus_img_src} alt="Represents a bigger size of an clicked image" layout="fill" id="asset_fixed_image"></Image>

                                <div className="close_asset" id="close_pack">

                                    <div className="close">
                                        <CloseIcon className="close_icon"/>
                                    </div>

                                </div>
                            </div>

                        </motion.div>

                    }
                </AnimatePresence>

                { Device.is_mobile === false &&
                    <div className="close_pack" id="close_pack">

                        <div onClick={() => {go_back()}} className="close">
                            <CloseIcon className="close_icon"/>
                            <div className="hover_box">Close Pack</div>
                        </div>

                    </div>
                }

                <div className="content" id="content">
                        
                    <div className="preview_container" id="preview_container">
                        <div className="background">
						    <Image src={`/packs/${pack._id}/${pack.preview}`} alt="Preview Image" layout="fill" priority={true} className="preview_image" id="title_pack_background_image"/>
                            <div className="background_blur" />
                        </div>

                        <div className="pack_info">
                            <div className="header_container">

                                <H1_with_deco title={pack.title}/>

                                <p>{pack.description}</p>
                                <button>Download Pack</button>
                            </div>

                            <div className="stats_container"> 
                                <span className="top_line" />

                                <div className="grid_container">
                                    
                                    <div className="grid_item">

                                        <div className="item_1">
                                            <p>Rating:</p>
                                        </div>


                                        <div className="item_2">
                                            <Rating_container ratings={pack.ratings}/>
                                        </div>
                                    </div>

                                    <div className="grid_item">

                                        <div className="item_1">
                                            <p>Released:</p>
                                        </div>

                                        <div className="item_2">{format_date(new Date(pack.date))}</div>
                                    </div>

                                    <div className="grid_item">

                                        <div className="item_1">
                                            <p>Downloads:</p>
                                        </div>

                                        <div className="item_2">{pack.downloads}</div>
                                    </div>

                                    <div className="grid_item">

                                        <div className="item_1">
                                            <p>Tags:</p>
                                        </div>

                                        <div className="item_2">{pack.tags.join(", ").toUpperCase()}</div>
                                    </div>

                                    <div className="grid_item">

                                        <div className="item_1">
                                            <p>License:</p>
                                        </div>

                                        <div className="item_2">{pack.license.toUpperCase()}</div>
                                    </div>

                                    <div className="grid_item">

                                        <div className="item_1">
                                            <p>Creator:</p>
                                        </div>

                                        <Link href={`/profile?user=${pack.username}`} scroll={false}>{pack.username}</Link>
                                    </div>


                                </div>

                                <span className="bottom_line" />
                            </div>

                            <div className="arrow_container">
                                <ArrowIcon height="45px" width="45px" className="arrow_down" id="arrow_down"/>
                            </div>
                        </div>

                    </div>
                    
                    
                    <Pack_sprite_sections pack={pack}/>

                    <Nav_shadow/>
                </div>
                
                <Footer/>

            </div>

        </PACK_PAGE_CONTEXT.Provider>
    );
}

//Component that creates a section with assets
function Pack_sprite_sections(props: {pack: Pack}): ReactElement {
    const pack: Pack = props.pack

    const section_jsx = []
    //Looping through content to create a section for each content
    for(let i = 0; i < pack.content.length; i++) {
        
        section_jsx.push(
            <div key={`section_${i}`} className="section_container">
                <h1>{"– "} {capitalize_first_letter_rest_lowercase(pack.content[i].section_name)}</h1>
                <Pack_asset pack_content={pack.content[i]} pack_id={pack._id}/>
            </div>
        )
    }
    
    return (
        <div className="asset_sections_container">

            <div key="" className="section_container">
                {section_jsx}
            </div>
            
        </div>
    );
}

//Component that creates assets from pack.
function Pack_asset(props: {pack_content: Pack_content, pack_id: ObjectId}): ReactElement {
    const PACK_PAGE: any = useContext(PACK_PAGE_CONTEXT)
    const pack_id = props.pack_id
    const pack_content = props.pack_content

    const show_asset = PACK_PAGE.toggle_asset as () => void
    
    
    //Array of assets as jsx
    const assets_jsx = []
    for(let i = 0; i < pack_content.section_images.length; i++) {
        assets_jsx.push(
            <div onClick={show_asset} key={`${pack_content.section_images[i]}_${i}`} className="asset">
                <Image src={`/packs/${pack_id.toString()}/${pack_content.section_name}/${pack_content.section_images[i]}`}  quality="100%" layout="fill"  alt={`Representing one asset from this pack`}  className="patch_preview_image"/>
            </div>
        )
    }
    
    return (
        <div className="assets_grid_container">
            {assets_jsx}
        </div>
    );
}

//Component that renders Stars based on pack Rating.
function Rating_container(props: {ratings: Pack_rating[]}) {
    const ratings: {user: string, rating: number}[] = props.ratings
    let sum_ratings: number = 0

    for(let item of ratings) {
        sum_ratings = sum_ratings + item.rating
    }

    const avg_rating = sum_ratings / ratings.length
    //Return a ReactElement array with stars. 
    function create_stars(number: number) {
        const max_stars = 5
        const stars_jsx: any = []
        const decimal = number % 1

        for(let i = 0; i < Math.floor(number); i++) {
            stars_jsx.push(<Star key={i}/>)
        }
        

        if(decimal >= .5) {
            stars_jsx.push(<StarHalf key={decimal}/>)
        }

        if(stars_jsx.length < max_stars) {
            const left_over = max_stars - stars_jsx.length
            for(let i = 0; i < left_over; i++) {
                stars_jsx.push(<StarEmpty key={`empty_star_${i}`}/>)
            }
        }

        return stars_jsx
    }
    const stars = create_stars(avg_rating)
    return (
        <div className="stars_container">
            {stars}
        </div>
    );
}



export const getServerSideProps: GetServerSideProps = async(context) => {

    if(typeof context.query.id === "string") {
        const pack = await get_pack_by_id(new ObjectId(context.query.id))

        if(!pack) return {

            redirect: {
                destination: `/browse`,
                permanent: false,
            }

        }

        return{
            props: {
                pack: JSON.stringify(pack)
            }
        }
        
    } else {

        return {

            redirect: {
                destination: `/browse`,
                permanent: false,
            }

        }

    }

} 
