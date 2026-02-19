'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import OrderStatusBadge from '@/components/dashboard/OrderStatusBadge'
import PageHeader from '@/components/dashboard/PageHeader'

const STATUS_TRANSITIONS: Record<string, { value: string; label: string }[]> = {
  PENDING: [
    { value: 'CONFIRMED', label: 'Potrdi' },
    { value: 'CANCELLED', label: 'Preklic' },
  ],
  CONFIRMED: [
    { value: 'PREPARING', label: 'Zacel pripravo' },
    { value: 'CANCELLED', label: 'Preklic' },
  ],
  PREPARING: [
    { value: 'READY', label: 'Pripravljeno' },
  ],
  READY: [
    { value: 'DELIVERED', label: 'Dostavljeno' },
  ],
  DELIVERED: [],
  CANCELLED: [],
}

export default function FarmerOrdersPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.role !== 'FARMER') {
      router.replace('/dashboard')
      return
    }

    fetch('/api/dashboard/orders')
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [session, router])

  async function handleStatusUpdate(orderId: string, newStatus: string) {
    setUpdatingId(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        )
      }
    } catch (err) {
      console.error('Status update error:', err)
    } finally {
      setUpdatingId(null)
    }
  }

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
      <PageHeader title="Prejeta narocila" description="Narocila, ki vsebujejo vase izdelke" />

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Se nimate prejetih narocil</h3>
          <p className="text-gray-500 mt-2">Ko kupci narocijo vase izdelke, se bodo pojavili tukaj.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const transitions = STATUS_TRANSITIONS[order.status] || []
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {order.buyer?.name || order.buyer?.email || 'Kupec'} &mdash;{' '}
                      <span className="text-gray-500 font-normal">
                        #{order.id.slice(-6).toUpperCase()}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {order.items?.length || 0} {order.items?.length === 1 ? 'izdelek' : 'izdelkov'} &middot;{' '}
                      {new Date(order.createdAt).toLocaleDateString('sl-SI', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
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
                  <div className="px-6 pb-5 border-t border-gray-100 space-y-4">
                    {/* Order items */}
                    <table className="w-full mt-4">
                      <thead>
                        <tr className="text-left text-xs text-gray-500 uppercase">
                          <th className="pb-2">Izdelek</th>
                          <th className="pb-2 text-right">Kolicina</th>
                          <th className="pb-2 text-right">Cena</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {order.items?.map((item: any) => (
                          <tr key={item.id}>
                            <td className="py-2 text-sm text-gray-900">{item.productName}</td>
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

                    {/* Delivery info */}
                    {order.deliveryAddress && (
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 uppercase font-medium mb-1">Dostava</p>
                        <p className="text-sm text-gray-900">
                          {order.deliveryAddress}, {order.deliveryCity}
                        </p>
                        {order.phone && (
                          <p className="text-sm text-gray-500 mt-0.5">{order.phone}</p>
                        )}
                        {order.notes && (
                          <p className="text-sm text-gray-500 mt-1 italic">{order.notes}</p>
                        )}
                      </div>
                    )}

                    {/* Status actions */}
                    {transitions.length > 0 && (
                      <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                        <span className="text-xs text-gray-500 mr-1">Posodobi status:</span>
                        {transitions.map((t) => (
                          <button
                            key={t.value}
                            onClick={() => handleStatusUpdate(order.id, t.value)}
                            disabled={updatingId === order.id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                              t.value === 'CANCELLED'
                                ? 'border border-red-300 text-red-600 hover:bg-red-50'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {updatingId === order.id ? '...' : t.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
