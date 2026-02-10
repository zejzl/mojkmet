'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageHeader from '@/components/dashboard/PageHeader'

export default function ProductsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.role !== 'FARMER') {
      router.replace('/dashboard')
      return
    }
    loadProducts()
  }, [session, router])

  const loadProducts = () => {
    fetch('/api/dashboard/products')
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const toggleAvailability = async (id: string, currentAvailable: boolean) => {
    setTogglingId(id)
    try {
      const res = await fetch(`/api/dashboard/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !currentAvailable }),
      })
      if (res.ok) {
        setProducts(products.map((p) =>
          p.id === id ? { ...p, available: !currentAvailable } : p
        ))
      }
    } catch (error) {
      console.error('Toggle error:', error)
    } finally {
      setTogglingId(null)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Ali ste prepricani, da zelite izbrisati ta izdelek?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/dashboard/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Izdelki"
        description={`${products.length} ${products.length === 1 ? 'izdelek' : 'izdelkov'}`}
        action={
          <Link
            href="/dashboard/farmer/products/new"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
          >
            + Dodaj izdelek
          </Link>
        }
      />

      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <span className="text-5xl block mb-4">🥬</span>
          <h3 className="text-lg font-semibold text-gray-900">Se nimate izdelkov</h3>
          <p className="text-gray-500 mt-2">Dodajte svoj prvi izdelek za prodajo.</p>
          <Link
            href="/dashboard/farmer/products/new"
            className="mt-6 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
          >
            + Dodaj prvi izdelek
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs text-gray-500 uppercase">
                  <th className="px-6 py-3">Izdelek</th>
                  <th className="px-6 py-3">Kategorija</th>
                  <th className="px-6 py-3 text-right">Cena</th>
                  <th className="px-6 py-3 text-right">Zaloga</th>
                  <th className="px-6 py-3 text-center">Na voljo</th>
                  <th className="px-6 py-3 text-right">Dejanja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      {product.description && (
                        <p className="text-xs text-gray-500 truncate max-w-xs">{product.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{product.category?.name || '-'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {product.price.toFixed(2)} EUR/{product.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-medium ${product.stock > 0 ? 'text-gray-900' : 'text-red-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleAvailability(product.id, product.available)}
                        disabled={togglingId === product.id}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          product.available ? 'bg-green-600' : 'bg-gray-300'
                        } ${togglingId === product.id ? 'opacity-50' : ''}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            product.available ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => deleteProduct(product.id)}
                          disabled={deletingId === product.id}
                          className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                        >
                          {deletingId === product.id ? '...' : 'Izbrisi'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
