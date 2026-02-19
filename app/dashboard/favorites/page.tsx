'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/dashboard/PageHeader'
import { useCart } from '@/lib/cart-context'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState<string | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    loadFavorites()
  }, [])

  function loadFavorites() {
    fetch('/api/dashboard/favorites')
      .then((r) => r.json())
      .then((data) => setFavorites(data.favorites || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  async function handleRemoveFavorite(productId: string) {
    setRemovingId(productId)
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      if (res.ok) {
        setFavorites((prev) => prev.filter((f) => f.productId !== productId))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setRemovingId(null)
    }
  }

  function handleAddToCart(fav: any) {
    addToCart({
      productId: fav.product.id,
      name: fav.product.name,
      price: fav.product.price,
      unit: fav.product.unit,
      farmName: fav.product.farmName,
      categoryIcon: fav.product.categoryIcon || '',
      maxStock: fav.product.stock,
    })
    setAddedToCart(fav.productId)
    setTimeout(() => setAddedToCart(null), 1500)
  }

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
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
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
            <div
              key={fav.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-100"
            >
              {/* Icon area */}
              <div className="h-36 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-5xl relative">
                {fav.product?.categoryIcon || '?'}
                <button
                  onClick={() => handleRemoveFavorite(fav.productId)}
                  disabled={removingId === fav.productId}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow hover:shadow-md transition"
                  title="Odstrani iz priljubljenih"
                >
                  <svg
                    className="w-4 h-4 text-red-500 fill-red-500"
                    fill="currentColor"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-0.5">{fav.product?.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{fav.product?.farmName} &middot; {fav.product?.farmCity}</p>

                <div className="flex items-center justify-between">
                  <span className="text-green-700 font-bold">
                    {fav.product?.price?.toFixed(2)} EUR
                    <span className="text-xs text-gray-500 font-normal">/{fav.product?.unit}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(fav)}
                      disabled={!fav.product?.available || fav.product?.stock === 0 || addedToCart === fav.productId}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                        addedToCart === fav.productId
                          ? 'bg-green-700 text-white'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {addedToCart === fav.productId
                        ? 'Dodano!'
                        : fav.product?.stock === 0
                        ? 'Razprodano'
                        : 'V kosarco'}
                    </button>
                    <button
                      onClick={() => handleRemoveFavorite(fav.productId)}
                      disabled={removingId === fav.productId}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-500 transition disabled:opacity-50"
                    >
                      {removingId === fav.productId ? '...' : 'Odstrani'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
