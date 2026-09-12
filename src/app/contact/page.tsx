import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Contact IndianHotels.co',
  description: 'Get in touch with IndianHotels.co.',
}

// TODO: replace with a real contact email/form before launch.
const CONTACT_EMAIL = 'hello@indianhotels.co'

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
          <h1 className="text-navy font-bold text-3xl mb-4">Contact Us</h1>
          <p className="text-gray-600 text-[15px] leading-relaxed mb-6">
            Spotted an outdated listing, a broken link, or have a question? Email us and we&rsquo;ll get back to you.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-primary">
            {CONTACT_EMAIL}
          </a>
        </div>
      </main>
      <Footer />
    </>
  )
}
