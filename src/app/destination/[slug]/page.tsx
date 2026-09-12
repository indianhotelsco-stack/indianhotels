import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import DestinationClient from './DestinationClient'
import { getAllAmenities, getAllDestinations, getDestinationBySlug, getHotelsByDestination } from '@/lib/data'
import { haversineKm } from '@/lib/geo'

type Props = { params: Promise<{ slug: string }> }

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

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params
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

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="relative">
          <ImagePlaceholder height={220} label={destination.name} />
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6 sm:p-10">
            <h1 className="text-white text-2xl sm:text-4xl font-bold">Hotels near {destination.name}</h1>
            <p className="text-white/85 text-sm mt-1">
              {destination.monthlySearches.toLocaleString('en-IN')}+ searches/month · {hotels.length} hotels available
            </p>
          </div>
        </div>

        <DestinationClient hotels={hotels} amenities={amenities} destination={destination} />
      </main>
      <Footer />
    </>
  )
}
