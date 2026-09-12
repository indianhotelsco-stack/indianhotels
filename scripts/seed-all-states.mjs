// Adds one flagship destination per remaining Indian state/UT (all 28 states
// covered; 7 of 8 union territories — Lakshadweep skipped due to very
// limited hotel inventory). Reuses the same Places API (New) + Supabase
// pattern as scripts/seed-hotels.mjs. Run this, then scripts/cache-images.mjs
// to move the new hotels' photos off Google onto Supabase Storage.
//
// Usage: node --env-file=.env.local scripts/seed-all-states.mjs

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY

if (!SUPABASE_URL || !SERVICE_KEY) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY')
if (!PLACES_KEY) throw new Error('Missing GOOGLE_PLACES_API_KEY')

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// destinations.slug/name are UNIQUE — safe to re-run, existing rows just upsert.
const DESTINATIONS = [
  { slug: 'tirupati', name: 'Tirupati', region: 'Andhra Pradesh', latitude: 13.6288, longitude: 79.4192, monthlySearches: 90000, description: 'One of the world’s most-visited pilgrimage sites, centred on the Sri Venkateswara Temple.', searchQuery: 'hotels near Tirupati temple Andhra Pradesh India' },
  { slug: 'tawang', name: 'Tawang', region: 'Arunachal Pradesh', latitude: 27.5859, longitude: 91.8594, monthlySearches: 18000, description: 'A high-altitude Himalayan town home to India’s largest Buddhist monastery.', searchQuery: 'hotels near Tawang monastery Arunachal Pradesh India' },
  { slug: 'kaziranga', name: 'Kaziranga National Park', region: 'Assam', latitude: 26.5775, longitude: 93.1714, monthlySearches: 40000, description: 'A UNESCO World Heritage wildlife reserve and the best place in the world to see the one-horned rhinoceros.', searchQuery: 'hotels near Kaziranga National Park Assam India' },
  { slug: 'bodh-gaya', name: 'Bodh Gaya', region: 'Bihar', latitude: 24.6959, longitude: 84.9915, monthlySearches: 33000, description: 'The site where the Buddha attained enlightenment, and one of Buddhism’s most sacred pilgrimage destinations.', searchQuery: 'hotels near Bodh Gaya Mahabodhi Temple Bihar India' },
  { slug: 'chitrakote-falls', name: 'Chitrakote Falls', region: 'Chhattisgarh', latitude: 19.1739, longitude: 81.6664, monthlySearches: 12000, description: 'Often called the "Niagara of India" — a wide, horseshoe-shaped waterfall on the Indravati River.', searchQuery: 'hotels near Chitrakote Falls Chhattisgarh India' },
  { slug: 'rann-of-kutch', name: 'Rann of Kutch', region: 'Gujarat', latitude: 23.8315, longitude: 69.8607, monthlySearches: 60000, description: 'A vast white salt desert, famous for the annual Rann Utsav festival and star-filled night skies.', searchQuery: 'hotels near Rann of Kutch Gujarat India' },
  { slug: 'kurukshetra', name: 'Kurukshetra', region: 'Haryana', latitude: 29.9695, longitude: 76.8783, monthlySearches: 22000, description: 'The historic and religious site associated with the Bhagavad Gita and the Mahabharata war.', searchQuery: 'hotels near Kurukshetra Haryana India' },
  { slug: 'manali', name: 'Manali', region: 'Himachal Pradesh', latitude: 32.2432, longitude: 77.1892, monthlySearches: 165000, description: 'A Himalayan hill station and gateway to trekking, adventure sports and mountain scenery.', searchQuery: 'hotels in Manali Himachal Pradesh India' },
  { slug: 'deoghar', name: 'Deoghar', region: 'Jharkhand', latitude: 24.4823, longitude: 86.6961, monthlySearches: 35000, description: 'Home to the Baidyanath Jyotirlinga, one of Hinduism’s twelve most sacred shrines.', searchQuery: 'hotels near Deoghar Baidyanath Temple Jharkhand India' },
  { slug: 'hampi', name: 'Hampi', region: 'Karnataka', latitude: 15.3350, longitude: 76.4600, monthlySearches: 75000, description: 'The UNESCO-listed ruins of the Vijayanagara Empire, spread across a dramatic boulder-strewn landscape.', searchQuery: 'hotels near Hampi Karnataka India' },
  { slug: 'khajuraho', name: 'Khajuraho', region: 'Madhya Pradesh', latitude: 24.8318, longitude: 79.9199, monthlySearches: 45000, description: 'A UNESCO World Heritage group of medieval temples famed for their intricate carved sculpture.', searchQuery: 'hotels near Khajuraho temples Madhya Pradesh India' },
  { slug: 'ajanta-ellora-caves', name: 'Ajanta & Ellora Caves', region: 'Maharashtra', latitude: 20.0269, longitude: 75.1780, monthlySearches: 55000, description: 'Two UNESCO World Heritage cave complexes with some of India’s finest rock-cut Buddhist, Hindu and Jain art.', searchQuery: 'hotels near Ellora Caves Aurangabad Maharashtra India' },
  { slug: 'loktak-lake', name: 'Loktak Lake', region: 'Manipur', latitude: 24.5300, longitude: 93.7800, monthlySearches: 9000, description: 'The largest freshwater lake in Northeast India, known for its floating phumdi islands.', searchQuery: 'hotels near Loktak Lake Manipur India' },
  { slug: 'shillong', name: 'Shillong', region: 'Meghalaya', latitude: 25.5788, longitude: 91.8933, monthlySearches: 50000, description: 'The "Scotland of the East" — a hill station surrounded by waterfalls, lakes and living root bridges.', searchQuery: 'hotels in Shillong Meghalaya India' },
  { slug: 'aizawl', name: 'Aizawl', region: 'Mizoram', latitude: 23.7271, longitude: 92.7176, monthlySearches: 8000, description: 'Mizoram’s hilltop capital, known for its distinctive ridge-top setting and Mizo culture.', searchQuery: 'hotels in Aizawl Mizoram India' },
  { slug: 'kohima', name: 'Kohima', region: 'Nagaland', latitude: 25.6751, longitude: 94.1086, monthlySearches: 14000, description: 'A WWII battle site and the gateway to Nagaland’s Hornbill Festival and tribal culture.', searchQuery: 'hotels in Kohima Nagaland India' },
  { slug: 'puri', name: 'Puri', region: 'Odisha', latitude: 19.8135, longitude: 85.8312, monthlySearches: 85000, description: 'Home to the Jagannath Temple and the annual Rath Yatra, alongside a long Bay of Bengal beach.', searchQuery: 'hotels near Puri Jagannath Temple Odisha India' },
  { slug: 'amritsar', name: 'Amritsar', region: 'Punjab', latitude: 31.6340, longitude: 74.8723, monthlySearches: 175000, description: 'Home to the Golden Temple, Sikhism’s holiest shrine, and the Wagah Border ceremony.', searchQuery: 'hotels near Golden Temple Amritsar Punjab India' },
  { slug: 'gangtok', name: 'Gangtok', region: 'Sikkim', latitude: 27.3389, longitude: 88.6065, monthlySearches: 70000, description: 'Sikkim’s capital, set in the Himalayan foothills with views towards Kangchenjunga.', searchQuery: 'hotels in Gangtok Sikkim India' },
  { slug: 'madurai', name: 'Madurai', region: 'Tamil Nadu', latitude: 9.9252, longitude: 78.1198, monthlySearches: 60000, description: 'One of India’s oldest continuously inhabited cities, centred on the towering Meenakshi Amman Temple.', searchQuery: 'hotels near Meenakshi Temple Madurai Tamil Nadu India' },
  { slug: 'hyderabad', name: 'Hyderabad', region: 'Telangana', latitude: 17.3850, longitude: 78.4867, monthlySearches: 140000, description: 'A city of historic Deccan architecture — Charminar, Golconda Fort — and modern tech hubs.', searchQuery: 'hotels near Charminar Hyderabad Telangana India' },
  { slug: 'agartala', name: 'Agartala', region: 'Tripura', latitude: 23.8315, longitude: 91.2868, monthlySearches: 11000, description: 'Tripura’s capital, known for the ornate Ujjayanta Palace and nearby Neermahal water palace.', searchQuery: 'hotels in Agartala Tripura India' },
  { slug: 'rishikesh', name: 'Rishikesh', region: 'Uttarakhand', latitude: 30.0869, longitude: 78.2676, monthlySearches: 120000, description: 'The self-proclaimed "Yoga Capital of the World," on the Ganges at the foot of the Himalayas.', searchQuery: 'hotels in Rishikesh Uttarakhand India' },
  { slug: 'darjeeling', name: 'Darjeeling', region: 'West Bengal', latitude: 27.0410, longitude: 88.2663, monthlySearches: 95000, description: 'A Himalayan hill station famous for its tea gardens and views of Kangchenjunga.', searchQuery: 'hotels in Darjeeling West Bengal India' },
  { slug: 'havelock-island', name: 'Havelock Island', region: 'Andaman and Nicobar Islands', latitude: 12.0117, longitude: 92.9871, monthlySearches: 55000, description: 'Home to Radhanagar Beach and some of India’s clearest waters for diving and snorkelling.', searchQuery: 'hotels on Havelock Island Andaman India' },
  { slug: 'chandigarh', name: 'Chandigarh', region: 'Chandigarh', latitude: 30.7333, longitude: 76.7794, monthlySearches: 65000, description: 'India’s first planned city, known for its modernist architecture, Rock Garden and Sukhna Lake.', searchQuery: 'hotels in Chandigarh India' },
  { slug: 'diu', name: 'Diu', region: 'Dadra and Nagar Haveli and Daman and Diu', latitude: 20.7144, longitude: 70.9822, monthlySearches: 20000, description: 'A former Portuguese colony with a fort, beaches and a distinct laid-back character.', searchQuery: 'hotels in Diu India' },
  { slug: 'delhi', name: 'Delhi', region: 'Delhi', latitude: 28.6139, longitude: 77.2090, monthlySearches: 250000, description: 'India’s capital — Mughal-era monuments, colonial New Delhi, and one of the country’s busiest gateway cities.', searchQuery: 'hotels in New Delhi India' },
  { slug: 'srinagar', name: 'Srinagar', region: 'Jammu and Kashmir', latitude: 34.0837, longitude: 74.7973, monthlySearches: 130000, description: 'Kashmir’s summer capital, famed for Dal Lake, houseboats and Mughal gardens.', searchQuery: 'hotels near Dal Lake Srinagar Kashmir India' },
  { slug: 'leh', name: 'Leh', region: 'Ladakh', latitude: 34.1526, longitude: 77.5771, monthlySearches: 110000, description: 'A high-altitude desert town surrounded by Himalayan peaks, monasteries and mountain passes.', searchQuery: 'hotels in Leh Ladakh India' },
  { slug: 'puducherry', name: 'Puducherry', region: 'Puducherry', latitude: 11.9416, longitude: 79.8083, monthlySearches: 48000, description: 'A former French colonial territory on the Bay of Bengal, known for its promenade and old quarter.', searchQuery: 'hotels in Puducherry India' },
]

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

const HOTELS_PER_DESTINATION = 20

async function textSearch(query) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': PLACES_KEY, 'X-Goog-FieldMask': FIELD_MASK },
    body: JSON.stringify({ textQuery: query }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`Places API error for "${query}": ${json.error?.message ?? res.statusText}`)
  return json.places ?? []
}

function photoUrl(photoName, maxWidthPx = 1200) {
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidthPx}&key=${PLACES_KEY}`
}

async function upsertDestination(dest) {
  const { data, error } = await supabase
    .from('destinations')
    .upsert(
      { name: dest.name, slug: dest.slug, description: dest.description, latitude: dest.latitude, longitude: dest.longitude, monthly_searches: dest.monthlySearches, region: dest.region },
      { onConflict: 'slug' }
    )
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

async function main() {
  console.log(`Seeding ${DESTINATIONS.length} destinations (one per remaining state/UT)...\n`)
  let totalHotels = 0

  for (const dest of DESTINATIONS) {
    try {
      const destinationId = await upsertDestination(dest)
      const places = await textSearch(dest.searchQuery)
      console.log(`${dest.name} (${dest.region}): ${places.length} places found`)

      for (const place of places.slice(0, HOTELS_PER_DESTINATION)) {
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
        if (error) console.error(`  ! failed to upsert ${name}:`, error.message)
        else totalHotels++
      }
    } catch (err) {
      console.error(`! ${dest.name} failed:`, err.message)
    }
  }

  console.log(`\nDone. ${totalHotels} real hotels upserted across ${DESTINATIONS.length} new destinations.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
