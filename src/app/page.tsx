import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'
import DestinationCard from '@/components/DestinationCard'
import HotelCard from '@/components/HotelCard'
import { DESTINATIONS, HOTELS } from '@/lib/data'

const WHY_CARDS = [
  { title: 'Best Prices', desc: 'Compare rates across trusted booking partners to find the best price for every stay.' },
  { title: 'Expert Curation', desc: 'Every hotel is organised by the attraction it’s near, so you spend less time searching.' },
  { title: 'Easy Booking', desc: 'One click takes you straight to a trusted partner to complete your booking securely.' },
]

export default function Home() {
  const featured = HOTELS.filter(h => h.isFeatured).slice(0, 4)

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
            <h1 className="text-navy font-bold text-[32px] sm:text-[42px] leading-tight mb-3">
              Stay at India&rsquo;s Best Hotels
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-xl">
              Discover premium accommodations at verified prices, organised by the attractions you&rsquo;re visiting.
            </p>
            <SearchBar />
          </div>
        </section>

        {/* TOP DESTINATIONS */}
        <section id="destinations" className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-navy mb-6">Top Destinations</h2>
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
              {DESTINATIONS.map(d => <DestinationCard key={d.id} destination={d} />)}
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
