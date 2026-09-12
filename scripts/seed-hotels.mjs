// Fetches real hotels (name, rating, address, photos) from the Places API
// (New) for each destination and writes them into Supabase.
//
// IMPORTANT — pricing: Google Places does NOT provide live per-night rates.
// price_per_night below is an ESTIMATE derived from Google's priceLevel
// enum, not a real booking price. rating_text on each listing makes this
// explicit to anyone reading the raw data.
//
// Usage: node --env-file=.env.local scripts/seed-hotels.mjs

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY

if (!SUPABASE_URL || !SERVICE_KEY) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY')
if (!PLACES_KEY) throw new Error('Missing GOOGLE_PLACES_API_KEY')

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

const DESTINATIONS = [
  { slug: 'taj-mahal', name: 'Taj Mahal', description: 'Experience the majesty of the world’s most iconic monument, with hotels ranging from heritage palaces to riverside boutique stays, many offering direct views of the Taj.', latitude: 27.1751, longitude: 78.0421, monthlySearches: 201000, region: 'Uttar Pradesh', searchQuery: 'hotels near Taj Mahal Agra India' },
  { slug: 'goa-beaches', name: 'Goa Beaches', description: 'From lively North Goa beach shacks to quiet South Goa resorts, find beachfront stays for every kind of traveller along India’s most famous coastline.', latitude: 15.2993, longitude: 74.1240, monthlySearches: 234000, region: 'Goa', searchQuery: 'hotels in Goa India' },
  { slug: 'kerala-backwaters', name: 'Kerala Backwaters', description: 'Houseboats, backwater resorts and Ayurvedic retreats along Alleppey and Kumarakom’s famous canals — India’s most tranquil escape.', latitude: 9.4981, longitude: 76.3388, monthlySearches: 145000, region: 'Kerala', searchQuery: 'hotels near Alleppey backwaters Kerala India' },
  { slug: 'jaipur-palace', name: 'Jaipur Palace', description: 'Stay in restored havelis and heritage palaces in the Pink City, walking distance from Hawa Mahal, Amber Fort and the City Palace.', latitude: 26.9124, longitude: 75.7873, monthlySearches: 67000, region: 'Rajasthan', searchQuery: 'hotels near City Palace Jaipur India' },
  { slug: 'varanasi-ghats', name: 'Varanasi Ghats', description: 'Riverside hotels and heritage stays along the ghats of the Ganges, close to the evening Ganga Aarti ceremony.', latitude: 25.3176, longitude: 82.9739, monthlySearches: 89000, region: 'Uttar Pradesh', searchQuery: 'hotels near Dashashwamedh Ghat Varanasi India' },
]

// Rough INR/night estimate bands by Places API (New) priceLevel enum. Not a real rate.
const PRICE_ESTIMATE_BY_LEVEL = {
  PRICE_LEVEL_FREE: 1500,
  PRICE_LEVEL_INEXPENSIVE: 3000,
  PRICE_LEVEL_MODERATE: 8000,
  PRICE_LEVEL_EXPENSIVE: 18000,
  PRICE_LEVEL_VERY_EXPENSIVE: 32000,
  PRICE_LEVEL_UNSPECIFIED: 8000,
}

const FIELD_MASK = [
  'places.id', 'places.displayName', 'places.formattedAddress', 'places.location',
  'places.rating', 'places.userRatingCount', 'places.priceLevel', 'places.photos',
].join(',')

async function textSearch(query) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': PLACES_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({ textQuery: query }),
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(`Places API error for "${query}": ${json.error?.message ?? res.statusText}`)
  }
  return json.places ?? []
}

function photoUrl(photoName, maxWidthPx = 1200) {
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidthPx}&key=${PLACES_KEY}`
}

async function upsertDestination(dest) {
  const { data, error } = await supabase
    .from('destinations')
    .upsert(
      {
        name: dest.name, slug: dest.slug, description: dest.description,
        latitude: dest.latitude, longitude: dest.longitude,
        monthly_searches: dest.monthlySearches, region: dest.region,
      },
      { onConflict: 'slug' }
    )
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

async function main() {
  console.log(`Seeding ${DESTINATIONS.length} destinations from Places API (New)...\n`)
  let totalHotels = 0

  for (const dest of DESTINATIONS) {
    const destinationId = await upsertDestination(dest)
    console.log(`${dest.name}: destination row ready (${destinationId})`)

    const places = await textSearch(dest.searchQuery)
    console.log(`  found ${places.length} places from Google`)

    for (const place of places.slice(0, 20)) {
      const imageUrls = (place.photos ?? []).slice(0, 5).map(p => photoUrl(p.name))
      const priceLevel = place.priceLevel ?? 'PRICE_LEVEL_UNSPECIFIED'
      const estimatedPrice = PRICE_ESTIMATE_BY_LEVEL[priceLevel] ?? PRICE_ESTIMATE_BY_LEVEL.PRICE_LEVEL_UNSPECIFIED
      const name = place.displayName?.text ?? 'Unnamed Hotel'

      const { error } = await supabase.from('listings').upsert(
        {
          destination_id: destinationId,
          name,
          description: `${name} is located near ${dest.name}. Rated ${place.rating ?? 'N/A'} from ${place.userRatingCount ?? 0} Google reviews.`,
          price_per_night: estimatedPrice,
          star_rating: place.rating ?? 0,
          review_count: place.userRatingCount ?? 0,
          rating_text: 'Price is an estimate based on Google’s price level for this listing, not a live booking rate.',
          image_urls: imageUrls,
          google_place_id: place.id,
          address: place.formattedAddress ?? null,
          latitude: place.location?.latitude ?? null,
          longitude: place.location?.longitude ?? null,
          is_featured: (place.rating ?? 0) >= 4.6,
        },
        { onConflict: 'google_place_id' }
      )
      if (error) {
        console.error(`  ! failed to upsert ${name}:`, error.message)
      } else {
        totalHotels++
      }
    }
  }

  console.log(`\nDone. ${totalHotels} real hotels upserted across ${DESTINATIONS.length} destinations.`)
  console.log('Reminder: prices are estimates (Google priceLevel), not live booking rates.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
