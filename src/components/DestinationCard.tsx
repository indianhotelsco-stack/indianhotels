import Link from 'next/link'
import ImagePlaceholder from './ImagePlaceholder'
import type { Destination } from '@/lib/types'

function formatSearches(n: number): string {
  if (n >= 1000) return `${Math.round(n / 1000)}K`
  return `${n}`
}

export default function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      href={`/destination/${destination.slug}`}
      className="card card-hover overflow-hidden !p-0 block min-w-[160px]"
    >
      <ImagePlaceholder height={130} label={destination.name} />
      <div className="p-3">
        <div className="text-sm font-bold text-navy">{destination.name}</div>
        <div className="text-xs text-gray-600 mt-0.5">
          {destination.region} · {formatSearches(destination.monthlySearches)}/month
        </div>
      </div>
    </Link>
  )
}
