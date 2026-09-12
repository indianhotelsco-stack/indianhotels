import Link from 'next/link'
import Image from 'next/image'
import ImagePlaceholder from './ImagePlaceholder'
import type { Hotel } from '@/lib/types'

export default function HotelCard({
  hotel,
  compareMode = false,
  isSelected = false,
  onToggleCompare,
}: {
  hotel: Hotel
  compareMode?: boolean
  isSelected?: boolean
  onToggleCompare?: (id: string) => void
}) {
  return (
    <Link
      href={`/hotel/${hotel.id}`}
      className="card card-hover overflow-hidden !p-0 block relative"
    >
      {hotel.isFeatured && (
        <span className="absolute top-2 left-2 z-10 bg-gold text-navy text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded">
          Bestseller
        </span>
      )}
      {compareMode && (
        <div
          className="absolute top-2 right-2 z-10 bg-white/90 rounded-md p-1.5 shadow"
          onClick={e => { e.preventDefault(); e.stopPropagation() }}
        >
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-navy cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleCompare?.(hotel.id)}
            />
            Compare
          </label>
        </div>
      )}
      {hotel.imageUrls[0] ? (
        <div className="relative w-full" style={{ height: 140 }}>
          <Image src={hotel.imageUrls[0]} alt={hotel.name} fill className="object-cover" />
        </div>
      ) : (
        <ImagePlaceholder height={140} label={hotel.name} />
      )}
      <div className="p-3 flex flex-col gap-1.5">
        <div className="text-[13px] font-bold text-navy leading-tight">{hotel.name}</div>
        <div className="text-[11px] text-gray-600">{hotel.address}</div>
        <div className="text-xs text-navy font-semibold">⭐ {hotel.starRating} ({hotel.reviewCount} reviews)</div>
        {hotel.distanceFromCenterKm !== undefined && (
          <div className="text-[11px] text-gray-500">📍 {hotel.distanceFromCenterKm.toFixed(1)} km away</div>
        )}
        <div className="flex flex-wrap gap-1 mt-0.5">
          {hotel.amenities.slice(0, 3).map(a => (
            <span key={a.id} className="text-[10px] text-gray-600">
              {a.icon} {a.name}
            </span>
          ))}
        </div>
        <div className="text-[15px] font-bold text-gold mt-1">
          ₹{hotel.pricePerNight.toLocaleString('en-IN')}/night
          {hotel.priceIsEstimate && <span className="text-[10px] text-gray-500 font-normal"> (est.)</span>}
        </div>
      </div>
    </Link>
  )
}
