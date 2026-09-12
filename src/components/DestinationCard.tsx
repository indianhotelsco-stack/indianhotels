import Link from 'next/link'
import Image from 'next/image'
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
      className="group relative block overflow-hidden rounded-lg border border-gray-200 min-w-[160px] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      style={{ height: 170 }}
    >
      {destination.imageUrl ? (
        <Image
          src={destination.imageUrl}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 200px"
        />
      ) : (
        <ImagePlaceholder height={170} label={destination.name} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="text-sm font-bold text-white leading-tight">{destination.name}</div>
        <div className="text-xs text-white/80 mt-0.5">
          {destination.region} · {formatSearches(destination.monthlySearches)}/month
        </div>
      </div>
    </Link>
  )
}
