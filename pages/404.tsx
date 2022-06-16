import { useRouter } from 'next/router';
import React from 'react';
import Footer from '../components/footer';
import Head from 'next/head';
import Button from '../components/button';
import PageContent from '../components/layout/pageContent';
import MetaGenerator from '../components/MetaGenerator';

export default function PageRenderer() {
    return (
        <>
            <MetaGenerator
                title='Spritearc - Error 404'
                description={`404 - We couldn't find what you were looking for!`}
                url={`https://Spritearc.com/`}
                imageLinkSecure={`https://${process.env.NEXT_PUBLIC_APP_NAME}.com/images/spritearc_wallpaper.png`}
            />
            <Error404/>
            <Footer />
        </>
    );
}


function Error404() {
    const router = useRouter()

    return (
        <PageContent>
            <div className='error_content'>
                <h1>{`We couldn't find what you were looking for.`}</h1>
                <p>{`The page you were looking for probably got removed! We're sorry that you had to experience this.`}</p>
                <Button btnLabel='Back To Safety' className='primary default' onClick={() => {router.push("/", "/", {scroll: false})}} />
            </div>
        </PageContent>
    );
}

