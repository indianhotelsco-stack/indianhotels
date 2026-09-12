'use client'

import Link from 'next/link'
import Image from 'next/image'
import ImagePlaceholder from './ImagePlaceholder'
import type { Hotel } from '@/lib/types'

export default function HotelCompareModal({ hotels, onClose }: { hotels: Hotel[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[85vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-base font-bold text-navy">Compare Hotels</h2>
          <button onClick={onClose} className="text-2xl leading-none text-gray-500 hover:text-navy" aria-label="Close comparison">
            ×
          </button>
        </div>

        <div className="grid" style={{ gridTemplateColumns: `repeat(${hotels.length}, minmax(180px, 1fr))` }}>
          {hotels.map(hotel => (
            <div key={hotel.id} className="border-r last:border-r-0 border-gray-200 p-4 flex flex-col gap-2">
              <div className="relative w-full rounded-lg overflow-hidden" style={{ height: 110 }}>
                {hotel.imageUrls[0] ? (
                  <Image src={hotel.imageUrls[0]} alt={hotel.name} fill className="object-cover" />
                ) : (
                  <ImagePlaceholder height={110} label={hotel.name} />
                )}
              </div>
              <div className="text-[13px] font-bold text-navy leading-tight">{hotel.name}</div>

              <div className="text-[15px] font-bold text-gold">
                ₹{hotel.pricePerNight.toLocaleString('en-IN')}/night
                {hotel.priceIsEstimate && <span className="text-[10px] text-gray-500 font-normal"> (est.)</span>}
              </div>

              <div className="text-xs text-navy font-semibold">⭐ {hotel.starRating} ({hotel.reviewCount} reviews)</div>

              {hotel.distanceFromCenterKm !== undefined && (
                <div className="text-[11px] text-gray-500">📍 {hotel.distanceFromCenterKm.toFixed(1)} km away</div>
              )}

              <div className="text-[11px] text-gray-600">
                {hotel.amenities.length > 0
                  ? hotel.amenities.map(a => `${a.icon} ${a.name}`).join(', ')
                  : 'No verified amenities listed'}
              </div>

              <Link href={`/hotel/${hotel.id}`} className="btn btn-primary !min-h-0 !py-2 !text-xs mt-auto">
                View Hotel
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
