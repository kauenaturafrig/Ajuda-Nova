// pages/_app.tsx

import '@/styles/globals.css'
import type { AppProps } from 'next/app'
// import { Aleo } from 'next/font/google'
import Layout from '@/components/Layout'

// const aleo = Aleo({
//   subsets: ['latin'],
//   weight: ['300', '400', '700'],
//   variable: '--font-aleo',
// });

import localFont from 'next/font/local'

const aleo = localFont({
  src: [
    { path: '../public/assets/fonts/Aleo-Light.ttf', weight: '300', style: 'normal' },
    { path: '../public/assets/fonts/Aleo-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/assets/fonts/Aleo-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-aleo',
})


export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${aleo.variable} font-aleo`}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  )
}