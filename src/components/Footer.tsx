import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <div>© 2026 IndianHotels.co — Hotel prices and availability provided by our booking partners.</div>
        <div className="flex gap-6">
          <Link href="/about" className="hover:text-navy">About</Link>
          <Link href="/contact" className="hover:text-navy">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
