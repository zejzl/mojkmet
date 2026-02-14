'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  description: string
  price: number
  unit: string
  stock: number
  available: boolean
  image: string | null
  farmId: string
  categoryId: string
  farm_name: string
  farm_city: string
  farm_description: string
  farm_verified: boolean
  farm_id: string
  category_name: string
  category_slug: string
  category_icon: string
  farm_rating: number
  farm_total_reviews: number
}

interface RelatedProduct {
  id: string
  name: string
  price: number
  unit: string
  image: string | null
  category_icon: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      try {
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Izdelek ni bil najden')
          }
          throw new Error('Napaka pri nalaganju izdelka')
        }
        const data = await response.json()
        setProduct(data.product)
        setRelatedProducts(data.relatedProducts || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Neznana napaka')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  if (loading) {
    return (
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Nalaganje izdelka...</p>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Napaka</h1>
          <p className="text-gray-600 mb-6">{error || 'Izdelek ni bil najden'}</p>
          <Link
            href="/products"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            ← Nazaj na izdelke
          </Link>
        </div>
      </main>
    )
  }

  const stockStatus =
    product.stock > 10
      ? { label: 'Na zalogi', color: 'bg-green-50 text-green-700' }
      : product.stock > 0
      ? { label: 'Zadnje na zalogi', color: 'bg-yellow-50 text-yellow-700' }
      : { label: 'Razprodano', color: 'bg-red-50 text-red-700' }

  return (
    <main className="flex-grow bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600 transition">
              Domov
            </Link>
            <span className="mx-2">&gt;</span>
            <Link href="/products" className="hover:text-green-600 transition">
              Izdelki
            </Link>
            <span className="mx-2">&gt;</span>
            <Link
              href={`/products?category=${product.category_slug}`}
              className="hover:text-green-600 transition"
            >
              {product.category_name}
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Back Link */}
      <div className="container mx-auto px-4 py-4">
        <Link
          href="/products"
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition"
        >
          ← Nazaj na izdelke
        </Link>
      </div>

      {/* Product Detail */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-12">
                <div className="text-9xl">{product.category_icon}</div>
              </div>

              {/* Product Info */}
              <div className="p-8">
                <div className="mb-4">
                  <Link
                    href={`/products?category=${product.category_slug}`}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color} hover:opacity-80 transition`}
                  >
                    {product.category_icon} {product.category_name}
                  </Link>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                <div className="mb-6">
                  <div className="text-4xl font-bold text-green-700 mb-2">
                    {product.price.toFixed(2)} EUR
                    <span className="text-lg text-gray-500 font-normal ml-2">/ {product.unit}</span>
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                    {stockStatus.label}
                  </div>
                </div>

                {product.description && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Opis</h2>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>
                )}

                <button
                  className="w-full bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.stock === 0}
                >
                  🛒 V košarico
                </button>

                {product.stock === 0 && (
                  <p className="text-sm text-red-600 mt-2 text-center">
                    Ta izdelek je trenutno razprodan
                  </p>
                )}
              </div>
            </div>

            {/* Farm Info Card */}
            <div className="border-t border-gray-200 bg-gray-50 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🌾 O kmetiji</h2>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Link
                      href={`/farms/${product.farm_id}`}
                      className="text-2xl font-bold text-green-700 hover:text-green-800 transition"
                    >
                      {product.farm_name}
                    </Link>
                    {product.farm_verified && (
                      <span className="ml-2 inline-flex items-center text-green-600" title="Verificirana kmetija">
                        ✓ Verificirana
                      </span>
                    )}
                    <p className="text-gray-600 mt-1">📍 {product.farm_city}</p>
                  </div>
                  {product.farm_total_reviews > 0 && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-500">
                        ⭐ {product.farm_rating}
                      </div>
                      <p className="text-sm text-gray-600">
                        {product.farm_total_reviews} {product.farm_total_reviews === 1 ? 'ocena' : 'ocene'}
                      </p>
                    </div>
                  )}
                </div>
                {product.farm_description && (
                  <p className="text-gray-700 leading-relaxed mb-4">{product.farm_description}</p>
                )}
                <Link
                  href={`/farms/${product.farm_id}`}
                  className="inline-block text-green-600 hover:text-green-700 font-medium transition"
                >
                  Poglej vse izdelke te kmetije →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Podobni izdelki</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition border border-gray-100"
                >
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-40 flex items-center justify-center text-7xl">
                    {relatedProduct.category_icon}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">
                      {relatedProduct.name}
                    </h3>
                    <div className="text-green-700 font-bold text-lg">
                      {relatedProduct.price.toFixed(2)} EUR
                      <span className="text-xs text-gray-500 font-normal">/{relatedProduct.unit}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
