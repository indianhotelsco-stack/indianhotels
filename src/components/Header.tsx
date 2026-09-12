'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/#destinations', label: 'Destinations' },
  { href: '/blog', label: 'Travel Guides' },
  { href: '/about', label: 'About' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-navy font-bold text-lg" onClick={() => setMenuOpen(false)}>
          <span className="w-8 h-8 rounded bg-navy text-white grid place-items-center font-bold">IH</span>
          IndianHotels<span className="text-gold">.co</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-700">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} className="hover:text-navy">{l.label}</Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="sm:hidden text-navy text-2xl leading-none px-2"
          onClick={() => setMenuOpen(v => !v)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <nav className="sm:hidden border-t border-gray-200 bg-white px-4 py-3 flex flex-col gap-3 text-sm font-medium text-gray-700">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} className="py-1 hover:text-navy" onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
