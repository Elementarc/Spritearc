import { GetServerSideProps } from 'next';
import React, {ReactElement, useEffect, useState} from 'react';
import Footer from '../components/footer';
import {Pack} from "../types"
import Link from 'next/dist/client/link';
import Image from 'next/dist/client/image';
import { Nav_shadow } from '../components/navigation';
import Svg from "../public/images/BackgroundFull.svg"
import { useParallax } from '../lib/custom_hooks';
import Background_gradient from '../components/gradient_background';

export default function Pack_handler(props: {pack: Pack}) {
    const pack = props.pack

    return (
        <>
            {pack
                ? <Full_pack pack={pack}/>
                : <Search_for_pack />
            }
            
        </>
    );
}


//Renders the full Pack
export function Full_pack(props: {pack: Pack}) {
    const pack = props.pack
    
    return (
        <>
            <div className="pack_page">
                
                <div className="content">

                    <Nav_shadow/>
                </div>
                
                <Footer/>
            </div>
        </>
    );
}



//Component shown when Page does not have a query. // There is no Pack
export function Search_for_pack() {

    return (
        <>
            <div className="search_for_pack_container">
                <h1>Please Enter A Pack ID.</h1>
                <div className="input_container">
                    <input type="text" placeholder="Pack ID"/>
                    <span />
                </div>
                
                <button>Search Pack</button>
            </div>
            <Footer/>
        </>
    );
}



const testPack = {
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
    downloads: 1
}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const query = context.query
    if(typeof query.id === "string") {
        
        return {
            props: {
                pack: testPack
            }
        }
    } else {
        return{
            props: {
                query: null
            }
        }
    }
    
}