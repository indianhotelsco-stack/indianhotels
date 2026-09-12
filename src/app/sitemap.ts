import type { MetadataRoute } from 'next'
import { getAllDestinations, getAllHotelIds } from '@/lib/data'
import { getAllBlogPosts } from '@/lib/blog'

const BASE_URL = 'https://www.indianhotels.co'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, hotelIds] = await Promise.all([getAllDestinations(), getAllHotelIds()])
  const posts = getAllBlogPosts()

  return [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    ...destinations.map(d => ({
      url: `${BASE_URL}/destination/${d.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...posts.map(p => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...hotelIds.map(id => ({
      url: `${BASE_URL}/hotel/${id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}
