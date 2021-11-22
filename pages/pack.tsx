import { GetServerSideProps } from 'next';
import React, {ReactElement, useEffect, useContext} from 'react';
import Footer, { Social_item } from '../components/footer';
import {PackInfo} from "../types"
import Link from 'next/dist/client/link';
import Image from 'next/dist/client/image';
import { Nav_shadow } from '../components/navigation';
import { useParallax } from '../lib/custom_hooks';
import { appContext } from "../components/layout";
import { AppContext } from '../types';
import ArrowIcon from "../public/icons/ArrowIcon.svg"
import CloseIcon from "../public/icons/CloseIcon.svg"
import StarEmpty from "../public/icons/StarEmptyIcon.svg"
import StarHalf from "../public/icons/StarHalfIcon.svg"
import Star from "../public/icons/StarIcon.svg"
import { useRouter } from 'next/router';

//Renders the full Pack
export default function Pack(props: {pack: PackInfo}) {
    const App: AppContext = useContext(appContext)
    const pack = props.pack
    const Router = useRouter()
    useParallax("patch_preview_image")
    //Toggling arrow svg when scrollY > 0
    useEffect(() => {
        //Function that toggles the arrow. Getting called whenever scrolling is happening.
        function toggle_arrow() {
            const arrow_down = document.getElementById("arrow_down") as HTMLDivElement
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

    return (
        <>
            <div className="pack_page" id="pack_page">
                { App.isMobile === false &&
                    <div className="close_pack">
                        <div onClick={() => {Router.push("/browse", "/browse", {scroll: false})}} className="close">
                            <CloseIcon className="close_icon"/>
                            <div className="hover_box">Close Pack</div>
                        </div>
                    </div>
                }
                

                <div className="content" id="content">
                        
                    <div className="preview_container" id="preview_container">
                        <div className="background">
                            <Image quality="100%" priority={true} layout="fill" src={`${pack.preview_image}`} alt="An image that represents one asset of this pack."  className="patch_preview_image" id="patch_preview_image"/>
                            <div className="background_blur" />
                        </div>

                        <div className="pack_info">
                            <div className="header_container">
                                <h2>{pack.sub_title}</h2>

                                <H1_with_deco title={pack.title}/>

                                <p>{pack.description}</p>
                                <button>Download Pack</button>
                            </div>

                            <div className="user_container">
                                <h4>
                                    {`Created by `}
                                    <Link href="/test" scroll={false}>{pack.user.username}</Link>
                                </h4>
                            </div>

                            <div className="stats_container"> 
                                <span className="top_line" />

                                <div className="grid_container">
                                    
                                    <div className="grid_item">

                                        <div className="item_1">
                                            <h4>Rating:</h4>
                                        </div>


                                        <div className="item_2">
                                            <Rating_container ratings={pack.ratings}/>
                                        </div>
                                    </div>

                                    <div className="grid_item">

                                        <div className="item_1">
                                            <h4>Released:</h4>
                                        </div>

                                        <div className="item_2">{pack.date}</div>
                                    </div>

                                    <div className="grid_item">

                                        <div className="item_1">
                                            <h4>Downloads:</h4>
                                        </div>

                                        <div className="item_2">{pack.downloads}</div>
                                    </div>

                                    <div className="grid_item">

                                        <div className="item_1">
                                            <h4>Tags:</h4>
                                        </div>

                                        <div className="item_2">{pack.tags.join(", ").toUpperCase()}</div>
                                    </div>
                                </div>

                                <span className="bottom_line" />
                            </div>

                            <div className="arrow_container">
                                <ArrowIcon height="45px" width="45px" className="arrow_down" id="arrow_down"/>
                            </div>
                        </div>

                        

                        

                    </div>
                    
                    <div className="asset_sections_container">
                        <Pack_content_section pack={pack}/>
                    </div>

                    <Nav_shadow/>
                </div>
                
                <Footer/>
            </div>
        </>
    );
}

//Component that creates a section with assets
export function Pack_content_section(props: {pack: PackInfo}): ReactElement {
    const pack = props.pack
    const section_jsx = []
    //Looping through content to create a section for each content
    for(let i = 0; i < pack.content.length; i++) {
        
        section_jsx.push(
            <div key={`section_${i}`} className="section_container">
                <h1>– {pack.content[i].section_name}</h1>
                <Pack_asset assets={pack.content[i].section_assets} />
            </div>
        )
    }
    
    return (
        <div key="" className="section_container">
            {section_jsx}
        </div>
    );
}
//Component that creates assets from pack.
export function Pack_asset(props: {assets: string[]}): ReactElement {
    const assets = props.assets
    const assets_jsx = []
    
    for(let i = 0; i < assets.length; i++) {
        assets_jsx.push(
            <div key={`${assets[i]}_${i}`} className="asset">
                <Image  quality="100%" layout="fill" src={`${assets[i]}`} alt="A Theme image to represent that Patchnote."  className="patch_preview_image"/>
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
export function Rating_container(props: {ratings: {user: string, rating: number}[]}) {
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
//Component that creates a Pack H1 Element with extras
export function H1_with_deco(props: {title: string}): ReactElement {
    return (
      <div className="h1_with_deco">
          <div className="left_container">
              <span className="left_line"/>
              <div className="left_icon"/>
          </div>
          
          <h1>{props.title}</h1>
  
          <div className="right_container">
              <div className="right_icon"/>
              <span className="right_line"/>
          </div>
      </div>
    );
}




export const getServerSideProps: GetServerSideProps = async(context) => {
    if(typeof context.query.id === "string") {
        const response = await fetch(`http://localhost:3000/api/get_pack?id=${context.query.id}`)
        if(response.status === 200) {
            const pack = await response.json()
            
            return{
                props: {
                    pack
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

    } else {
        return {
            redirect: {
                destination: `/browse`,
                permanent: false,
            }
        }
    }
} 

const packssss = {
    _id: "1",
    user: {
        _id: "123",
        username: "Arclipse",
        user_since: "20.04.2015",
        about: "Pixelart artist",
        profile_image: "/image1",
        released_packs: []
    },
    title: "Lost Sanctuary",
    sub_title: "A new Story has begun",
    preview_image: "/packs/pack_1/SampleA.png",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et lectus eu tincidunt faucibus. Vel venenatis eget euismod nulla ut imperdiet tristique amet scelerisque. Sed scelerisque sit faucibus imperdiet. Leo senectus diam volutpat arcu. Consequat libero, scelerisque sed pretium sit semper.",
    socials: ["Twitter", "Insta"],
    date: "20.05.2015",
    rating: {
        user_ratings: [
            {
                user: "arclipse",
                rating: 5
            }
        ],
        avg_rating: 5
    },
    tags: ["Lol", "rpg"],
    content: [
        {
            section_name: "Characters",
            section_assets: ["/image1", "/image2", "/image2", "/image2", "/image2", "/image2", "/image2", "/image2", "/image2", "/image2", "/image2", "/image2", "/image2"]
        },
        {
            section_name: "Backgrounds",
            section_assets: ["/image1", "/image2"]
        },
    ],
    downloads: 1
}