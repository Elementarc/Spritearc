import '../styles/global.scss'
import React, {useEffect} from 'react'
import Layout from '../components/layout'
import Head from 'next/dist/shared/lib/head'
import Auth_context_provider from '../context/auth_context_provider'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps}: any) {
    const router = useRouter()

    //Setting prev_path to session storage
    useEffect(() => {
        
        return(() => {
            sessionStorage.setItem("prev_path", router.asPath)
            console.log(sessionStorage.getItem("prev_path"))
        })
    }, [router.asPath])
    return(
        <>

            <Head>
                <meta name="theme-color" content="#111F35" />
            </Head>
            
            <Auth_context_provider>
                <Layout >
                    <Component {...pageProps}/>
                </Layout>
            </Auth_context_provider>
        </>
    )
}




/* export function Wrapped_myApp(Component: any) {
    

    const New_component = (pageProps: any) => {
        return <Component {...pageProps}/>
    }

    New_component.getInitialProps = async({req}: any) => {
        const response = await fetch("http://localhost:3000/api/verify_user_session", {method: "POST"})
        const auth = await response.json()
        
        console.log(auth)
        return {
            user: auth
        }
    }

    return New_component
}

export default Wrapped_myApp(MyApp) */


