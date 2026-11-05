//src/components/Layout.tsx
"use client";

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
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="min-w-0 flex-1 bg-[#e5e7eb] dark:bg-[#0a111f]">
            {children}
          </main>
        </div>
      </ThemeProvider>
    </>
  )
}