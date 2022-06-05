import { useRouter } from 'next/router';
import React from 'react';
import Footer from '../components/footer';
import Head from 'next/head';

export default function Error_404() {
    const router = useRouter()
    return (
        <>
            <Head>
				<title>{`Spritearc - Error 404`}</title>
				<meta name="description" content="We couldn't find what you were looking for!"/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Spritearc - Error 404"/>
				<meta property="og:description" content="We couldn't find what you were looking for!"/>
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>


				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content="Spritearc - Error 500"/>
				<meta name="twitter:description" content="We couldn't find what you were looking for!"/>
				<meta name="twitter:image:src" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>
            </Head>

        
            <div className='error_content'>
                <h1>{`We couldn't find what you were looking for.`}</h1>
                <p>{`The page you were looking for probably got removed! We're sorry that you had to experience this.`}</p>
                <button className='primary_button' onClick={() => {router.push("/", "/", {scroll: false})}}>Back to Safety</button>
            </div>
            <Footer />
        </>
    );
}
