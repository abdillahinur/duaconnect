import React from 'react'
import PrayerHandsIcon from './icons/PrayerHandsIcon'
import { Heart, Star } from "lucide-react"

export default function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          Features
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          
          {/* Feature 1: Share Duas */}
          <div className="flex flex-col items-center text-center">
            <PrayerHandsIcon className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Share Duas</h3>
            <p className="text-gray-600">
              Post your prayers and supplications for the community to support.
            </p>
          </div>

          {/* Feature 2: Support Others */}
          <div className="flex flex-col items-center text-center">
            <Heart className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Support Others</h3>
            <p className="text-gray-600">
              Offer your prayers and words of encouragement to fellow Muslims.
            </p>
          </div>

          {/* Feature 3: Daily Inspiration */}
          <div className="flex flex-col items-center text-center">
            <Star className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Daily Inspiration</h3>
            <p className="text-gray-600">
              Receive daily Quranic verses and hadith to inspire your day.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
