import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAllBlogPosts, getBlogPost, renderBlogMarkdown } from '@/lib/blog'
import { getDestinationBySlug } from '@/lib/data'

type Props = { params: Promise<{ slug: string }> }

const BASE_URL = 'https://www.indianhotels.co'

export function generateStaticParams() {
  return getAllBlogPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: 'Article Not Found' }
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `${BASE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${BASE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.dateISO,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const html = renderBlogMarkdown(post.content)
  const destination = post.destinationSlug ? await getDestinationBySlug(post.destinationSlug) : undefined

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <Link href="/blog" className="text-navy text-sm hover:underline">← All guides</Link>
          <h1 className="text-navy font-bold text-[28px] sm:text-[36px] leading-tight mt-4 mb-2">{post.title}</h1>
          <div className="text-sm text-gray-500 mb-8">{post.date} · {post.readMins} min read</div>

          <div
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {destination && (
            <div className="mt-10 bg-navy rounded-lg p-6 text-center">
              <p className="text-white font-bold text-lg mb-1">Planning a stay near {destination.name}?</p>
              <p className="text-gray-300 text-sm mb-4">Browse real, rated hotels with photos and prices.</p>
              <Link href={`/destination/${destination.slug}`} className="btn btn-accent">
                View hotels near {destination.name} →
              </Link>
            </div>
          )}
        </article>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.description,
            datePublished: post.dateISO,
            author: { '@type': 'Organization', name: 'IndianHotels.co' },
            publisher: { '@type': 'Organization', name: 'IndianHotels.co' },
            mainEntityOfPage: `${BASE_URL}/blog/${post.slug}`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
              { '@type': 'ListItem', position: 2, name: 'Travel Guides', item: `${BASE_URL}/blog` },
              { '@type': 'ListItem', position: 3, name: post.title, item: `${BASE_URL}/blog/${post.slug}` },
            ],
          }),
        }}
      />

      <style>{`
        .blog-prose h2 { font-family: inherit; font-size: 22px; font-weight: 700; color: #0F172A; margin: 32px 0 12px; }
        .blog-prose h3 { font-size: 18px; font-weight: 700; color: #0F172A; margin: 24px 0 8px; }
        .blog-prose p { font-size: 15px; line-height: 1.75; color: #374151; margin: 0 0 16px; }
        .blog-prose ul { margin: 0 0 16px; padding-left: 20px; }
        .blog-prose li { font-size: 15px; line-height: 1.7; color: #374151; margin-bottom: 6px; }
        .blog-prose strong { color: #0F172A; }
        .blog-prose a { color: #0F172A; font-weight: 600; text-decoration: underline; }
      `}</style>
    </>
  )
}
