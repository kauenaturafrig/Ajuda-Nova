import { ReactNode } from 'react'
import Head from 'next/head'
import Sidebar from './Sidebar'
import { ThemeProvider } from './themeContext'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeProvider>
        <Head>
          <title>Manual de Ajuda</title>
          <meta name="description" content="Links úteis e tutoriais" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex">
          <Sidebar />
          <main className="ml-28 p-6 w-full bg-gray-200 dark:bg-gray-900 min-h-screen">
            {children}
          </main>
        </div>
      </ThemeProvider>
    </>
  )
}
