import '../styles/global.scss'
import React, {useEffect} from 'react'
import Layout from '../components/layout/layout'
import Head from 'next/dist/shared/lib/head'
import { useRouter } from 'next/router'
import AccountContextProvider from '../context/accountContextProvider'

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
                <AccountContextProvider>
                    <Layout>
                        <Component {...pageProps}/>
                    </Layout>
                </AccountContextProvider>
            </React.StrictMode>
        </>
    )
}








