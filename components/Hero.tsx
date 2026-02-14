'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Stats {
  farmCount: number
  productCount: number
  orderCount: number
}

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

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
              Kupujte sveže kmetijske pridelke neposredno od slovenskih kmetov. 
              Brez posrednikov. Poštene cene. Svežina zagotovljena.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
              <div className="grid md:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Kaj iščete? (npr. mleko, jajca)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Lokacija (npr. Ljubljana)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Link
                  href="/products"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold text-center"
                >
                  Išči
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Popularne kategorije:</span>
              {['Mleko', 'Jajca', 'Zelenjava', 'Meso', 'Med'].map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${cat.toLowerCase()}`}
                  className="text-sm bg-white px-3 py-1 rounded-full hover:bg-green-50 transition border border-gray-200"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-green-200 to-amber-200 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-6xl">
                <div className="text-center">
                  <div className="text-8xl mb-4">🌾</div>
                  <p className="text-lg">Hero Image</p>
                </div>
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
