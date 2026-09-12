import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About IndianHotels.co',
  description: 'IndianHotels.co organises hotels by the tourist attractions they’re near, making it faster to find a well-located stay near India’s major destinations.',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
          <h1 className="text-navy font-bold text-3xl mb-4">About IndianHotels.co</h1>
          <p className="text-gray-600 text-[15px] leading-relaxed mb-4">
            IndianHotels.co organises hotels around the attractions travellers actually visit — the Taj Mahal, Goa&rsquo;s beaches, the Kerala backwaters, Jaipur&rsquo;s palaces, and the Varanasi ghats — rather than making you search a city map from scratch.
          </p>
          <p className="text-gray-600 text-[15px] leading-relaxed mb-4">
            Hotel listings are sourced from public data and updated periodically. Booking is handled by our booking partners; we don&rsquo;t process payments or reservations directly.
          </p>
          <p className="text-gray-600 text-[15px] leading-relaxed">
            Questions or spotted something wrong on a listing? <a href="/contact" className="text-navy font-semibold underline">Get in touch</a>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
