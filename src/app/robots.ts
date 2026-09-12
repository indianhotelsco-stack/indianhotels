import type { MetadataRoute } from 'next'

// Blocks crawling until NEXT_PUBLIC_ALLOW_INDEXING=true is set (intended for
// the production custom-domain deploy only). Without this, Google could index
// the temporary *.netlify.app URL and treat it as duplicate/competing content
// once the real domain goes live.
const indexingAllowed = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'

export default function robots(): MetadataRoute.Robots {
  if (!indexingAllowed) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://www.indianhotels.co/sitemap.xml',
  }
}
