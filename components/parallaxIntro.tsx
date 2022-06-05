import { useRouter } from 'next/router';
import React from 'react';
import Image from 'next/image';
import ArrowIcon from "../public/icons/ArrowIcon.svg"
import { useParallax } from '../lib/custom_hooks';

export default function ParallaxIntro(props: {title: string, subTitle: string, description: string, btnLabel?: string, btnCallback?: () => void, contentUrl: string}) {
    useParallax("intro_image")
    const router = useRouter()
    return(
        <div className="intro_container">
            <div className="intro_content">
                <h2>{props.subTitle}</h2>
                <h1>{props.title}</h1>
                <p className="big">{props.description}</p>

                {props.btnLabel && <button className="primary big" onClick={props.btnCallback}>{props.btnLabel}</button> }
                
            </div>
            
            <div className="arrow_container">
                <ArrowIcon height="45px" width="45px" className="arrow_down" id="arrow_down"/>
            </div>

            <Image src={props.contentUrl} alt="Pixel art wallpaper of the sky." id="intro_image" layout="fill"></Image>
            <div className="background_blur"></div>
        </div>
    )
}