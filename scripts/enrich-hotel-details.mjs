// Enriches every listing with real, verifiable Google Places data beyond
// what the initial seed captured: phone number, website, a short editorial
// description (when Google has one), real reviews, and a real parking
// signal. Explicitly does NOT add Pool/WiFi/Gym/Spa amenities or restaurant
// menus — Google Places has no reliable structured field for either, and
// that data would need a real hotel-specific source (e.g. a Booking.com/
// Agoda partner API) or manual curation to be honest.
//
// Safe to re-run: reviews are only fetched for listings that don't have any
// yet (avoids duplicating the ~1,900 already fetched); phone/website/
// description are just re-set each time, which is harmless.
//
// Usage: node --env-file=.env.local scripts/enrich-hotel-details.mjs

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY

if (!SUPABASE_URL || !SERVICE_KEY) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY')
if (!PLACES_KEY) throw new Error('Missing GOOGLE_PLACES_API_KEY')

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const FIELD_MASK = 'reviews,parkingOptions,nationalPhoneNumber,websiteUri,editorialSummary'
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

  const { data: listings, error } = await supabase
    .from('listings').select('id, name, google_place_id, destination_id').not('google_place_id', 'is', null)
  if (error) throw error

  const { data: alreadyReviewed, error: doneError } = await supabase.from('reviews').select('listing_id')
  if (doneError) throw doneError
  const reviewedIds = new Set(alreadyReviewed.map(r => r.listing_id))

  console.log(`Enriching ${listings.length} hotels (phone/website/description for all, reviews for the ${listings.length - reviewedIds.size} without any yet)...\n`)
  let reviewCount = 0, parkingCount = 0, contactCount = 0, failed = 0

  for (const listing of listings) {
    try {
      const details = await getPlaceDetails(listing.google_place_id)

      const needsReviews = !reviewedIds.has(listing.id)
      if (needsReviews) {
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
      }

      const hasParking = details.parkingOptions?.freeParkingLot || details.parkingOptions?.paidParkingLot
        || details.parkingOptions?.freeStreetParking || details.parkingOptions?.freeGarageParking || details.parkingOptions?.paidGarageParking
      if (hasParking) {
        const { error: linkError } = await supabase
          .from('listing_amenities')
          .upsert({ listing_id: listing.id, amenity_id: parkingAmenity.id }, { onConflict: 'listing_id,amenity_id' })
        if (!linkError) parkingCount++
      }

      const update = {}
      if (details.nationalPhoneNumber) update.phone = details.nationalPhoneNumber
      if (details.websiteUri) update.website = details.websiteUri
      if (details.editorialSummary?.text) update.description = details.editorialSummary.text
      if (Object.keys(update).length > 0) {
        const { error: updateError } = await supabase.from('listings').update(update).eq('id', listing.id)
        if (updateError) console.error(`  ! ${listing.name} contact-info update failed:`, updateError.message)
        else contactCount++
      }

      console.log(`✓ ${listing.name}${needsReviews ? ` (+${(details.reviews ?? []).length} reviews)` : ''}${hasParking ? ' [parking]' : ''}${update.website ? ' [website]' : ''}`)
    } catch (err) {
      failed++
      console.error(`! ${listing.name} failed:`, err.message)
    }
    await sleep(50)
  }

  console.log(`\nDone. ${reviewCount} new reviews, ${parkingCount} parking confirmations, ${contactCount} hotels got phone/website/description, ${failed} failures.`)
}

main().catch(err => { console.error(err); process.exit(1) })
