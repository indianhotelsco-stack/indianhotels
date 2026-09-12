'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import ImagePlaceholder from './ImagePlaceholder'

export default function DestinationHeroGallery({
  photos,
  destinationName,
  subtitle,
}: {
  photos: string[]
  destinationName: string
  subtitle: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const prev = useCallback(
    () => setOpenIndex(i => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  )
  const next = useCallback(
    () => setOpenIndex(i => (i === null ? null : (i + 1) % photos.length)),
    [photos.length]
  )

  useEffect(() => {
    if (openIndex === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [openIndex, close, prev, next])

  return (
    <>
      <div className="relative" style={{ height: 220 }}>
        {photos[0] ? (
          <Image src={photos[0]} alt={destinationName} fill className="object-cover" priority sizes="100vw" />
        ) : (
          <ImagePlaceholder height={220} label={destinationName} />
        )}
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6 sm:p-10">
          <h1 className="text-white text-2xl sm:text-4xl font-bold">Hotels near {destinationName}</h1>
          <p className="text-white/85 text-sm mt-1">{subtitle}</p>
        </div>
        {photos.length > 1 && (
          <button
            type="button"
            onClick={() => setOpenIndex(0)}
            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 bg-white/90 hover:bg-white text-navy text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5"
          >
            📷 View {photos.length} Photos
          </button>
        )}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${destinationName} photo gallery`}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 text-white text-3xl leading-none w-10 h-10 flex items-center justify-center hover:text-gold"
            aria-label="Close gallery"
          >
            ×
          </button>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); prev() }}
            className="absolute left-2 sm:left-6 text-white text-4xl w-12 h-12 flex items-center justify-center hover:text-gold"
            aria-label="Previous photo"
          >
            ‹
          </button>
          <div className="relative w-full max-w-4xl mx-4" style={{ height: '75vh' }} onClick={e => e.stopPropagation()}>
            <Image
              src={photos[openIndex]}
              alt={`${destinationName} photo ${openIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); next() }}
            className="absolute right-2 sm:right-6 text-white text-4xl w-12 h-12 flex items-center justify-center hover:text-gold"
            aria-label="Next photo"
          >
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {openIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  )
}
