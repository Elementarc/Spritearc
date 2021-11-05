import React, { ReactElement, useEffect } from 'react';
//SVG COMPONENTS (ICONS)
import NavIcon from "../public/icons/NavIcon.svg"
export default function Footer(): ReactElement {

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
                <Socials link="https://twitter.com/home" icon={NavIcon} alt="Twitter Logo"/>
            </div>
            <div className="legal_container">
                <a href="#">Terms of Service</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Contact</a>
                <a href="#">Cookies</a>
            </div>
            <h5>©2021 By Hamit Kiziltas. ALL RIGHTS RESERVED. All trademarks referenced herein are the properties of their respective owners.</h5>
            
            <div className="footer_background" id="footer_background"/>
        </div>
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