'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Destination } from '@/lib/types'
import { bookingParamsToQueryString } from '@/lib/booking'

export default function SearchBar({ destinations }: { destinations: Destination[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  const matches = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return destinations.filter(d => d.name.toLowerCase().includes(q) || d.region.toLowerCase().includes(q)).slice(0, 5)
  }, [query, destinations])

  function goToDestination(slug: string) {
    const qs = bookingParamsToQueryString({ checkIn, checkOut, guests })
    router.push(`/destination/${slug}${qs}`)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const match = destinations.find(d => d.name.toLowerCase() === query.trim().toLowerCase()) ?? matches[0]
    if (match) goToDestination(match.slug)
  }

  return (
    <form onSubmit={submit} className="relative max-w-2xl">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search a destination — Taj Mahal, Goa, Jaipur..."
          className="flex-1 border border-gray-300 rounded-md px-3.5 py-3 text-sm focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
        />
        <input
          type="date"
          value={checkIn}
          onChange={e => setCheckIn(e.target.value)}
          aria-label="Check-in date"
          className="border border-gray-300 rounded-md px-3 py-3 text-sm text-gray-700 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
        />
        <input
          type="date"
          value={checkOut}
          onChange={e => setCheckOut(e.target.value)}
          aria-label="Check-out date"
          className="border border-gray-300 rounded-md px-3 py-3 text-sm text-gray-700 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
        />
        <input
          type="number"
          min={1}
          max={20}
          value={guests}
          onChange={e => setGuests(Number(e.target.value))}
          aria-label="Number of guests"
          className="w-20 border border-gray-300 rounded-md px-3 py-3 text-sm text-gray-700 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
        />
        <button type="submit" className="btn btn-primary !min-h-0">Search</button>
      </div>
      {focused && matches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden">
          {matches.map(d => (
            <Link
              key={d.id}
              href={`/destination/${d.slug}${bookingParamsToQueryString({ checkIn, checkOut, guests })}`}
              className="block px-4 py-2.5 text-sm text-navy hover:bg-gray-50"
            >
              {d.name} <span className="text-gray-500 text-xs">· {d.region}</span>
            </Link>
          ))}
        </div>
      )}
    </form>
  )
}
