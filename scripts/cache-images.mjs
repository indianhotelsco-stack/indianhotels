// Downloads each listing's Google Places photos and re-uploads them to
// Supabase Storage, then rewrites image_urls to point at Supabase instead
// of Google. After this runs, hotel photos no longer depend on the
// Google Places API being available or under quota.
//
// Usage: node --env-file=.env.local scripts/cache-images.mjs

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const BUCKET = 'hotel-photos'

if (!SUPABASE_URL || !SERVICE_KEY) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY')

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function cacheOneImage(listingId, googleUrl, index) {
  const res = await fetch(googleUrl)
  if (!res.ok) throw new Error(`fetch failed (${res.status}) for ${googleUrl}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const path = `${listingId}/${index}.jpg`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: 'image/jpeg', upsert: true })
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

async function main() {
  const { data: listings, error } = await supabase
    .from('listings')
    .select('id, name, image_urls')
    .not('image_urls', 'is', null)
  if (error) throw error

  const toProcess = listings.filter(l => (l.image_urls ?? []).some(u => u.includes('googleapis.com')))
  console.log(`Caching images for ${toProcess.length} listings...\n`)

  let done = 0
  for (const listing of toProcess) {
    const newUrls = []
    for (let i = 0; i < listing.image_urls.length; i++) {
      const url = listing.image_urls[i]
      if (!url.includes('googleapis.com')) { newUrls.push(url); continue }
      try {
        const cachedUrl = await cacheOneImage(listing.id, url, i)
        newUrls.push(cachedUrl)
      } catch (err) {
        console.error(`  ! ${listing.name} photo ${i}:`, err.message)
      }
    }
    const { error: updateError } = await supabase.from('listings').update({ image_urls: newUrls }).eq('id', listing.id)
    if (updateError) {
      console.error(`  ! failed to update ${listing.name}:`, updateError.message)
    } else {
      done++
      console.log(`  ✓ ${listing.name} (${newUrls.length} photos cached)`)
    }
  }

  console.log(`\nDone. ${done}/${toProcess.length} listings now serve photos from Supabase Storage, not Google.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
