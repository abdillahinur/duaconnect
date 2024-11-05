"use client"
import React, { useState } from "react"
import Link from "next/link"
import PrayerHandsIcon from './icons/PrayerHandsIcon'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Add a function to handle link clicks
  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  // Create a custom NavLink component to avoid repetition
  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link 
      href={href}
      onClick={handleLinkClick}
      className="px-4 py-2 text-sm font-medium hover:bg-green-100 lg:hover:bg-transparent lg:hover:text-green-600"
    >
      {children}
    </Link>
  )

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-white shadow-sm">
      {/* Logo and Brand Link */}
      <Link 
        className="flex items-center justify-center" 
        href="/"
        onClick={handleLinkClick}
      >
        <PrayerHandsIcon className="h-6 w-6 text-green-600" />
        <span className="ml-2 text-2xl font-bold text-green-600">DuaLink</span>
      </Link>

      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation Links */}
      <nav className={`${
        isMenuOpen ? 'flex' : 'hidden'
      } lg:flex flex-col lg:flex-row absolute lg:relative top-14 lg:top-0 left-0 right-0 bg-white lg:bg-transparent shadow-md lg:shadow-none z-50 lg:ml-auto`}>
        <NavLink href="/daily-inspiration">
          Daily Inspiration
        </NavLink>
        <NavLink href="/dua-board">
          Dua Board
        </NavLink>
        <NavLink href="/about">
          About
        </NavLink>
        <NavLink href="/contact">
          Contact
        </NavLink>
      </nav>
    </header>
  )
}