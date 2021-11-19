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

//Renders the full Pack
export default function Full_pack(props: {pack: Pack}) {
    const pack = {
        _id: "1",
        author: "Arclipse",
        title: "Lost Sanctuary",
        subTitle: "A new Story has begun",
        previewImage: "/packs/pack_1/SampleA.png",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et lectus eu tincidunt faucibus. Vel venenatis eget euismod nulla ut imperdiet tristique amet scelerisque. Sed scelerisque sit faucibus imperdiet. Leo senectus diam volutpat arcu. Consequat libero, scelerisque sed pretium sit semper.",
        socials: ["Twitter", "Insta"],
        date: "20.05.2015",
        rating: {
            "userRatings": [{
                "user": "arclipse",
                "rating": 5
            }],
            "avgRating": 5
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
    return (
        <>
            <div className="pack_page" id="pack_page">
                
                <div className="content" id="content">
                        
                    <div className="preview_container" >
                        <div className="background">
                            <Image quality="100%" priority={true} layout="fill" src={`${pack.previewImage}`} alt="An image that represents one asset of this pack."  className="patch_preview_image" id="patch_preview_image"/>
                            <div className="background_blur" />
                        </div>
                    </div>

                    <div className="content_container">
                        <Pack_content_section pack={pack}/>
                    </div>

                    <Nav_shadow/>
                </div>
                
                <Footer/>
            </div>
        </>
    );
}


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

export function Pack_asset(props: {assets: string[]}) {
    const assets = props.assets
    const assets_jsx = []
    
    for(let i = 0; i < assets.length; i++) {
        assets_jsx.push(
            <div key={`${assets[i]}_${i}`} className="asset">
                <Image  quality="100%" priority={true} layout="fill" src={`${assets[i]}`} alt="A Theme image to represent that Patchnote."  className="patch_preview_image"/>
            </div>
        )
    }
    console.log(assets_jsx.length)
    return (
        <div className="assets_grid_container">
            {assets_jsx}
        </div>
    );
}


