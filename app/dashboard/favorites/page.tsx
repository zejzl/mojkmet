'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/dashboard/PageHeader'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((r) => r.json())
      .then(() => {
        // For now, show empty state - favorites API can be expanded later
        setFavorites([])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Priljubljene" description="Vasi shranjeni izdelki" />

      {favorites.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <span className="text-5xl block mb-4">❤️</span>
          <h3 className="text-lg font-semibold text-gray-900">Se nimate priljubljenih izdelkov</h3>
          <p className="text-gray-500 mt-2">Brskajte po izdelkih in dodajte priljubljene.</p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
          >
            Odkrijte izdelke
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav: any) => (
            <div key={fav.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-40 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                <span className="text-4xl">🥬</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{fav.product?.name}</h3>
                <p className="text-sm text-gray-500">{fav.product?.farm?.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-green-600 font-bold">
                    {fav.product?.price?.toFixed(2)} EUR/{fav.product?.unit}
                  </span>
                  <button className="text-red-400 hover:text-red-600 transition text-sm">
                    Odstrani
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
