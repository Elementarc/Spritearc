import React, { ReactElement, useEffect , useContext} from 'react';
import Image from "next/image"
//SVG COMPONENTS (ICONS)
import Twitter from "../public/logos/twitter.png"
import Discord from "../public/logos/discord.png"
import Patreon from "../public/logos/patreon.png"
import Link from 'next/dist/client/link';

export default function Footer(): ReactElement {

    return (
        <>
            <div className="footer_container" id="footer_container">
                
                {/*<Background_gradient id="footer_background" page_id="app_content_container"/>*/}
                
                <h1>Spritearc</h1>

                <div className="socials_container">
                    <Social_item link="https://twitter.com/Spritearc" logo={Twitter} alt="Twitter Logo"/>
                    <Social_item link="https://www.patreon.com/spritearc" logo={Patreon} alt="Patreon Logo"/>
                    <Social_item link="https://discord.gg/HRZXRcFFwU" logo={Discord} alt="Discord Logo"/>
                </div>

                <div className="legal_container">
                    <Link href="/tos" scroll={false}><a>Terms of Service</a></Link>
                    <Link href="/privacy" scroll={false}><a>Privacy Policy</a></Link>
                    <Link href="/contact" scroll={false}><a>Contact</a></Link>
                    <Link href="/cookies" scroll={false}><a>Cookies</a></Link>
                    <Link href="/guidelines" scroll={false}><a>Guidelines</a></Link>
                </div>

                <h5>©2022 By Hamit Kiziltas. ALL RIGHTS RESERVED.</h5>
                
            </div>
        </>
    );
}

export function Social_item(props: {link: string, logo: any, alt: string}): ReactElement {
    return(
        <a href={props.link} rel="noreferrer" target="_blank" className="social_item">
            <Image loading='lazy' unoptimized={true} src={props.logo} alt={props.alt} layout="fill" ></Image>
        </a>
    )
}