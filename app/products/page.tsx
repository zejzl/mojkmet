'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useCart } from '@/lib/cart-context'

interface Product {
  id: string
  name: string
  description: string
  price: number
  unit: string
  stock: number
  available: boolean
  image: string | null
  farm_name: string
  farm_city: string
  farm_verified: boolean
  category_name: string
  category_slug: string
  category_icon: string
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  product_count: number
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-gray-500">Nalaganje...</div>}>
      <ProductsContent />
    </Suspense>
  )
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get('category')
  const searchQuery = searchParams.get('search')

  const { data: session } = useSession()
  const { addToCart } = useCart()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState(searchQuery || '')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [togglingFav, setTogglingFav] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (categorySlug) params.set('category', categorySlug)
        if (searchQuery) params.set('search', searchQuery)

        const response = await fetch(`/api/products?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data.products)
        setCategories(data.categories)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [categorySlug, searchQuery])

  useEffect(() => {
    if (!session) return
    fetch('/api/favorites')
      .then((r) => r.json())
      .then((data) => {
        if (data.favorites) {
          setFavorites(new Set(data.favorites))
        }
      })
      .catch(() => {})
  }, [session])

  const activeCategory = categories.find(c => c.slug === categorySlug)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(search.trim())}`
    } else {
      window.location.href = '/products'
    }
  }

  function handleAddToCart(product: Product) {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      farmName: product.farm_name,
      categoryIcon: product.category_icon,
      maxStock: product.stock,
    })
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 1500)
  }

  async function handleToggleFavorite(productId: string) {
    if (!session) {
      window.location.href = '/login?redirect=/products'
      return
    }
    setTogglingFav(productId)
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      const data = await res.json()
      if (res.ok) {
        setFavorites((prev) => {
          const next = new Set(prev)
          if (data.favorited) {
            next.add(productId)
          } else {
            next.delete(productId)
          }
          return next
        })
      }
    } catch {
      // ignore
    } finally {
      setTogglingFav(null)
    }
  }

  return (
    <main className="flex-grow">
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            {activeCategory ? `${activeCategory.icon} ${activeCategory.name}` : 'Vsi proizvodi'}
          </h1>
          <p className="text-lg opacity-90">
            {activeCategory
              ? `${products.length} izdelkov v kategoriji`
              : `${products.length} svezih izdelkov od lokalnih kmetov`}
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="bg-gray-50 py-6 border-b">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Isci proizvode..."
              className="flex-1 px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Isci
            </button>
          </form>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="py-4 border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/products"
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                !categorySlug
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vse
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  categorySlug === cat.slug
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.name} ({cat.product_count})
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading && (
            <div className="text-center text-gray-600 py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4">Nalaganje izdelkov...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-lg mx-auto">
              Napaka: {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center text-gray-500 py-16">
              <p className="text-4xl mb-4">?</p>
              <p className="text-xl">Ni najdenih izdelkov</p>
              <Link href="/products" className="text-green-600 hover:underline mt-2 inline-block">
                Poglej vse izdelke
              </Link>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition border border-gray-100"
                >
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-40 flex items-center justify-center text-7xl relative">
                    {product.category_icon}
                    {/* Favorite button */}
                    <button
                      onClick={() => handleToggleFavorite(product.id)}
                      disabled={togglingFav === product.id}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow hover:shadow-md transition"
                      title={favorites.has(product.id) ? 'Odstrani iz priljubljenih' : 'Dodaj med priljubljene'}
                    >
                      <svg
                        className={`w-5 h-5 transition-colors ${
                          favorites.has(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'
                        }`}
                        fill={favorites.has(product.id) ? 'currentColor' : 'none'}
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
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">
                        {product.name}
                      </h3>
                      <div className="text-green-700 font-bold text-lg whitespace-nowrap ml-3">
                        {product.price.toFixed(2)} EUR
                        <span className="text-xs text-gray-500 font-normal">/{product.unit}</span>
                      </div>
                    </div>
                    {product.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="mr-1 text-base">*</span>
                      <span>{product.farm_name}</span>
                      {product.farm_verified && (
                        <span className="ml-1 text-green-600 font-bold" title="Verificirana kmetija">v</span>
                      )}
                      <span className="mx-1">-</span>
                      <span>{product.farm_city}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.stock > 10
                          ? 'bg-green-50 text-green-700'
                          : product.stock > 0
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {product.stock > 10
                          ? 'Na zalogi'
                          : product.stock > 0
                          ? `Se ${product.stock} na zalogi`
                          : 'Razprodano'}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0 || addedToCart === product.id}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                          addedToCart === product.id
                            ? 'bg-green-700 text-white'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {addedToCart === product.id ? 'Dodano!' : 'V kosarco'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
