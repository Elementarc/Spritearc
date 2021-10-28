import React, { ReactElement } from 'react';
//SVG COMPONENTS (ICONS)
import TwitterLogo from "../public/logos/Twitter.svg"

export default function Footer(): ReactElement {
  return (
    <footer className="footer_container">
        <h1>Pixepalast</h1>
        <div className="socials_container">
            <Socials link="https://twitter.com/home" icon={TwitterLogo} alt="Twitter Logo"/>
        </div>
        <div className="legal_container">
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Contact</a>
            <a href="#">Cookies</a>
        </div>
        <p>©2021 By Hamit Kiziltas. ALL RIGHTS RESERVED. All trademarks referenced herein are the properties of their respective owners.</p>
    </footer>
  );
}


function Socials(props: any): ReactElement {
    const Icon = props.icon
    return(
        <a href={props.link} rel="noreferrer" target="_blank">
            <Icon />
        </a>
    )
}