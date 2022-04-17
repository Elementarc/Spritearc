import React from 'react';
import Footer from '../components/footer';
import Qick_legal_navigation from '../components/quick_legal_nav';
import Head from 'next/head';

export default function Terms_of_service() {

    return (
        <>
            <Head>
				<title>{`Spritearc - Contact`}</title>
				<meta name="description" content={`Do you have any question or maybe a suggestion that you would like to have? Get in contact with us and let us know how we can help you.`}/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`Spritearc - Contact`}/>
				<meta property="og:description" content={`Do you have any question or maybe a suggestion that you would like to have? Get in contact with us and let us know how we can help you.`}/>
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>

				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content={`Spritearc - Contact`}/>
				<meta name="twitter:description" content={`Do you have any question or maybe a suggestion that you would like to have? Get in contact with us and let us know how we can help you.`}/>
                <meta name="twitter:image:src" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>
            </Head>
        
                
            <div className='legal_content'>
                <div className='legal_content_container'>
                    <section>
                        <h1 className='tos_header'>CONTACT ME</h1>
                    </section>

                    <section>
                        <h1>Details</h1>
                        <br />
                        <p>Hamit Kiziltas</p>
                        <p>Obere Str. 19</p>
                        <p>74369 Löchgau</p>
                        <p>Germany</p>
                        <br />
                        <p>Dont hesitate to contact me if you have any questions Via Email:</p>
                        <a href={`mailto: arctale.work@gmail.com`}>{"Arctale.work@gmail.com"}</a>
                        
                    </section>
                </div>
                <Qick_legal_navigation />
            </div>
            
            <Footer />
        </>
    );
}


