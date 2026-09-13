export type BookingSearchParams = {
  checkIn?: string
  checkOut?: string
  guests?: number
}

/** Appends real dates/guest count to a Booking.com URL (search-results or affiliate deep-link — both accept these standard params) so the click-through opens pre-filled instead of blank. */
export function withBookingParams(baseUrl: string, params: BookingSearchParams): string {
  if (!params.checkIn && !params.checkOut && !params.guests) return baseUrl
  const url = new URL(baseUrl)
  if (params.checkIn) url.searchParams.set('checkin', params.checkIn)
  if (params.checkOut) url.searchParams.set('checkout', params.checkOut)
  if (params.guests) {
    url.searchParams.set('group_adults', String(params.guests))
    url.searchParams.set('no_rooms', '1')
  }
  return url.toString()
}

/** Builds the query string used to carry a user's search (dates/guests) across destination → hotel pages. */
export function bookingParamsToQueryString(params: BookingSearchParams): string {
  const qs = new URLSearchParams()
  if (params.checkIn) qs.set('checkin', params.checkIn)
  if (params.checkOut) qs.set('checkout', params.checkOut)
  if (params.guests) qs.set('guests', String(params.guests))
  const str = qs.toString()
  return str ? `?${str}` : ''
}

export function bookingParamsFromSearchParams(searchParams: Record<string, string | string[] | undefined>): BookingSearchParams {
  const get = (key: string) => {
    const value = searchParams[key]
    return Array.isArray(value) ? value[0] : value
  }
  const guests = get('guests')
  return {
    checkIn: get('checkin'),
    checkOut: get('checkout'),
    guests: guests ? Number(guests) : undefined,
  }
}
