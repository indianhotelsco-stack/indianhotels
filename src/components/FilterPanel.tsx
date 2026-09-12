'use client'

import type { Amenity, HotelFilters } from '@/lib/types'

const MIN_PRICE = 2000
const MAX_PRICE = 50000

export default function FilterPanel({
  filters,
  onChange,
  amenities,
}: {
  filters: HotelFilters
  onChange: (next: HotelFilters) => void
  amenities: Amenity[]
}) {
  const maxPrice = filters.maxPrice ?? MAX_PRICE

  function toggleAmenity(id: string) {
    const current = filters.amenityIds ?? []
    const next = current.includes(id) ? current.filter(a => a !== id) : [...current, id]
    onChange({ ...filters, amenityIds: next })
  }

  return (
    <aside className="w-full lg:w-[220px] shrink-0 bg-white border-r border-gray-200 p-6">
      <h2 className="text-base font-bold text-navy mb-4">Filters</h2>

      <div className="mb-6">
        <div className="text-xs font-semibold text-navy mb-2">Price Range</div>
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={500}
          value={maxPrice}
          onChange={e => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-navy"
        />
        <div className="text-xs text-gray-600 mt-1">Up to ₹{maxPrice.toLocaleString('en-IN')}</div>
      </div>

      <div className="mb-6">
        <div className="text-xs font-semibold text-navy mb-2">Star Rating</div>
        <div className="flex flex-col gap-2">
          {[5, 4, 3].map(r => (
            <label key={r} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="minRating"
                checked={filters.minRating === r}
                onChange={() => onChange({ ...filters, minRating: r })}
              />
              {r}+ Stars
            </label>
          ))}
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="minRating"
              checked={!filters.minRating}
              onChange={() => onChange({ ...filters, minRating: undefined })}
            />
            Any rating
          </label>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xs font-semibold text-navy mb-2">Amenities</div>
        <div className="flex flex-col gap-2">
          {amenities.map(a => (
            <label key={a.id} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.amenityIds ?? []).includes(a.id)}
                onChange={() => toggleAmenity(a.id)}
              />
              {a.icon} {a.name}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => onChange({})}
        className="btn btn-secondary w-full !min-h-0 !py-2 !text-xs"
      >
        Clear Filters
      </button>
    </aside>
  )
}
