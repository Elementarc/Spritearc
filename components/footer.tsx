import React, { ReactElement, useEffect , useContext} from 'react';
import Image from "next/image"
//SVG COMPONENTS (ICONS)
import Twitter from "../public/logos/twitter.png"
import Link from 'next/dist/client/link';
import { App_context } from '../types';
import { APP_CONTEXT } from './layout';
import { useRouter } from 'next/router';

export default function Footer(): ReactElement {
    const APP: App_context = useContext(APP_CONTEXT)
    const router = useRouter()
    //Setting background max-width and height
    useEffect(() => {
        const background = document.getElementById("background") as HTMLDivElement
        const footer = document.getElementById("footer_container") as HTMLDivElement
        const app_content_container = APP.app_content_element()

        const observer = new ResizeObserver((entries) => {

            for(let entry of entries) {
                background.style.maxHeight = `${footer.offsetTop + footer.offsetHeight}px`
                background.style.maxWidth = `${entry.contentRect.width}px`
            }
        }) 
        background.style.maxHeight = `${footer.offsetTop + footer.offsetHeight}px`
        
        observer.observe(app_content_container)
        return(() => {
            observer.unobserve(app_content_container)
        })
    }, [])

    return (
        <>
            <div className="background" id="background"/>
            <div className="footer_container" id="footer_container">
                
                {/*<Background_gradient id="footer_background" page_id="app_content_container"/>*/}
                
                <h1>Pixepalast</h1>

                <div className="socials_container">
                    <Social_item link="https://twitter.com/home" logo={Twitter} alt="Twitter Logo"/>
                </div>

                <div className="legal_container">
                    <Link href="/pack" scroll={false}><a>Terms of Service</a></Link>
                    <Link href="/pack" scroll={false}><a>Privacy Policy</a></Link>
                    <Link href="/pack" scroll={false}><a>Contact</a></Link>
                    <Link href="/pack" scroll={false}><a>Cookies</a></Link>
                </div>

                <h5>©2021 By Hamit Kiziltas. ALL RIGHTS RESERVED. All trademarks referenced herein are the properties of their respective owners.</h5>
                
            </div>
        </>
    );
}

export function Social_item(props: {link: string, logo: any, alt: string}): ReactElement {
    return(
        <a href={props.link} rel="noreferrer" target="_blank" className="social_item">
            <Image src={props.logo} alt={props.alt} layout="fill" ></Image>
        </a>
    )
}