import '../styles/global.scss'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { AnimatePresence, motion } from 'framer-motion'


function MyApp({ Component, pageProps, router }: AppProps) {
  return(
    <Layout>
      <AnimatePresence exitBeforeEnter onExitComplete={() => window.scrollTo(0,0)}>
        <motion.div key={router.route} initial={{ opacity: 0}} animate={{opacity: 1, transition: {duration: 0.15}}} exit={{opacity: 0, transition: {duration: 0.15}}}>
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </Layout>
  )
}

export default MyApp
