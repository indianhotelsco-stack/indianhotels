// SEED / PLACEHOLDER DATA
// ------------------------------------------------------------------
// Destinations use real places (they're just geographic references).
// Hotel listings, prices, ratings, reviews and images below are all
// fictional placeholder content generated for development — NOT real
// businesses, real prices, or real guest reviews. Per the project spec,
// this is meant to be replaced before launch with:
//   - real listings sourced from the Booking.com / Agoda / MakeMyTrip
//     affiliate APIs (including their real affiliate links)
//   - real photos (Cloudinary or the source API)
//   - real aggregated reviews from those platforms
// Do not treat any hotel name, price, rating or review text below as
// real — they exist only to make the UI functional during development.
// ------------------------------------------------------------------

import type { Amenity, Destination, Hotel, Review } from './types'

export const AMENITIES: Amenity[] = [
  { id: 'pool', name: 'Pool', icon: '🏊' },
  { id: 'wifi', name: 'WiFi', icon: '📶' },
  { id: 'spa', name: 'Spa', icon: '💆' },
  { id: 'parking', name: 'Parking', icon: '🅿️' },
  { id: 'ac', name: 'AC', icon: '❄️' },
  { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
  { id: 'gym', name: 'Gym', icon: '💪' },
  { id: 'elevator', name: 'Elevator', icon: '🛗' },
]

export const DESTINATIONS: Destination[] = [
  {
    id: 'taj-mahal', slug: 'taj-mahal', name: 'Taj Mahal',
    description: 'Experience the majesty of the world’s most iconic monument, with hotels ranging from heritage palaces to riverside boutique stays, many offering direct views of the Taj.',
    imageUrl: null, latitude: 27.1751, longitude: 78.0421, monthlySearches: 201000, region: 'Uttar Pradesh',
  },
  {
    id: 'goa-beaches', slug: 'goa-beaches', name: 'Goa Beaches',
    description: 'From lively North Goa beach shacks to quiet South Goa resorts, find beachfront stays for every kind of traveller along India’s most famous coastline.',
    imageUrl: null, latitude: 15.2993, longitude: 74.1240, monthlySearches: 234000, region: 'Goa',
  },
  {
    id: 'kerala-backwaters', slug: 'kerala-backwaters', name: 'Kerala Backwaters',
    description: 'Houseboats, backwater resorts and Ayurvedic retreats along Alleppey and Kumarakom’s famous canals — India’s most tranquil escape.',
    imageUrl: null, latitude: 9.4981, longitude: 76.3388, monthlySearches: 145000, region: 'Kerala',
  },
  {
    id: 'jaipur-palace', slug: 'jaipur-palace', name: 'Jaipur Palace',
    description: 'Stay in restored havelis and heritage palaces in the Pink City, walking distance from Hawa Mahal, Amber Fort and the City Palace.',
    imageUrl: null, latitude: 26.9124, longitude: 75.7873, monthlySearches: 67000, region: 'Rajasthan',
  },
  {
    id: 'varanasi-ghats', slug: 'varanasi-ghats', name: 'Varanasi Ghats',
    description: 'Riverside hotels and heritage stays along the ghats of the Ganges, close to the evening Ganga Aarti ceremony.',
    imageUrl: null, latitude: 25.3176, longitude: 82.9739, monthlySearches: 89000, region: 'Uttar Pradesh',
  },
]

const HOTEL_NAME_TEMPLATES = [
  '{region} Heritage Palace', 'The {region} Grand', '{region} Riverside Retreat',
  'Royal {region} Resort & Spa', '{region} Boutique Stay', 'The {region} Residency',
  '{region} Garden View Hotel', '{region} Comfort Inn', 'The {region} Courtyard',
  'Serenity {region}', '{region} Lakeview Suites', '{region} Budget Stays',
]

const REVIEW_COUNTRIES = ['United Kingdom', 'United States', 'Australia', 'Germany', 'France', 'Canada', 'Singapore', 'UAE']
const SAMPLE_REVIEW_LINES = [
  'Excellent location and very clean rooms. Staff were helpful throughout our stay.',
  'Good value for the price. Breakfast could be improved but overall a solid stay.',
  'Beautiful property, exactly as pictured. Would recommend for the location alone.',
  'Comfortable beds and quiet at night. Easy walk to the main attraction.',
  'Friendly staff, quick check-in. Pool area was a nice bonus after a long day out.',
]

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function buildHotelsForDestination(dest: Destination, count: number): Hotel[] {
  const rand = seededRandom(dest.name.length * 7919)
  const hotels: Hotel[] = []
  for (let i = 0; i < count; i++) {
    const template = HOTEL_NAME_TEMPLATES[i % HOTEL_NAME_TEMPLATES.length]
    const name = template.replace('{region}', dest.name.split(' ')[0])
    const priceTier = rand()
    const pricePerNight = Math.round((2000 + priceTier * 30000) / 100) * 100
    const starRating = Math.round((3 + priceTier * 2) * 10) / 10
    const reviewCount = Math.round(20 + rand() * 400)
    const amenityCount = 3 + Math.floor(rand() * 4)
    const shuffledAmenities = [...AMENITIES].sort(() => rand() - 0.5).slice(0, amenityCount).map(a => a.id)
    hotels.push({
      id: `${dest.slug}-hotel-${i + 1}`,
      destinationId: dest.id,
      name,
      description: `A ${starRating >= 4.5 ? 'premium' : starRating >= 4 ? 'comfortable' : 'budget-friendly'} stay near ${dest.name}, offering ${shuffledAmenities.length} amenities and easy access to the main attraction.`,
      pricePerNight,
      starRating,
      reviewCount,
      imageUrls: [],
      amenityIds: shuffledAmenities,
      address: `Near ${dest.name}, ${dest.region}`,
      latitude: dest.latitude + (rand() - 0.5) * 0.05,
      longitude: dest.longitude + (rand() - 0.5) * 0.05,
      distanceFromAttractionKm: Math.round(rand() * 5 * 10) / 10,
      isFeatured: starRating >= 4.6,
      bookingComAffiliateLink: '#', // placeholder — needs a real Booking.com affiliate link
    })
  }
  return hotels
}

export const HOTELS: Hotel[] = DESTINATIONS.flatMap(d => buildHotelsForDestination(d, 12))

function buildReviewsForHotel(hotel: Hotel): Review[] {
  const rand = seededRandom(hotel.id.length * 104729)
  const count = Math.min(5, Math.max(2, Math.round(hotel.reviewCount / 60)))
  return Array.from({ length: count }, (_, i) => ({
    id: `${hotel.id}-review-${i + 1}`,
    reviewerName: `Guest ${i + 1}`,
    reviewerCountry: REVIEW_COUNTRIES[Math.floor(rand() * REVIEW_COUNTRIES.length)],
    rating: Math.max(3, Math.min(5, Math.round(hotel.starRating + (rand() - 0.5)))),
    reviewText: SAMPLE_REVIEW_LINES[i % SAMPLE_REVIEW_LINES.length],
    datePosted: '2026-0' + (1 + Math.floor(rand() * 8)) + '-15',
    source: 'sample', // placeholder — real reviews should be sourced from Booking.com
  }))
}

export const REVIEWS_BY_HOTEL: Record<string, Review[]> = Object.fromEntries(
  HOTELS.map(h => [h.id, buildReviewsForHotel(h)])
)

export function getDestinationBySlug(slug: string): Destination | undefined {
  return DESTINATIONS.find(d => d.slug === slug)
}

export function getHotelsByDestination(destinationId: string): Hotel[] {
  return HOTELS.filter(h => h.destinationId === destinationId)
}

export function getHotelById(id: string): Hotel | undefined {
  return HOTELS.find(h => h.id === id)
}

export function getAmenityById(id: string): Amenity | undefined {
  return AMENITIES.find(a => a.id === id)
}
