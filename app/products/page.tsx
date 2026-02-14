'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import Toast from '@/components/Toast'

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

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState(searchQuery || '')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  const { addItem } = useCart()

  function handleAddToCart(product: Product) {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      farmName: product.farm_name,
      categoryIcon: product.category_icon,
      stock: product.stock,
    })
    setToastMessage('Dodano v košarico!')
    setShowToast(true)
  }

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

  const activeCategory = categories.find(c => c.slug === categorySlug)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(search.trim())}`
    } else {
      window.location.href = '/products'
    }
  }

  return (
    <>
      <Toast message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
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
              <div className="text-6xl mb-4">🔍</div>
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
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-40 flex items-center justify-center text-7xl">
                      {product.category_icon}
                    </div>
                  </Link>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <Link href={`/products/${product.id}`} className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight hover:text-green-700 transition">
                          {product.name}
                        </h3>
                      </Link>
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
                      <span className="mr-1">🌾</span>
                      <span>{product.farm_name}</span>
                      {product.farm_verified && (
                        <span className="ml-1 text-green-600" title="Verificirana kmetija">✓</span>
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
                        {product.stock > 10 ? 'Na zalogi' : product.stock > 0 ? `Se ${product.stock} na zalogi` : 'Razprodano'}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={product.stock === 0}
                      >
                        V košarico
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
    </>
  )
}
