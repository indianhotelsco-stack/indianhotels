import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAllBlogPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'India Travel Guides — Destinations, Itineraries & Tips',
  description: 'Practical travel guides for India — when to visit, how many days you need, and what to expect at the Taj Mahal, Goa, Kerala, Jaipur and Varanasi.',
  alternates: { canonical: 'https://www.indianhotels.co/blog' },
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts()

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
            <h1 className="text-navy font-bold text-[28px] sm:text-[38px] leading-tight mb-2">Travel Guides</h1>
            <p className="text-gray-600 text-base max-w-xl">
              Practical, no-filler guides for planning a trip to India — timing, itineraries, and what to actually expect.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {posts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="card card-hover block">
                  <div className="text-xs text-gray-500 mb-2">{post.date} · {post.readMins} min read</div>
                  <h2 className="text-lg font-bold text-navy mb-2 leading-snug">{post.title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{post.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
