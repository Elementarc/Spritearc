import '../styles/global.scss'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { AnimatePresence, motion } from 'framer-motion'


function MyApp({ Component, pageProps }: AppProps) {
  
  return(
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
