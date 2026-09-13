'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import FilterPanel from '@/components/FilterPanel'
import HotelCard from '@/components/HotelCard'
import HotelCompareModal from '@/components/HotelCompareModal'
import type { Amenity, Destination, Hotel, HotelFilters } from '@/lib/types'
import { bookingParamsToQueryString, type BookingSearchParams } from '@/lib/booking'

const HotelMap = dynamic(() => import('@/components/HotelMap'), { ssr: false })

const MAX_COMPARE = 3

export default function DestinationClient({
  hotels,
  amenities,
  destination,
  search,
}: {
  hotels: Hotel[]
  amenities: Amenity[]
  destination: Destination
  search: BookingSearchParams
}) {
  const searchQueryString = bookingParamsToQueryString(search)
  const [filters, setFilters] = useState<HotelFilters>({})
  const [view, setView] = useState<'list' | 'map'>('list')
  const [compareMode, setCompareMode] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  const filtered = useMemo(() => {
    let result = hotels.filter(h => {
      if (filters.maxPrice && h.pricePerNight > filters.maxPrice) return false
      if (filters.minRating && h.starRating < filters.minRating) return false
      if (filters.amenityIds && filters.amenityIds.length > 0) {
        const hotelAmenityIds = h.amenities.map(a => a.id)
        const has = filters.amenityIds.every(a => hotelAmenityIds.includes(a))
        if (!has) return false
      }
      return true
    })
    if (filters.sort === 'price-asc') result = [...result].sort((a, b) => a.pricePerNight - b.pricePerNight)
    if (filters.sort === 'price-desc') result = [...result].sort((a, b) => b.pricePerNight - a.pricePerNight)
    if (filters.sort === 'rating') result = [...result].sort((a, b) => b.starRating - a.starRating)
    if (filters.sort === 'distance') {
      result = [...result].sort((a, b) => (a.distanceFromCenterKm ?? Infinity) - (b.distanceFromCenterKm ?? Infinity))
    }
    return result
  }, [hotels, filters])

  function toggleCompare(id: string) {
    setCompareIds(current => {
      if (current.includes(id)) return current.filter(c => c !== id)
      if (current.length >= MAX_COMPARE) return current
      return [...current, id]
    })
  }

  function exitCompareMode() {
    setCompareMode(false)
    setCompareIds([])
  }

  const compareHotels = hotels.filter(h => compareIds.includes(h.id))

  return (
    <div className="flex flex-col lg:flex-row">
      <FilterPanel filters={filters} onChange={setFilters} amenities={amenities} />
      <div className="flex-1 bg-gray-50 p-6 pb-24">
        {(search.checkIn || search.checkOut || search.guests) && (
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 mb-4 text-xs text-gray-700">
            Showing hotels for{' '}
            {search.checkIn && search.checkOut ? (
              <strong className="text-navy">{search.checkIn} → {search.checkOut}</strong>
            ) : (
              <strong className="text-navy">your selected dates</strong>
            )}
            {search.guests ? <> · <strong className="text-navy">{search.guests} guest{search.guests === 1 ? '' : 's'}</strong></> : null}
            {' '}— carried through to Booking.com when you click a hotel.
          </div>
        )}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="text-sm text-gray-600">{filtered.length} hotel{filtered.length === 1 ? '' : 's'} found</div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex rounded-md border border-gray-300 overflow-hidden text-xs">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 font-semibold ${view === 'list' ? 'bg-navy text-white' : 'bg-white text-navy'}`}
              >
                List
              </button>
              <button
                onClick={() => setView('map')}
                className={`px-3 py-1.5 font-semibold ${view === 'map' ? 'bg-navy text-white' : 'bg-white text-navy'}`}
              >
                Map
              </button>
            </div>
            <button
              onClick={() => (compareMode ? exitCompareMode() : setCompareMode(true))}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md border ${compareMode ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-gray-300'}`}
            >
              {compareMode ? 'Cancel Compare' : 'Compare Hotels'}
            </button>
            <select
              value={filters.sort ?? ''}
              onChange={e => setFilters({ ...filters, sort: (e.target.value || undefined) as HotelFilters['sort'] })}
              className="text-xs border border-gray-300 rounded-md px-2 py-1.5"
            >
              <option value="">Sort: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="distance">Distance</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-lg font-bold text-navy mb-2">No Hotels Found</div>
            <p className="text-sm text-gray-600 mb-4">Try adjusting your filters or clearing them.</p>
            <button onClick={() => setFilters({})} className="btn btn-secondary !min-h-0 !py-2 !px-4 !text-xs">
              Clear Filters
            </button>
          </div>
        ) : view === 'map' ? (
          <HotelMap hotels={filtered} center={destination} />
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {filtered.map(h => (
              <HotelCard
                key={h.id}
                hotel={h}
                compareMode={compareMode}
                isSelected={compareIds.includes(h.id)}
                onToggleCompare={toggleCompare}
                hrefQueryString={searchQueryString}
              />
            ))}
          </div>
        )}
      </div>

      {compareMode && compareIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-navy text-white p-4 flex items-center justify-between z-40 shadow-lg">
          <span className="text-sm">{compareIds.length} of {MAX_COMPARE} selected</span>
          <button
            onClick={() => setShowCompareModal(true)}
            disabled={compareIds.length < 2}
            className="btn btn-primary !min-h-0 !py-2 !px-4 !text-xs disabled:opacity-50"
          >
            Compare Now
          </button>
        </div>
      )}

      {showCompareModal && (
        <HotelCompareModal hotels={compareHotels} onClose={() => setShowCompareModal(false)} />
      )}
    </div>
  )
}
