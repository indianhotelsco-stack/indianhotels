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
  starRating: number
  reviewCount: number
  imageUrls: string[]
  amenityIds: string[]
  address: string
  latitude: number
  longitude: number
  distanceFromAttractionKm: number
  isFeatured: boolean
  bookingComAffiliateLink: string
}

export interface HotelFilters {
  maxPrice?: number
  minRating?: number
  amenityIds?: string[]
  sort?: 'price-asc' | 'price-desc' | 'rating' | 'popular'
}
