'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DESTINATIONS } from '@/lib/data'

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const matches = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return DESTINATIONS.filter(d => d.name.toLowerCase().includes(q) || d.region.toLowerCase().includes(q)).slice(0, 5)
  }, [query])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const match = DESTINATIONS.find(d => d.name.toLowerCase() === query.trim().toLowerCase()) ?? matches[0]
    if (match) router.push(`/destination/${match.slug}`)
  }

  return (
    <form onSubmit={submit} className="relative max-w-xl">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search a destination — Taj Mahal, Goa, Jaipur..."
          className="flex-1 border border-gray-300 rounded-md px-3.5 py-3 text-sm focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
        />
        <button type="submit" className="btn btn-primary !min-h-0">Search</button>
      </div>
      {focused && matches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden">
          {matches.map(d => (
            <Link
              key={d.id}
              href={`/destination/${d.slug}`}
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
