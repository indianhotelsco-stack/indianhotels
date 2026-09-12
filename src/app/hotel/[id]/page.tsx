import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import BookingSidebar from './BookingSidebar'
import { getAllHotelIds, getDestinationById, getHotelById, getReviewsForHotel } from '@/lib/data'

type Props = { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  const ids = await getAllHotelIds()
  return ids.map(id => ({ id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const hotel = await getHotelById(id)
  if (!hotel) return { title: 'Hotel Not Found' }
  const destination = await getDestinationById(hotel.destinationId)
  return {
    title: `${hotel.name} - ${destination?.name ?? ''} | Ratings, Photos & Booking`,
    description: hotel.description,
  }
}

export default async function HotelDetailPage({ params }: Props) {
  const { id } = await params
  const hotel = await getHotelById(id)
  if (!hotel) notFound()

  const [destination, reviews] = await Promise.all([
    getDestinationById(hotel.destinationId),
    getReviewsForHotel(hotel.id),
  ])

  const [mainImage, ...thumbnails] = hotel.imageUrls

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
          <div className="rounded-lg overflow-hidden relative" style={{ height: 320 }}>
            {mainImage ? (
              <Image src={mainImage} alt={hotel.name} fill className="object-cover" priority />
            ) : (
              <ImagePlaceholder height={320} label={hotel.name} className="rounded-lg" />
            )}
          </div>
          {thumbnails.length > 0 && (
            <div className="grid grid-cols-3 gap-2.5 mt-2.5">
              {thumbnails.slice(0, 3).map((src, i) => (
                <div key={src} className="relative rounded-lg overflow-hidden" style={{ height: 80 }}>
                  <Image src={src} alt={`${hotel.name} photo ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-base font-bold text-navy mb-3">About This Hotel</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{hotel.description}</p>
              {hotel.amenities.length > 0 && (
                <>
                  <h3 className="text-base font-bold text-navy mt-6 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.map(a => (
                      <span key={a.id} className="amenity-tag">{a.icon} {a.name}</span>
                    ))}
                  </div>
                </>
              )}
              {(hotel.phone || hotel.website || hotel.googleMapsUrl) && (
                <>
                  <h3 className="text-base font-bold text-navy mt-6 mb-3">Contact &amp; Location</h3>
                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    {hotel.phone && <div>📞 <a href={`tel:${hotel.phone.replace(/\s+/g, '')}`} className="hover:underline">{hotel.phone}</a></div>}
                    {hotel.website && (
                      <div>🌐 <a href={hotel.website} target="_blank" rel="noopener noreferrer nofollow" className="hover:underline text-navy">Official website</a></div>
                    )}
                    {hotel.googleMapsUrl && (
                      <div>📍 <a href={hotel.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-navy">View on Google Maps</a></div>
                    )}
                  </div>
                </>
              )}
            </section>

            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-base font-bold text-navy mb-3">Guest Reviews</h2>
              <div className="text-sm text-gray-600 mb-4">
                ⭐ {hotel.starRating} ({hotel.reviewCount} reviews on Google)
              </div>
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-600">No written reviews synced for this hotel yet.</p>
              ) : (
                <div className="flex flex-col">
                  {reviews.map((r, i) => (
                    <div key={r.id} className={`py-4 ${i < reviews.length - 1 ? 'border-b border-gray-200' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-bold text-navy">{r.reviewerName}</span>
                        {r.reviewerCountry && <span className="text-xs text-gray-500">· {r.reviewerCountry}</span>}
                      </div>
                      <div className="text-[13px] text-navy mb-1">{'⭐'.repeat(Math.round(r.rating))}</div>
                      <p className="text-[13px] text-gray-600 leading-relaxed">{r.reviewText}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <BookingSidebar hotel={hotel} />
        </div>
      </main>
      <Footer />
    </>
  )
}
