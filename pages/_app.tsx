import '../styles/global.scss'
import React, {useEffect, useContext} from 'react'
import Layout from '../components/layout'
import Head from 'next/dist/shared/lib/head'
import Auth_context_provider from '../context/auth_context_provider'
import { useRouter } from 'next/router'
import {App_notification_context_type} from "../types"
import Script from 'next/script'
import { App_notification_context, NOTIFICATION_ACTIONS } from '../context/app_notification_context_provider'

export default function MyApp({ Component, pageProps}: any) {
    const router = useRouter()
    
    
    //Setting prev_path to session storage
    useEffect(() => {
        
        return(() => {
            sessionStorage.setItem("prev_path", router.asPath)
        })

    }, [router.asPath])

    return(
        <>
            {/* <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} strategy='lazyOnload'/>
            <Script>
                {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', ${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS})`}
            </Script> */}

            <Head>
                <meta name="theme-color" content="#111F35" />
            </Head>
            
            <React.StrictMode>
                <Auth_context_provider>
                    <Layout >
                        <Component {...pageProps}/>
                    </Layout>
                </Auth_context_provider>
            </React.StrictMode>
        </>
    )
}








