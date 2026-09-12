// Sets each destination's cover image to its top-rated hotel's first
// cached photo, so destination cards show a real photo instead of the
// generic placeholder. Safe to re-run.
//
// Usage: node --env-file=.env.local scripts/set-destination-images.mjs

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

async function main() {
  const { data: destinations, error } = await supabase.from('destinations').select('id, name')
  if (error) throw error

  let updated = 0
  for (const dest of destinations) {
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('image_urls')
      .eq('destination_id', dest.id)
      .order('star_rating', { ascending: false })
      .limit(5)
    if (listingsError) { console.error(`! ${dest.name}:`, listingsError.message); continue }

    const withPhoto = listings.find(l => (l.image_urls ?? []).length > 0)
    const imageUrl = withPhoto?.image_urls?.[0]
    if (!imageUrl) { console.log(`- ${dest.name}: no hotel photo available`); continue }

    const { error: updateError } = await supabase.from('destinations').update({ image_url: imageUrl }).eq('id', dest.id)
    if (updateError) console.error(`! ${dest.name} update failed:`, updateError.message)
    else { updated++; console.log(`✓ ${dest.name}`) }
  }
  console.log(`\nDone. ${updated}/${destinations.length} destinations now have a real cover photo.`)
}

main().catch(err => { console.error(err); process.exit(1) })
