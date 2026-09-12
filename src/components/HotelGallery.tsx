'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'

export default function HotelGallery({ images, hotelName }: { images: string[]; hotelName: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const prev = useCallback(
    () => setOpenIndex(i => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  )
  const next = useCallback(
    () => setOpenIndex(i => (i === null ? null : (i + 1) % images.length)),
    [images.length]
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

  const [mainImage, ...thumbnails] = images
  const visibleThumbnails = thumbnails.slice(0, 3)
  const extraCount = images.length - 4 // main + 3 shown

  return (
    <>
      <div className="rounded-lg overflow-hidden relative cursor-pointer" style={{ height: 320 }}>
        <button type="button" onClick={() => setOpenIndex(0)} className="block w-full h-full" aria-label={`View photos of ${hotelName}`}>
          <Image src={mainImage} alt={hotelName} fill className="object-cover hover:opacity-90 transition-opacity" priority sizes="(max-width: 768px) 100vw, 800px" />
        </button>
      </div>
      {visibleThumbnails.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5 mt-2.5">
          {visibleThumbnails.map((src, i) => {
            const isLast = i === visibleThumbnails.length - 1
            return (
              <button
                key={src}
                type="button"
                onClick={() => setOpenIndex(i + 1)}
                className="relative rounded-lg overflow-hidden"
                style={{ height: 80 }}
                aria-label={`View photo ${i + 2} of ${hotelName}`}
              >
                <Image src={src} alt={`${hotelName} photo ${i + 2}`} fill className="object-cover hover:opacity-90 transition-opacity" sizes="200px" />
                {isLast && extraCount > 0 && (
                  <span className="absolute inset-0 bg-black/50 text-white text-sm font-semibold flex items-center justify-center">
                    +{extraCount} more
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${hotelName} photo gallery`}
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

          <div
            className="relative w-full max-w-4xl mx-4"
            style={{ height: '75vh' }}
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={images[openIndex]}
              alt={`${hotelName} photo ${openIndex + 1}`}
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
            {openIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
