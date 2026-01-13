// src/app/layout.tsx
import './globals.css'
import Layout from '../components/Layout'
import localFont from 'next/font/local'
import { ToastProvider } from "../components/ui/use-toast";

const aleo = localFont({
  src: [
    { path: "../../public/assets/fonts/Aleo-Light.ttf", weight: "300" },
    { path: "../../public/assets/fonts/Aleo-Regular.ttf", weight: "400" },
    { path: "../../public/assets/fonts/Aleo-Bold.ttf", weight: "700" },
  ],
  variable: "--font-aleo",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${aleo.variable} font-aleo`}>
        <ToastProvider>
          <Layout>{children}</Layout>
        </ToastProvider>
      </body>
    </html>
  )
}
