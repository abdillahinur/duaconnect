import Header from '@/app/components/Header'
import Hero from '@/app/components/Hero'
import Features from '@/app/components/Features'
import Community from '@/app/components/Community'
import Footer from '@/app/components/Footer'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center">
        <Hero />
        <Features />
        <Community />
      </main>
      <Footer />
    </div>
  )
}