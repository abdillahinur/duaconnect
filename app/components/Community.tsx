import React from 'react'
import PrayerHandsIcon from './icons/PrayerHandsIcon'
import { Users, Heart } from "lucide-react"

export default function Community() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Our Community</h2>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <Users className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-4xl font-bold mb-2">100,000+</h3>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="flex flex-col items-center text-center">
          <PrayerHandsIcon className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-4xl font-bold mb-2">500,000+</h3>
            <p className="text-gray-600">Duas Shared</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Heart className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-4xl font-bold mb-2">2,000,000+</h3>
            <p className="text-gray-600">Supportive Actions</p>
          </div>
        </div>
      </div>
    </section>
  )
}