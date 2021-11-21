import { GetServerSideProps } from 'next';
import React, {ReactElement, useEffect, useState, useContext} from 'react';
import Footer from '../components/footer';
import {Pack, PackContent} from "../types"
import Link from 'next/dist/client/link';
import Image from 'next/dist/client/image';
import { Nav_shadow } from '../components/navigation';
import Svg from "../public/images/BackgroundFull.svg"
import { useParallax } from '../lib/custom_hooks';
import Background_gradient from '../components/gradient_background';
import { appContext } from "../components/layout";
import { AppContext } from '../types';
import ArrowIcon from "../public/icons/ArrowIcon.svg"
import app from 'next/app';
//Renders the full Pack
export default function Full_pack(props: {pack: Pack}) {
    const App: AppContext = useContext(appContext)

    const pack = {
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

        if(App.isMobile === false) {
            window.addEventListener("scroll", toggle_arrow)
        }
        
        return(() => {
            window.removeEventListener("scroll", toggle_arrow)
        })
    }, [App.isMobile])

    return (
        <>
            <div className="pack_page" id="pack_page">
                
                <div className="content" id="content">
                        
                    <div className="preview_container" >
                        <div className="background">
                            <Image quality="100%" priority={true} layout="fill" src={`${pack.preview_image}`} alt="An image that represents one asset of this pack."  className="patch_preview_image" id="patch_preview_image"/>
                            <div className="background_blur" />
                        </div>

                        <div className="pack_info">
                            <div className="header">
                                <h2>{pack.sub_title}</h2>

                                <H1_with_deco/>
                                <h4>
                                    {`Presented & Designed by `}
                                    <Link href="/test">{pack.user.username}</Link>
                                </h4>

                                <p>{pack.description}</p>

                                <button>Download Pack</button>

                            </div>
                        </div>

                        <div className="stats_container"> 
                            <div className="stats">
                                <span className="top_line"/>

                                <div className="stat_item rating_container">
                                    <h4>Rating: </h4>
                                    <p>202222</p>
                                </div>

                                <div className="stat_item tags_container">
                                    <h4>Tags: </h4>
                                    <p>RPG, Jump and run, lolsssasdsadasd</p>
                                </div>

                                <div className="stat_item download_container">
                                    <h4>Downloads: </h4>
                                    <p>152</p>
                                </div>

                                <div className="stat_item date_container">
                                    <h4>Released: </h4>
                                    <p>20.01.2018</p>
                                </div>

                                <span className="bottom_line"/>
                            </div>
                        </div>

                        { App.isMobile === false &&
                            <div className="arrow_container">
                                <ArrowIcon height="45px" width="45px" className="arrow_down" id="arrow_down"/>
                            </div>
                        }

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

export function H1_with_deco() {
  return (
    <div className="h1_with_deco">
        <div className="left_container">
            <span className="left_line"/>
            <div className="left_icon"/>
        </div>
        
        <h1>This is a test made by arclipse</h1>

        <div className="right_container">
            <div className="right_icon"/>
            <span className="right_line"/>
        </div>
    </div>
  );
}

//Component that creates a section with assets
export function Pack_content_section(props: {pack: Pack}) {
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
export function Pack_asset(props: {assets: string[]}) {
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


