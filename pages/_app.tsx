import '../styles/global.scss'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import Head from 'next/dist/shared/lib/head'
function MyApp({ Component, pageProps }: AppProps) {
  
  return(
    <>
      <Head>
        <meta name="theme-color" content="#111F35" />
      </Head>
        
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default MyApp
