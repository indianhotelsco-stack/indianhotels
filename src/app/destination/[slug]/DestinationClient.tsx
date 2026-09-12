'use client'

import { useMemo, useState } from 'react'
import FilterPanel from '@/components/FilterPanel'
import HotelCard from '@/components/HotelCard'
import type { Hotel, HotelFilters } from '@/lib/types'

export default function DestinationClient({ hotels }: { hotels: Hotel[] }) {
  const [filters, setFilters] = useState<HotelFilters>({})

  const filtered = useMemo(() => {
    let result = hotels.filter(h => {
      if (filters.maxPrice && h.pricePerNight > filters.maxPrice) return false
      if (filters.minRating && h.starRating < filters.minRating) return false
      if (filters.amenityIds && filters.amenityIds.length > 0) {
        const has = filters.amenityIds.every(a => h.amenityIds.includes(a))
        if (!has) return false
      }
      return true
    })
    if (filters.sort === 'price-asc') result = [...result].sort((a, b) => a.pricePerNight - b.pricePerNight)
    if (filters.sort === 'price-desc') result = [...result].sort((a, b) => b.pricePerNight - a.pricePerNight)
    if (filters.sort === 'rating') result = [...result].sort((a, b) => b.starRating - a.starRating)
    return result
  }, [hotels, filters])

  return (
    <div className="flex flex-col lg:flex-row">
      <FilterPanel filters={filters} onChange={setFilters} />
      <div className="flex-1 bg-gray-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">{filtered.length} hotels found</div>
          <select
            value={filters.sort ?? ''}
            onChange={e => setFilters({ ...filters, sort: (e.target.value || undefined) as HotelFilters['sort'] })}
            className="text-xs border border-gray-300 rounded-md px-2 py-1.5"
          >
            <option value="">Sort: Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-lg font-bold text-navy mb-2">No Hotels Found</div>
            <p className="text-sm text-gray-600 mb-4">Try adjusting your filters or clearing them.</p>
            <button onClick={() => setFilters({})} className="btn btn-secondary !min-h-0 !py-2 !px-4 !text-xs">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {filtered.map(h => <HotelCard key={h.id} hotel={h} />)}
          </div>
        )}
      </div>
    </div>
  )
}
