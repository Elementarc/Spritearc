import { useRouter } from 'next/router';
import React from 'react';
import Footer from '../components/footer';
import Button from '../components/button';
import PageContent from '../components/layout/pageContent';
import MetaGenerator from '../components/MetaGenerator';

export default function PageRenderer() {
    return (
        <>
            <MetaGenerator
                title='Spritearc - Error 500'
                description={`500 - Something went wrong while trying to get this page.`}
                url={`https://Spritearc.com/`}
                imageLinkSecure={`https://${process.env.NEXT_PUBLIC_APP_NAME}.com/images/spritearc_wallpaper.png`}
            />
            <Error500/>
            <Footer />
        </>
    );
}


function Error500() {
    const router = useRouter()

    return (
        <PageContent>
            <div className='error_content'>
                <h1>{`Something went wrong while trying to get this page.`}</h1>
                <p>{`We had problems delivering you this page. Please contact an admin`}</p>
                <Button btnLabel='Back To Safety' className='primary default' onClick={() => {router.push("/", "/", {scroll: false})}} />
            </div>
        </PageContent>
    );
}

