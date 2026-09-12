import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'
import DestinationCard from '@/components/DestinationCard'
import HotelCard from '@/components/HotelCard'
import { getAllDestinations, getFeaturedHotels } from '@/lib/data'
import { countStatesAndUTs } from '@/lib/india-zones'

const WHY_CARDS = [
  { title: 'Best Prices', desc: 'Compare rates across trusted booking partners to find the best price for every stay.' },
  { title: 'Expert Curation', desc: 'Every hotel is organised by the attraction it’s near, so you spend less time searching.' },
  { title: 'Easy Booking', desc: 'One click takes you straight to a trusted partner to complete your booking securely.' },
]

export default async function Home() {
  const [destinations, featured] = await Promise.all([getAllDestinations(), getFeaturedHotels(4)])
  const { states, unionTerritories } = countStatesAndUTs(destinations.map(d => d.region))

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <section
          className="text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)' }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(circle at 80% 20%, #D4AF37, transparent 55%)' }}
          />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 relative">
            <span className="inline-block text-xs font-bold tracking-wide uppercase text-gold bg-white/10 px-3 py-1 rounded-full mb-4">
              {destinations.length} destinations · {states} states · {unionTerritories} union territories
            </span>
            <h1 className="font-bold text-[34px] sm:text-[48px] leading-tight mb-3 max-w-2xl">
              Stay at India&rsquo;s <span className="text-gold">Best Hotels</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-xl">
              Discover premium accommodations at verified prices, organised by the attractions you&rsquo;re visiting.
            </p>
            <SearchBar destinations={destinations} />
          </div>
        </section>

        {/* TOP DESTINATIONS */}
        <section id="destinations" className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h2 className="text-2xl font-bold text-navy">Top Destinations</h2>
              <Link href="/destinations" className="text-sm font-semibold text-navy hover:underline">
                View all {destinations.length} destinations →
              </Link>
            </div>
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
              {destinations.slice(0, 12).map(d => <DestinationCard key={d.id} destination={d} />)}
            </div>
          </div>
        </section>

        {/* WHY INDIANHOTELS */}
        <section className="py-14 bg-gray-50 border-y border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-navy mb-6 text-center">Why IndianHotels?</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {WHY_CARDS.map(c => (
                <div key={c.title} className="card text-center">
                  <h3 className="text-lg font-bold text-navy mb-2">{c.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED HOTELS */}
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-navy mb-6">Featured Hotels</h2>
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {featured.map(h => <HotelCard key={h.id} hotel={h} />)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
