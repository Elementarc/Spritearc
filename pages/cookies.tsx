import React, {useEffect} from 'react';
import Footer from '../components/footer';
import Image from "next/image"
import WaveSvg from "../public/images/wave.svg"
import { Qick_legal_navigation } from './tos';

export default function Terms_of_service() {
    //Setting numbers for headers
    useEffect(() => {
        const section_headers = document.getElementsByClassName("section_header") as HTMLCollection

        const headers_arr = Array.from(section_headers)

        for(let i = 0; i < headers_arr.length; i++) {
            const headers = headers_arr as HTMLHeadElement[]
            headers[i].innerText = `${i + 1}. ${headers[i].innerText}`
        }
       
    }, [])


    return (
        <div className='tos_page'>
            
            <div className='content'>
                <div className='legal_content_container'>
                    <section>
                        <h1 className='tos_header'>COOKIE POLICY</h1>
                        <h4 className='tos_update_date'>{`Last updated: 30/01/2022`}</h4>
                    </section>
                    <General_cookie/>
                    <Cookie_usage/>

                    <What_information_is_collected_about_me/>
                    <How_do_i_restrict_cookies/>
                    <section>
                        <h1>Contact Me</h1>

                        <p>Dont hesitate to contact me if you have any questions Via Email:</p>
                        <a href={`mailto: arctale.work@gmail.com`}>{"Arctale.work@gmail.com"}</a>
                    </section>
                </div>
                <Qick_legal_navigation/>
            </div>
            <Footer />
        </div>
    );
}

function General_cookie() {
    return(
        <section>
            <h1>{`What is a cookie?`}</h1>

            <p>{`A cookie is a small piece of data that allows your browser to maintain a session when visiting different pages on our website. If you use Spritearc.com or any sites contained within our domain, Spritearc.com, then both first and third party cookies may be set when you access the site.`}</p>
            <br />
            <p>{`This policy describes how Spritearc.com, and any third parties it embeds, use cookies, and what data those cookies may collect.`}</p>
        </section>
    )
}
function Cookie_usage() {
    return(
        <section>
            <h1 className='section_header'>{`Cookie Usage`}</h1>

            <p>{`Our cookie usage falls into two categories:`}</p>
            <ul>
                <li>
                    <b>{`Account Sessions: `}</b>
                    {`Cookies are used for logging into user accounts, and storing data about your preferences for browsing. Additionally, these cookies are used for security measures like Cross Site Request Forgery) protection.`}
                </li>

                <li>
                    <b>{`Analytics: `}</b>
                    {`We use cookies to track usage activity in order to make business decisions and build a better product. Additionally, we make aggregate data available to the Publishers on our platform with information on how their products are accessed. This includes things like: referring pages, how many times their page was viewed, files that were downloaded, etc.`}
                </li>
            </ul>
        </section>
    )
}

function What_information_is_collected_about_me() {
    return(
        <section>
            <h1 className='section_header'>{`What Information is Collected About Me`}</h1>

            <p>{`Generally, the data we collect from you is via form submission. Some data, though, is determined from your browsing history. This can include things like user preferences, and sessions identification tokens.`}</p>
            <br />
            <p> {`Additionally, the follwing third-party services may appear on some pages: `} </p> 
            <ul>
                <li>
                    <b>{`Google Analytics: `}</b>
                    {`Measures site traffic and performance`}
                </li>
            </ul>
            
        </section>
    )
}

function How_do_i_restrict_cookies() {
    return(
        <section>
            <h1 className='section_header'>{`How Do I Restrict Cookies?`}</h1>

            <div className='tos_summary'>
                <h2>{"Summary: "}</h2>
                <p>
                    {`You can delete cookies whenever you want but that might make some pages not available or work properly anymore.`}
                </p>
            </div>
            <p>{`If you do not wish to have cookies set by a third-party, you can adjust the settings on your internet browser to choose what cookies can be set. For more information, refer to the help section of your browser.`}</p>
            <br />
            <p> {`Cookies set by your browser have an expiration date assigned to them. At any time you can explicitly remove these cookies from your browser to remove the data they contain about you. Keep in mind this may effect how your session functions.`} </p> 
        </section>
    )
}