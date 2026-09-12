import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import DestinationClient from './DestinationClient'
import { DESTINATIONS, getDestinationBySlug, getHotelsByDestination } from '@/lib/data'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return DESTINATIONS.map(d => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const destination = getDestinationBySlug(slug)
  if (!destination) return { title: 'Destination Not Found' }
  return {
    title: `Hotels near ${destination.name} | Verified Reviews & Best Prices`,
    description: `Find hotels near ${destination.name} starting from budget to luxury. Compare prices, ratings and amenities on IndianHotels.co.`,
  }
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params
  const destination = getDestinationBySlug(slug)
  if (!destination) notFound()

  const hotels = getHotelsByDestination(destination.id)

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

        <DestinationClient hotels={hotels} />
      </main>
      <Footer />
    </>
  )
}
