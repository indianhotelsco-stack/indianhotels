import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import BookingSidebar from './BookingSidebar'
import { HOTELS, getAmenityById, getDestinationBySlug, getHotelById, REVIEWS_BY_HOTEL, DESTINATIONS } from '@/lib/data'

type Props = { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return HOTELS.map(h => ({ id: h.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const hotel = getHotelById(id)
  if (!hotel) return { title: 'Hotel Not Found' }
  const destination = DESTINATIONS.find(d => d.id === hotel.destinationId)
  return {
    title: `${hotel.name} - ${destination?.name ?? ''} | Ratings, Photos & Booking`,
    description: hotel.description,
  }
}

export default async function HotelDetailPage({ params }: Props) {
  const { id } = await params
  const hotel = getHotelById(id)
  if (!hotel) notFound()

  const destination = DESTINATIONS.find(d => d.id === hotel.destinationId)
  const reviews = REVIEWS_BY_HOTEL[hotel.id] ?? []

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6">
          {destination && (
            <Link href={`/destination/${destination.slug}`} className="text-navy text-sm hover:underline">
              ← Back to {destination.name}
            </Link>
          )}
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-4">
          <div className="rounded-lg overflow-hidden">
            <ImagePlaceholder height={320} label={hotel.name} className="rounded-lg" />
          </div>
          <div className="grid grid-cols-3 gap-2.5 mt-2.5">
            {[1, 2, 3].map(i => (
              <ImagePlaceholder key={i} height={80} label={`Photo ${i}`} className="rounded-lg" />
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-base font-bold text-navy mb-3">About This Hotel</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{hotel.description}</p>
              <h3 className="text-base font-bold text-navy mt-6 mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {hotel.amenityIds.map(aid => {
                  const a = getAmenityById(aid)
                  if (!a) return null
                  return <span key={aid} className="amenity-tag">{a.icon} {a.name}</span>
                })}
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-base font-bold text-navy mb-3">Guest Reviews</h2>
              <div className="text-sm text-gray-600 mb-4">
                ⭐ {hotel.starRating} ({hotel.reviewCount} reviews) — sample reviews shown below pending live Booking.com review sync
              </div>
              <div className="flex flex-col">
                {reviews.map((r, i) => (
                  <div key={r.id} className={`py-4 ${i < reviews.length - 1 ? 'border-b border-gray-200' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-bold text-navy">{r.reviewerName}</span>
                      <span className="text-xs text-gray-500">· {r.reviewerCountry}</span>
                    </div>
                    <div className="text-[13px] text-navy mb-1">{'⭐'.repeat(Math.round(r.rating))}</div>
                    <p className="text-[13px] text-gray-600 leading-relaxed">{r.reviewText}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <BookingSidebar hotel={hotel} />
        </div>
      </main>
      <Footer />
    </>
  )
}
