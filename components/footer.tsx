import React, { ReactElement, useEffect } from 'react';
import Image from "next/image"
//SVG COMPONENTS (ICONS)
import Twitter from "../public/logos/twitter.png"
import Link from 'next/dist/client/link';

export default function Footer(): ReactElement {

    //Setting the background of the footer to App width and height.
    useEffect(() => {
        const getApp = document.getElementById("app_content_container") as HTMLDivElement
        const footer_background = document.getElementById("footer_background") as HTMLDivElement

        const resizeObserver = new ResizeObserver((entries) => {
            for(const entry of entries){
                
                footer_background.style.maxWidth = `${entry.contentRect.width}px`
                footer_background.style.maxHeight = `${entry.contentRect.height}px`
            }
            
        })

        resizeObserver.observe(getApp)
        return(() => {
            resizeObserver.unobserve(getApp)
        })
    }, [])

    return (
        <div className="footer_container" id="footer_container">
            <h1>Pixepalast</h1>

            <div className="socials_container">
                <Socials link="https://twitter.com/home" logo={Twitter} alt="Twitter Logo"/>
            </div>

            <div className="legal_container">
                <Link href="#" scroll={false}><a>Terms of Service</a></Link>
                <Link href="#" scroll={false}><a>Privacy Policy</a></Link>
                <Link href="#" scroll={false}><a>Contact</a></Link>
                <Link href="#" scroll={false}><a>Cookies</a></Link>
            </div>

            <h5>©2021 By Hamit Kiziltas. ALL RIGHTS RESERVED. All trademarks referenced herein are the properties of their respective owners.</h5>
            <div className="footer_background" id="footer_background"/>
        </div>
    );
}


function Socials(props: any): ReactElement {
    return(
        <a href={props.link} rel="noreferrer" target="_blank">
            <Image src={props.logo} alt={props.alt} layout="fill" ></Image>
        </a>
    )
}