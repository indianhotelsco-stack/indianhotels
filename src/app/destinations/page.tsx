import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DestinationCard from '@/components/DestinationCard'
import { getAllDestinations } from '@/lib/data'
import { ZONES, zoneForRegion, countStatesAndUTs } from '@/lib/india-zones'

export const metadata: Metadata = {
  title: 'All Destinations — Hotels Across India',
  description: 'Browse hotels across every Indian state and union territory, organised by region.',
  alternates: { canonical: 'https://www.indianhotels.co/destinations' },
}

export default async function AllDestinationsPage() {
  const destinations = await getAllDestinations()

  const byZone = new Map<string, typeof destinations>()
  for (const d of destinations) {
    const zoneId = zoneForRegion(d.region)
    const list = byZone.get(zoneId) ?? []
    list.push(d)
    byZone.set(zoneId, list)
  }
  const activeZones = ZONES.filter(z => byZone.has(z.id))
  const { states, unionTerritories } = countStatesAndUTs(destinations.map(d => d.region))

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section
          className="border-b border-gray-200 text-white"
          style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)' }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 text-center">
            <h1 className="font-bold text-[30px] sm:text-[42px] leading-tight mb-3">
              Every Corner of India, <span className="text-gold">One Place to Stay</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto">
              {destinations.length} destinations across {states} states and {unionTerritories} union territories — from Himalayan passes to southern backwaters.
            </p>
          </div>
        </section>

        {/* Quick-nav menu */}
        <nav className="sticky top-16 z-40 bg-white border-b border-gray-200 overflow-x-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex gap-2 whitespace-nowrap">
            {activeZones.map(zone => (
              <a
                key={zone.id}
                href={`#${zone.id}`}
                className="text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:border-navy hover:text-navy transition-colors"
              >
                {zone.label}
              </a>
            ))}
          </div>
        </nav>

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col gap-14">
            {activeZones.map(zone => (
              <div key={zone.id} id={zone.id} className="scroll-mt-32">
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-navy">{zone.label}</h2>
                  <p className="text-sm text-gray-600 mt-1">{zone.blurb}</p>
                </div>
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                  {byZone.get(zone.id)!.map(d => <DestinationCard key={d.id} destination={d} />)}
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
