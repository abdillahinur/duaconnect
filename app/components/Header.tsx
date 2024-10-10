import Link from "next/link"
import PrayerHandsIcon from './icons/PrayerHandsIcon'

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      {/* Logo and Brand Link */}
      <Link className="flex items-center justify-center" href="/">
        <PrayerHandsIcon className="h-6 w-6 text-green-600" />
        <span className="ml-2 text-2xl font-bold text-green-600">DuaLink</span> {/* Updated from DuaLink to DuaConnect */}
      </Link>

      {/* Navigation Links */}
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dua-board">
          Dua Board
        </Link>

        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
          About {/* Kept About link */}
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/contact">
          Contact
        </Link>
      </nav>
    </header>
  )
}
