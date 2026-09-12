// Fetches real Google reviews (and a real, verifiable parking signal) for
// every listing that has a google_place_id, via Places API (New) Place
// Details. Deliberately does NOT fabricate Pool/WiFi/Gym/Spa amenities —
// Google Places has no reliable per-hotel field for those, and inventing
// them would mean making false claims about real, named businesses.
// Parking is the one amenity Google's API genuinely reports per-place.
//
// Usage: node --env-file=.env.local scripts/fetch-reviews-and-parking.mjs

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY

if (!SUPABASE_URL || !SERVICE_KEY) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY')
if (!PLACES_KEY) throw new Error('Missing GOOGLE_PLACES_API_KEY')

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const FIELD_MASK = 'reviews,parkingOptions'
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function getPlaceDetails(placeId) {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: { 'X-Goog-Api-Key': PLACES_KEY, 'X-Goog-FieldMask': FIELD_MASK },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error?.message ?? res.statusText)
  return json
}

async function main() {
  const { data: parkingAmenity, error: amenityError } = await supabase
    .from('amenities').select('id').eq('name', 'Parking').single()
  if (amenityError) throw amenityError

  const { data: allListings, error } = await supabase
    .from('listings').select('id, name, google_place_id').not('google_place_id', 'is', null)
  if (error) throw error

  // Skip listings that already have reviews — safe to re-run after adding
  // new hotels without re-fetching (and duplicating) everything already done.
  const { data: alreadyDone, error: doneError } = await supabase.from('reviews').select('listing_id')
  if (doneError) throw doneError
  const doneIds = new Set(alreadyDone.map(r => r.listing_id))
  const listings = allListings.filter(l => !doneIds.has(l.id))

  console.log(`Fetching reviews + parking status for ${listings.length} hotels (${allListings.length - listings.length} already done, skipped)...\n`)
  let reviewCount = 0, parkingCount = 0, failed = 0

  for (const listing of listings) {
    try {
      const details = await getPlaceDetails(listing.google_place_id)

      const reviews = (details.reviews ?? []).map(r => ({
        listing_id: listing.id,
        reviewer_name: r.authorAttribution?.displayName ?? 'Google user',
        reviewer_country: null,
        rating: r.rating ?? null,
        review_text: r.text?.text ?? r.originalText?.text ?? null,
        date_posted: r.publishTime ?? null,
        source: 'google_places',
      })).filter(r => r.rating != null)

      if (reviews.length > 0) {
        const { error: insertError } = await supabase.from('reviews').insert(reviews)
        if (insertError) console.error(`  ! ${listing.name} review insert failed:`, insertError.message)
        else reviewCount += reviews.length
      }

      const hasParking = details.parkingOptions?.freeParkingLot || details.parkingOptions?.paidParkingLot
        || details.parkingOptions?.freeStreetParking || details.parkingOptions?.freeGarageParking || details.parkingOptions?.paidGarageParking
      if (hasParking) {
        const { error: linkError } = await supabase
          .from('listing_amenities')
          .upsert({ listing_id: listing.id, amenity_id: parkingAmenity.id }, { onConflict: 'listing_id,amenity_id' })
        if (linkError) console.error(`  ! ${listing.name} parking link failed:`, linkError.message)
        else parkingCount++
      }

      console.log(`✓ ${listing.name}: ${reviews.length} reviews${hasParking ? ', has parking' : ''}`)
    } catch (err) {
      failed++
      console.error(`! ${listing.name} failed:`, err.message)
    }
    await sleep(50) // gentle pacing across ~385 sequential calls
  }

  console.log(`\nDone. ${reviewCount} real reviews added, ${parkingCount} hotels confirmed with parking, ${failed} failures.`)
}

main().catch(err => { console.error(err); process.exit(1) })
