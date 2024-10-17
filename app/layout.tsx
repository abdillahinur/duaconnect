import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DuaLink',
  description: 'Connect Through Prayer with DuaLink',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={nunito.className}>
      <body className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}