import { supabase } from './supabase'
import type { Amenity, Destination, Hotel, Review } from './types'

type DestinationRow = {
  id: string; name: string; slug: string; description: string | null; image_url: string | null
  latitude: number; longitude: number; monthly_searches: number; region: string
}

type ListingRow = {
  id: string; destination_id: string; name: string; description: string | null
  price_per_night: number; rating_text: string | null
  star_rating: number; review_count: number; image_urls: string[] | null
  address: string | null; latitude: number | null; longitude: number | null
  is_featured: boolean; booking_com_affiliate_link: string | null
  listing_amenities: { amenities: AmenityRow }[] | null
}

type AmenityRow = { id: string; name: string; icon: string | null }

type ReviewRow = {
  id: string; reviewer_name: string | null; reviewer_country: string | null
  rating: number; review_text: string | null; date_posted: string | null; source: string | null
}

function mapDestination(row: DestinationRow): Destination {
  return {
    id: row.id, name: row.name, slug: row.slug, description: row.description ?? '',
    imageUrl: row.image_url, latitude: row.latitude, longitude: row.longitude,
    monthlySearches: row.monthly_searches, region: row.region,
  }
}

function mapAmenity(row: AmenityRow): Amenity {
  return { id: row.id, name: row.name, icon: row.icon ?? '•' }
}

function mapListing(row: ListingRow): Hotel {
  const amenities = (row.listing_amenities ?? []).map(la => mapAmenity(la.amenities))
  return {
    id: row.id,
    destinationId: row.destination_id,
    name: row.name,
    description: row.description ?? '',
    pricePerNight: row.price_per_night,
    priceIsEstimate: row.rating_text?.toLowerCase().includes('estimate') ?? false,
    starRating: row.star_rating,
    reviewCount: row.review_count,
    imageUrls: row.image_urls ?? [],
    amenities,
    address: row.address ?? '',
    latitude: row.latitude ?? 0,
    longitude: row.longitude ?? 0,
    isFeatured: row.is_featured,
    bookingComAffiliateLink: row.booking_com_affiliate_link || '#',
  }
}

function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    reviewerName: row.reviewer_name ?? 'Guest',
    reviewerCountry: row.reviewer_country ?? '',
    rating: row.rating,
    reviewText: row.review_text ?? '',
    datePosted: row.date_posted ?? '',
    source: row.source ?? '',
  }
}

const LISTING_SELECT = '*, listing_amenities(amenities(id, name, icon))'

export async function getAllDestinations(): Promise<Destination[]> {
  const { data, error } = await supabase.from('destinations').select('*').order('monthly_searches', { ascending: false })
  if (error) throw error
  return (data as DestinationRow[]).map(mapDestination)
}

export async function getDestinationBySlug(slug: string): Promise<Destination | undefined> {
  const { data, error } = await supabase.from('destinations').select('*').eq('slug', slug).maybeSingle()
  if (error) throw error
  return data ? mapDestination(data as DestinationRow) : undefined
}

export async function getDestinationById(id: string): Promise<Destination | undefined> {
  const { data, error } = await supabase.from('destinations').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? mapDestination(data as DestinationRow) : undefined
}

export async function getAllHotelIds(): Promise<string[]> {
  const { data, error } = await supabase.from('listings').select('id')
  if (error) throw error
  return (data as { id: string }[]).map(r => r.id)
}

export async function getHotelsByDestination(destinationId: string): Promise<Hotel[]> {
  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_SELECT)
    .eq('destination_id', destinationId)
    .order('star_rating', { ascending: false })
  if (error) throw error
  return (data as unknown as ListingRow[]).map(mapListing)
}

export async function getHotelById(id: string): Promise<Hotel | undefined> {
  const { data, error } = await supabase.from('listings').select(LISTING_SELECT).eq('id', id).maybeSingle()
  if (error) throw error
  return data ? mapListing(data as unknown as ListingRow) : undefined
}

export async function getFeaturedHotels(limit = 4): Promise<Hotel[]> {
  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_SELECT)
    .eq('is_featured', true)
    .order('star_rating', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data as unknown as ListingRow[]).map(mapListing)
}

export async function getAllAmenities(): Promise<Amenity[]> {
  const { data, error } = await supabase.from('amenities').select('*').order('name')
  if (error) throw error
  return (data as AmenityRow[]).map(mapAmenity)
}

export async function getReviewsForHotel(hotelId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('listing_id', hotelId)
    .order('date_posted', { ascending: false })
    .limit(5)
  if (error) throw error
  return (data as ReviewRow[]).map(mapReview)
}
