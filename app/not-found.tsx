import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Strani ni mogoče najti',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="flex-grow bg-gray-50 py-20">
      <div className="container mx-auto px-4 text-center max-w-xl">
        <p className="text-6xl font-bold text-green-600 mb-4">404</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Strani ni mogoče najti</h1>
        <p className="text-gray-600 mb-8">
          Naslov, ki ste ga vnesli, ne obstaja ali pa je bil odstranjen. Poskusite z iskanjem med
          izdelki ali kmetijami.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Poglej izdelke
          </Link>
          <Link
            href="/farms"
            className="bg-white text-green-700 border border-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Poglej kmetije
          </Link>
        </div>
      </div>
    </main>
  )
}
