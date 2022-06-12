import '../styles/global.scss'
import React, {useEffect} from 'react'
import Layout from '../components/layout/layout'
import Head from 'next/dist/shared/lib/head'
import Auth_context_provider from '../context/auth_context_provider'
import { useRouter } from 'next/router'

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
            <Head>
                <meta name="theme-color" content="#111F35" />
                <meta name="@spritearc" content="twitter:creator"/>
				<meta name="@spritearc" content="twitter:site"/>
            </Head>
            
            <React.StrictMode>
                <Auth_context_provider>
                    <Layout>
                        <Component {...pageProps}/>
                    </Layout>
                </Auth_context_provider>
            </React.StrictMode>
        </>
    )
}








