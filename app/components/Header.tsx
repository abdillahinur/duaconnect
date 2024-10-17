
"use client"
import React, { useState } from "react"
import Link from "next/link"
import PrayerHandsIcon from './icons/PrayerHandsIcon'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-white shadow-sm">
      {/* Logo and Brand Link */}
      <Link className="flex items-center justify-center" href="/">
        <PrayerHandsIcon className="h-6 w-6 text-green-600" />
        <span className="ml-2 text-2xl font-bold text-green-600">DuaLink</span>
      </Link>

      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation Links */}
      <nav className={`${isMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row absolute lg:relative top-14 lg:top-0 left-0 right-0 bg-white lg:bg-transparent shadow-md lg:shadow-none z-50 lg:ml-auto`}>
        <Link className="px-4 py-2 text-sm font-medium hover:bg-green-100 lg:hover:bg-transparent lg:hover:text-green-600" href="/daily-inspiration">
          Daily Inspiration
        </Link>
        <Link className="px-4 py-2 text-sm font-medium hover:bg-green-100 lg:hover:bg-transparent lg:hover:text-green-600" href="/dua-board">
          Dua Board
        </Link>
        <Link className="px-4 py-2 text-sm font-medium hover:bg-green-100 lg:hover:bg-transparent lg:hover:text-green-600" href="/about">
          About
        </Link>
        <Link className="px-4 py-2 text-sm font-medium hover:bg-green-100 lg:hover:bg-transparent lg:hover:text-green-600" href="/contact">
          Contact
        </Link>
      </nav>
    </header>
  )
}