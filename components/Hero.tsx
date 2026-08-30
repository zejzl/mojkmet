'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Stats {
  farmCount: number
  productCount: number
  orderCount: number
}

export default function Hero() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchQuery.trim()
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : '/products')
  }

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats')
        if (!response.ok) throw new Error('Failed to fetch stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-amber-50 py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
            <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Sveže. Lokalno. Neposredno.
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Sveže od kmeta,
              <span className="text-green-600"> neposredno k vam</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Kupujte sveže kmetijske pridelke neposredno od slovenskih kmetov. Brez posrednikov.
              Poštene cene. Svežina zagotovljena.
            </p>

            {/* Search Bar */}
            <form onSubmit={submitSearch} className="bg-white rounded-xl shadow-lg p-2 mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kaj iščete? (npr. mleko, jajca)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold text-center"
                >
                  Išči
                </button>
              </div>
            </form>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Popularne kategorije:</span>
              {[
                { label: 'Mleko', slug: 'mlecni-izdelki' },
                { label: 'Jajca', slug: 'jajca' },
                { label: 'Zelenjava', slug: 'zelenjava' },
                { label: 'Meso', slug: 'meso' },
                { label: 'Med', slug: 'med' },
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="text-sm bg-white px-3 py-1 rounded-full hover:bg-green-50 transition border border-gray-200"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-green-100 via-emerald-50 to-amber-100 overflow-hidden shadow-lg">
              <div className="h-full grid grid-cols-2 gap-4 p-8 items-center">
                {[
                  { emoji: '🥛', label: 'Mlečni izdelki' },
                  { emoji: '🥕', label: 'Zelenjava' },
                  { emoji: '🍎', label: 'Sadje' },
                  { emoji: '🍯', label: 'Med' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center justify-center bg-white/80 backdrop-blur rounded-xl p-6 text-center shadow-sm border border-white"
                  >
                    <div className="text-5xl mb-2">{item.emoji}</div>
                    <p className="text-sm font-medium text-gray-700">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
              <div className="text-3xl font-bold text-green-600">
                {statsLoading ? '...' : `${stats?.farmCount || 0}+`}
              </div>
              <div className="text-sm text-gray-600">Kmetij</div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4">
              <div className="text-3xl font-bold text-amber-600">
                {statsLoading ? '...' : `${stats?.orderCount || 0}+`}
              </div>
              <div className="text-sm text-gray-600">Dostav</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
