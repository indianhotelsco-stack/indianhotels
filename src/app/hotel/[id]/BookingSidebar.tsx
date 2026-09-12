'use client'

import { useState } from 'react'
import type { Hotel } from '@/lib/types'

export default function BookingSidebar({ hotel }: { hotel: Hotel }) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const nights = (() => {
    if (!checkIn || !checkOut) return 0
    const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime()
    return ms > 0 ? Math.round(ms / (1000 * 60 * 60 * 24)) : 0
  })()

  return (
    <aside className="bg-gray-50 border border-gray-200 rounded-lg p-6 lg:sticky lg:top-20 h-fit">
      <h1 className="text-2xl font-bold text-navy mb-1">{hotel.name}</h1>
      <div className="text-sm text-navy font-semibold mb-1">⭐ {hotel.starRating} ({hotel.reviewCount} reviews)</div>
      <div className="text-[13px] text-gray-600 mb-6">{hotel.address}</div>

      <div className="text-[28px] font-bold text-gold mb-6">
        ₹{hotel.pricePerNight.toLocaleString('en-IN')}<span className="text-sm text-gray-600 font-normal">/night{hotel.priceIsEstimate ? ' (estimated)' : ''}</span>
      </div>

      <label className="block text-xs font-bold text-navy mb-1">Check-in</label>
      <input
        type="date"
        value={checkIn}
        onChange={e => setCheckIn(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm mb-3"
      />
      <label className="block text-xs font-bold text-navy mb-1">Check-out</label>
      <input
        type="date"
        value={checkOut}
        onChange={e => setCheckOut(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm mb-4"
      />

      {nights > 0 && (
        <div className="text-xs text-gray-600 mb-4">
          {nights} night{nights === 1 ? '' : 's'} × ₹{hotel.pricePerNight.toLocaleString('en-IN')} = <strong className="text-navy">₹{(nights * hotel.pricePerNight).toLocaleString('en-IN')}</strong>
        </div>
      )}

      <a
        href={hotel.bookingComAffiliateLink}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="btn btn-accent w-full"
      >
        Book Now →
      </a>
      <p className="text-[11px] text-gray-600 text-center mt-3">Powered by Booking.com</p>
    </aside>
  )
}
