// src/app/layout.tsx
import './globals.css'
import Layout from '../components/Layout'
import localFont from 'next/font/local'
import { ToastProvider } from "../components/ui/use-toast";

const rubik = localFont({
  src: [
    { path: "../../public/assets/fonts/Rubik-Light.ttf", weight: "300" },
    { path: "../../public/assets/fonts/Rubik-Regular.ttf", weight: "400" },
    { path: "../../public/assets/fonts/Rubik-Bold.ttf", weight: "700" },
  ],
  variable: "--font-rubik",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${rubik.variable} font-rubik`}>
        <ToastProvider>
          <Layout>{children}</Layout>
        </ToastProvider>
      </body>
    </html>
  )
}
