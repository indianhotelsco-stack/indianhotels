export interface Destination {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string | null
  latitude: number
  longitude: number
  monthlySearches: number
  region: string
}

export interface Amenity {
  id: string
  name: string
  icon: string
}

export interface Review {
  id: string
  reviewerName: string
  reviewerCountry: string
  rating: number
  reviewText: string
  datePosted: string
  source: string
}

export interface Hotel {
  id: string
  destinationId: string
  name: string
  description: string
  pricePerNight: number
  /** True per the data source: real Booking.com/Agoda live rate vs. a Google-price-level estimate. */
  priceIsEstimate: boolean
  starRating: number
  reviewCount: number
  imageUrls: string[]
  amenities: Amenity[]
  address: string
  latitude: number
  longitude: number
  isFeatured: boolean
  bookingComLink: string
  /** True once a real affiliate account is wired up — false means bookingComLink is a plain (non-commission) search link. */
  bookingComLinkIsAffiliate: boolean
  phone: string | null
  website: string | null
  googleMapsUrl: string | null
}

export interface HotelFilters {
  maxPrice?: number
  minRating?: number
  amenityIds?: string[]
  sort?: 'price-asc' | 'price-desc' | 'rating' | 'popular'
}
