import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DestinationCard from '@/components/DestinationCard'
import { getAllDestinations } from '@/lib/data'

export const metadata: Metadata = {
  title: 'All Destinations — Hotels Across India',
  description: 'Browse hotels across every Indian state and union territory, organised by the attraction or region tourists actually visit.',
  alternates: { canonical: 'https://www.indianhotels.co/destinations' },
}

export default async function AllDestinationsPage() {
  const destinations = await getAllDestinations()

  // Group by region (state/UT) so the page reads as genuine full-country
  // coverage rather than one long undifferentiated grid.
  const byRegion = new Map<string, typeof destinations>()
  for (const d of destinations) {
    const list = byRegion.get(d.region) ?? []
    list.push(d)
    byRegion.set(d.region, list)
  }
  const regions = [...byRegion.keys()].sort()

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
            <h1 className="text-navy font-bold text-[28px] sm:text-[38px] leading-tight mb-2">All Destinations</h1>
            <p className="text-gray-600 text-base max-w-xl">
              {destinations.length} destinations across {regions.length} states and union territories.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col gap-10">
            {regions.map(region => (
              <div key={region}>
                <h2 className="text-lg font-bold text-navy mb-4">{region}</h2>
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                  {byRegion.get(region)!.map(d => <DestinationCard key={d.id} destination={d} />)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
