'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import OrderStatusBadge from '@/components/dashboard/OrderStatusBadge'

export default function OrderConfirmationPage() {
  const params = useParams()
  const id = params?.id as string

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setOrder(data.order)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main className="flex-grow bg-gray-50 py-16 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="flex-grow bg-gray-50 py-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-md p-12">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Narocilo ni najdeno</h2>
            <p className="text-gray-500 mb-6">{error || 'Prosimo, preverite svoja narocila.'}</p>
            <Link
              href="/dashboard/orders"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Moja narocila
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-grow bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Narocilo je oddano!</h1>
          <p className="text-gray-500 mb-4">
            Hvala za vase narocilo. Kmet bo prejel obvestilo in stopil v stik z vami.
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-gray-500">
              Narocilo #{order.id.slice(-8).toUpperCase()}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {/* Order details */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Podrobnosti narocila</h2>

          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase">
                <th className="pb-3">Izdelek</th>
                <th className="pb-3">Kmetija</th>
                <th className="pb-3 text-right">Kolicina</th>
                <th className="pb-3 text-right">Cena</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items?.map((item: any) => (
                <tr key={item.id}>
                  <td className="py-3 text-sm text-gray-900">{item.productName}</td>
                  <td className="py-3 text-sm text-gray-500">{item.farmName}</td>
                  <td className="py-3 text-sm text-gray-900 text-right">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="py-3 text-sm font-medium text-gray-900 text-right">
                    {(item.price * item.quantity).toFixed(2)} EUR
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200">
                <td colSpan={3} className="pt-3 text-sm font-semibold text-gray-900">Skupaj</td>
                <td className="pt-3 text-right font-bold text-green-700">
                  {order.totalAmount.toFixed(2)} EUR
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Delivery info */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Podatki za dostavo</h2>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="text-gray-500 w-28 flex-shrink-0">Naslov:</span>
              <span className="text-gray-900">{order.deliveryAddress}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-28 flex-shrink-0">Mesto:</span>
              <span className="text-gray-900">
                {order.deliveryPostal} {order.deliveryCity}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-28 flex-shrink-0">Telefon:</span>
              <span className="text-gray-900">{order.phone}</span>
            </div>
            {order.notes && (
              <div className="flex gap-2">
                <span className="text-gray-500 w-28 flex-shrink-0">Opombe:</span>
                <span className="text-gray-900 italic">{order.notes}</span>
              </div>
            )}
            <div className="flex gap-2">
              <span className="text-gray-500 w-28 flex-shrink-0">Datum:</span>
              <span className="text-gray-900">
                {new Date(order.createdAt).toLocaleDateString('sl-SI', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/orders"
            className="flex-1 bg-green-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Moja narocila
          </Link>
          <Link
            href="/products"
            className="flex-1 bg-white text-gray-700 text-center py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition"
          >
            Nadaljuj z nakupovanjem
          </Link>
        </div>
      </div>
    </main>
  )
}
