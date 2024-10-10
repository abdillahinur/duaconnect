import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import Header from './components/Header'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DuaLink', // Updated title to match the landing page
  description: 'Connect Through Prayer with DuaLink',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${nunito.className} min-h-screen bg-gray-100`}>

      <Header /> 
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
