import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DestinationHeroGallery from '@/components/DestinationHeroGallery'
import DestinationClient from './DestinationClient'
import { getAllAmenities, getAllDestinations, getDestinationBySlug, getHotelsByDestination } from '@/lib/data'
import { haversineKm } from '@/lib/geo'
import { bookingParamsFromSearchParams } from '@/lib/booking'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateStaticParams() {
  const destinations = await getAllDestinations()
  return destinations.map(d => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const destination = await getDestinationBySlug(slug)
  if (!destination) return { title: 'Destination Not Found' }
  return {
    title: `Hotels near ${destination.name} | Verified Reviews & Best Prices`,
    description: `Find hotels near ${destination.name} starting from budget to luxury. Compare prices, ratings and amenities on IndianHotels.co.`,
  }
}

export default async function DestinationPage({ params, searchParams }: Props) {
  const { slug } = await params
  const search = bookingParamsFromSearchParams(await searchParams)
  const destination = await getDestinationBySlug(slug)
  if (!destination) notFound()

  const [rawHotels, amenities] = await Promise.all([
    getHotelsByDestination(destination.id),
    getAllAmenities(),
  ])
  const hotels = rawHotels.map(h => ({
    ...h,
    distanceFromCenterKm:
      h.latitude && h.longitude
        ? haversineKm(destination.latitude, destination.longitude, h.latitude, h.longitude)
        : undefined,
  }))

  // Real photos from the top-rated hotels here (getHotelsByDestination already
  // sorts by star_rating desc) — one per hotel, up to 12, so the destination
  // gallery is genuine hotel photography, not a single stock banner.
  const galleryPhotos = hotels
    .map(h => h.imageUrls[0])
    .filter((url): url is string => Boolean(url))
    .slice(0, 12)
  if (galleryPhotos.length === 0 && destination.imageUrl) galleryPhotos.push(destination.imageUrl)

  return (
    <>
      <Header />
      <main className="flex-1">
        <DestinationHeroGallery
          photos={galleryPhotos}
          destinationName={destination.name}
          subtitle={`${destination.monthlySearches.toLocaleString('en-IN')}+ searches/month · ${hotels.length} hotels available`}
        />

        <DestinationClient hotels={hotels} amenities={amenities} destination={destination} search={search} />
      </main>
      <Footer />
    </>
  )
}
