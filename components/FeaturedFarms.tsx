'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DistanceBadge from '@/components/DistanceBadge'

interface Farm {
  id: string
  name: string
  description: string | null
  city: string
  latitude?: number | null
  longitude?: number | null
  is_verified: boolean
  image?: string | null
}

export default function FeaturedFarms() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/farms')
      .then((res) => res.json())
      .then((data) => {
        if (data.farms && data.farms.length > 0) {
          setFarms(data.farms.slice(0, 3)) // Show max 3 farms
        } else {
          // Fallback to mock data if no real farms
          setFarms([
            {
              id: 'mock-1',
              name: 'Kmalu',
              description: 'Kmalu bomo dodali prve kmetije',
              city: 'Slovenija',
              is_verified: false,
            },
          ])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch farms:', err)
        setError('Napaka pri nalaganju kmetij')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-4xl mb-4" aria-hidden="true">
            ⏳
          </div>
          <p className="text-gray-600" role="status">
            Nalagam kmetije...
          </p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-4xl mb-4" aria-hidden="true">
            😔
          </div>
          <p className="text-gray-600" role="alert">
            {error}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Priljubljene kmetije</h2>
            <p className="text-xl text-gray-600">Odkrijte najboljše kmetije v vaši bližini</p>
          </div>
          <Link
            href="/farms"
            className="hidden md:inline-block text-green-700 hover:text-green-800 font-semibold"
          >
            Poglej vse →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {farms.map((farm) => (
            <Link
              key={farm.id}
              // The "Kmalu" placeholder has no detail page, so send it to the farm list
              href={farm.id.startsWith('mock-') ? '/farms' : `/farms/${farm.id}`}
              className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition group"
            >
              {/* Farm Image */}
              <div className="h-48 bg-gradient-to-br from-green-200 to-amber-200 relative overflow-hidden">
                {farm.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={farm.image}
                    alt={farm.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center text-gray-400 text-6xl"
                    aria-hidden="true"
                  >
                    🏡
                  </div>
                )}
                {farm.is_verified && (
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verificirana
                  </div>
                )}
              </div>

              {/* Farm Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">
                  {farm.name}
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {farm.city}
                  <DistanceBadge latitude={farm.latitude} longitude={farm.longitude} />
                </div>

                {farm.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{farm.description}</p>
                )}

                {farm.is_verified ? (
                  <div className="text-sm text-green-700 font-semibold">Verificirana kmetija ✓</div>
                ) : (
                  <div className="text-sm text-amber-700 font-semibold">Kmalu dostopna</div>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/farms"
            className="inline-block text-green-700 hover:text-green-800 font-semibold"
          >
            Poglej vse kmetije →
          </Link>
        </div>
      </div>
    </section>
  )
}
