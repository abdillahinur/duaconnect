"use client"

import React, { useState, useEffect } from 'react'
import { ArrowRightIcon, BookOpenIcon, StarIcon } from "lucide-react"

// Define types for the inspiration data
interface QuranVerse {
  arabic: string;
  english: string;
  surah: string;
  ayah: string;
}

interface InspirationData {
  quranVerse: QuranVerse;
  hadith: string;
}

// Mock function to simulate API call to Google's Generative AI
const fetchDailyInspiration = async (): Promise<InspirationData> => {
  // In a real implementation, this would be an API call to Google's Generative AI
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        quranVerse: {
          arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ ۖ فَلْيَسْتَجِيبُوا لِي وَلْيُؤْمِنُوا بِي لَعَلَّهُمْ يَرْشُدُونَ",
          english: "And when My servants ask you concerning Me, indeed I am near. I respond to the invocation of the supplicant when he calls upon Me. So let them respond to Me and believe in Me that they may be guided.",
          surah: "Al-Baqarah",
          ayah: "186"
        },
        hadith: "The Prophet (ﷺ) said, 'The best among you are those who have the best manners and character.' [Sahih al-Bukhari]"
      })
    }, 1000)
  })
}

export default function DailyInspiration() {
  const [inspiration, setInspiration] = useState<InspirationData>({
    quranVerse: { arabic: '', english: '', surah: '', ayah: '' },
    hadith: ''
  })
  const [loading, setLoading] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [smsOptIn, setSmsOptIn] = useState(false)
  const [emailOptIn, setEmailOptIn] = useState(false)

  useEffect(() => {
    const loadInspiration = async () => {
      setLoading(true)
      try {
        const data = await fetchDailyInspiration()
        setInspiration(data)
      } catch (error) {
        console.error("Failed to fetch daily inspiration:", error)
        // You might want to set some error state here
      } finally {
        setLoading(false)
      }
    }

    loadInspiration()

    // Set up daily refresh at midnight EST
    const now = new Date()
    const night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // tomorrow
      5, // 5 AM UTC = midnight EST
      0, 0, 0
    )
    const msToMidnight = night.getTime() - now.getTime()

    const timeoutId = setTimeout(() => {
      loadInspiration()
      // Set up recurring daily refresh
      setInterval(loadInspiration, 24 * 60 * 60 * 1000)
    }, msToMidnight)

    return () => clearTimeout(timeoutId)
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically send this data to your backend
    console.log({ phoneNumber, email, smsOptIn, emailOptIn })
    // Reset form after submission
    setPhoneNumber('')
    setEmail('')
    setSmsOptIn(false)
    setEmailOptIn(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Daily Inspiration</h1>
      <p className="text-center mb-8 text-lg">
        Receive daily Quranic verses and hadith to inspire your day.
      </p>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BookOpenIcon className="mr-2 h-6 w-6 text-green-600" />
              Quranic Verse of the Day
            </h2>
            <p className="text-2xl mb-4 text-right font-arabic" lang="ar" dir="rtl">{inspiration.quranVerse.arabic}</p>
            <p className="text-lg mb-4">{inspiration.quranVerse.english}</p>
            <p className="text-sm text-gray-600">Surah {inspiration.quranVerse.surah}, Ayah {inspiration.quranVerse.ayah}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <StarIcon className="mr-2 h-6 w-6 text-green-600" />
              Hadith of the Day
            </h2>
            <p className="text-lg">{inspiration.hadith}</p>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Receive Daily Inspiration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number (with country code)</label>
            <input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="sms-opt-in"
              type="checkbox"
              checked={smsOptIn}
              onChange={(e) => setSmsOptIn(e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="sms-opt-in" className="text-sm text-gray-700">Receive daily inspiration via SMS</label>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="email-opt-in"
              type="checkbox"
              checked={emailOptIn}
              onChange={(e) => setEmailOptIn(e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="email-opt-in" className="text-sm text-gray-700">Receive daily inspiration via Email</label>
          </div>
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Subscribe to Daily Inspiration
          </button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
          Share Today&apos;s Inspiration <ArrowRightIcon className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  )
}