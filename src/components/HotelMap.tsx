'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import type { Hotel } from '@/lib/types'

const LEAFLET_ICON_BASE = 'https://unpkg.com/leaflet@1.9.4/dist/images'

type CenterPoint = { name: string; latitude: number; longitude: number }

export default function HotelMap({ hotels, center }: { hotels: Hotel[]; center: CenterPoint }) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let map: import('leaflet').Map | undefined

    ;(async () => {
      const L = (await import('leaflet')).default
      if (!mapRef.current || map) return

      const hotelIcon = L.icon({
        iconUrl: `${LEAFLET_ICON_BASE}/marker-icon.png`,
        iconRetinaUrl: `${LEAFLET_ICON_BASE}/marker-icon-2x.png`,
        shadowUrl: `${LEAFLET_ICON_BASE}/marker-shadow.png`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })
      const centerIcon = L.icon({
        iconUrl: `${LEAFLET_ICON_BASE}/marker-icon-2x.png`,
        shadowUrl: `${LEAFLET_ICON_BASE}/marker-shadow.png`,
        iconSize: [30, 49],
        iconAnchor: [15, 49],
        popupAnchor: [1, -40],
        shadowSize: [49, 49],
        className: 'hotel-map-center-marker',
      })

      map = L.map(mapRef.current).setView([center.latitude, center.longitude], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      L.marker([center.latitude, center.longitude], { icon: centerIcon })
        .addTo(map)
        .bindPopup(`<strong>${center.name}</strong>`)

      const withCoords = hotels.filter(h => h.latitude && h.longitude)
      const bounds = L.latLngBounds([[center.latitude, center.longitude]])

      for (const hotel of withCoords) {
        const marker = L.marker([hotel.latitude, hotel.longitude], { icon: hotelIcon }).addTo(map!)
        const priceLabel = `₹${hotel.pricePerNight.toLocaleString('en-IN')}/night${hotel.priceIsEstimate ? ' (est.)' : ''}`
        marker.bindPopup(
          `<div style="min-width:160px">
            <strong>${escapeHtml(hotel.name)}</strong><br/>
            ⭐ ${hotel.starRating} (${hotel.reviewCount} reviews)<br/>
            <span style="color:#D4AF37;font-weight:600">${priceLabel}</span><br/>
            <a href="/hotel/${hotel.id}" style="color:#1E3A5F;text-decoration:underline">View hotel →</a>
          </div>`
        )
        bounds.extend([hotel.latitude, hotel.longitude])
      }

      if (withCoords.length > 0) map.fitBounds(bounds, { padding: [40, 40] })
    })()

    return () => {
      map?.remove()
    }
  }, [hotels, center])

  return <div ref={mapRef} className="w-full rounded-lg overflow-hidden border border-gray-200" style={{ height: 420 }} />
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}
