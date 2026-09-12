import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-navy font-bold text-lg">
          <span className="w-8 h-8 rounded bg-navy text-white grid place-items-center font-bold">IH</span>
          IndianHotels<span className="text-gold">.co</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/#destinations" className="hover:text-navy">Destinations</Link>
          <Link href="/about" className="hover:text-navy">About</Link>
        </nav>
      </div>
    </header>
  )
}
