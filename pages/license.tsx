import React, { useRef, useState } from 'react';
import H1_with_deco from '../components/h1_with_deco';
import { capitalize_first_letter_rest_lowercase } from '../lib/custom_lib';
import { LICENSE_TYPES } from '../spritearc_lib/validate_lib';
import Footer from '../components/footer';

export default function License_page() {
    const [license, set_license] = useState<null|string>(null)
    const [toggle_options, set_toggle_options] = useState(false)

    function select_license(e: any) {
        const license = e.target.getAttribute("data-license") as string
        if(!license) return
        set_license(license.toLowerCase())
        set_toggle_options(false)
    }

    
    return (
        <>
            <div className='license_content'>

                <div className='license_options_container'>
                    <H1_with_deco title="Our Licenses"/>
                    <p className='intro_license_message'>Licenses are only valid if you are the copyright owner of the work. Otherwise the license will be invalid. Uploading copyrighted material that you dont own will result in termination of your account!</p>
                    <div onMouseLeave={() => {set_toggle_options(false)}} className='license_flex_wrapper'>

                        <div onClick={() => {set_toggle_options(!toggle_options)}} className='license_header'>
                            <h1>{license ? capitalize_first_letter_rest_lowercase(license) : "Choose a license"}</h1>
                        </div>

                        {toggle_options &&
                            <div className='license_options'>

                                <ul>
                                    <li onClick={select_license} data-license="opensource">Opensource</li>
                                    <li onClick={select_license} data-license="attribution">Attribution</li>
                                </ul>

                            </div>
                        }
                        

                    </div>
                    
                </div>

                <div className='license_explanation'>
                    {license?.toLowerCase() === LICENSE_TYPES.opensource.toLowerCase() &&
                        <Opensource_license key={"opensource"}/>
                    }

                    {license?.toLowerCase() === LICENSE_TYPES.attribution.toLowerCase() &&
                        <>
                            <Attribution_license key={"attribtion"}/>
                        </>
                    }
                </div>
            </div>

            <Footer />
        </>
    );
}


function Opensource_license() {
    return (
        <div className='license_description'>
            <h1>Opensource</h1>
            <p><b>License:</b> Creative Commons Zero, CC0</p>
            <p><b>Read more:</b> <a href="http://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel='noreferrer'>creativecommons.org</a></p>
            <br />
            <p>
                The person who associated a work with this deed has dedicated the work to the public domain by waiving all of his or her rights to the work worldwide under copyright law, including all related and neighboring rights, to the extent allowed by law.
                You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission.
            </p>
        </div>
    );
}

function Attribution_license() {
    return (
        <div className='license_description'>
            <h1>Attribution</h1>
            <p><b>License:</b> Creative Commons BY, CC-BY</p>
            <p><b>Read more:</b> <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel='noreferrer'>creativecommons.org</a></p>
            <br />
            <p>
                This license lets others distribute, remix, adapt, and build upon your work, even commercially, as long as they credit you for the original creation. This is the most accommodating of licenses offered. Recommended for maximum dissemination and use of licensed materials.
            </p>
        </div>
    );
}
