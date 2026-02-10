'use client'

import { useState, useEffect } from 'react'
import OrderStatusBadge from '@/components/dashboard/OrderStatusBadge'
import PageHeader from '@/components/dashboard/PageHeader'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/dashboard/orders')
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Moja narocila" description="Pregled vseh vasih narocil" />

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <span className="text-5xl block mb-4">📦</span>
          <h3 className="text-lg font-semibold text-gray-900">Se nimate narocil</h3>
          <p className="text-gray-500 mt-2">Ko boste oddali narocilo, se bo pojavilo tukaj.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      Narocilo #{order.id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('sl-SI', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-sm font-semibold text-gray-900">
                    {order.totalAmount.toFixed(2)} EUR
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expandedOrder === order.id && (
                <div className="px-6 pb-4 border-t border-gray-100">
                  <table className="w-full mt-4">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 uppercase">
                        <th className="pb-2">Izdelek</th>
                        <th className="pb-2">Kmetija</th>
                        <th className="pb-2 text-right">Kolicina</th>
                        <th className="pb-2 text-right">Cena</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {order.items?.map((item: any) => (
                        <tr key={item.id}>
                          <td className="py-2 text-sm text-gray-900">{item.productName}</td>
                          <td className="py-2 text-sm text-gray-500">{item.farmName}</td>
                          <td className="py-2 text-sm text-gray-900 text-right">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="py-2 text-sm font-medium text-gray-900 text-right">
                            {(item.price * item.quantity).toFixed(2)} EUR
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
