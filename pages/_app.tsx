import '../styles/global.scss'
import React from 'react'
import Layout from '../components/layout'
import Head from 'next/dist/shared/lib/head'


export default function MyApp({ Component, pageProps}: any) {
    
    return(
        <>
            <Head>
                <meta name="theme-color" content="#111F35" />
            </Head>
                
            <Layout >
                <Component {...pageProps}/>
            </Layout>
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


