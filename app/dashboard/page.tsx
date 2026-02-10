'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import StatCard from '@/components/dashboard/StatCard'
import OrderStatusBadge from '@/components/dashboard/OrderStatusBadge'
import PageHeader from '@/components/dashboard/PageHeader'

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.role === 'FARMER') {
      router.replace('/dashboard/farmer')
      return
    }

    Promise.all([
      fetch('/api/dashboard/stats').then((r) => r.json()),
      fetch('/api/dashboard/orders?limit=5').then((r) => r.json()),
    ])
      .then(([statsData, ordersData]) => {
        setStats(statsData)
        setOrders(ordersData.orders || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [session, router])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Pozdravljeni, ${session?.user?.name || 'kupec'}!`}
        description="Pregled vasega racuna in narocil"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Skupaj narocil"
          value={stats?.totalOrders || 0}
          icon="📦"
          color="green"
        />
        <StatCard
          label="Aktivna narocila"
          value={stats?.activeOrders || 0}
          icon="🚚"
          color="blue"
        />
        <StatCard
          label="Priljubljene"
          value={stats?.favorites || 0}
          icon="❤️"
          color="amber"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Zadnja narocila</h2>
          <Link href="/dashboard/orders" className="text-sm text-green-600 hover:text-green-700 font-medium">
            Vsa narocila →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Se nimate narocil</p>
            <Link href="/products" className="mt-4 inline-block text-green-600 hover:text-green-700 font-medium">
              Odkrijte izdelke →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order: any) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {order.items?.length || 0} {order.items?.length === 1 ? 'izdelek' : 'izdelkov'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('sl-SI')}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-sm font-semibold text-gray-900">
                    {order.totalAmount.toFixed(2)} EUR
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/products" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group">
          <div className="flex items-center space-x-4">
            <span className="text-3xl">🛒</span>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-green-600 transition">Brskajte po izdelkih</p>
              <p className="text-sm text-gray-500">Odkrijte sveze lokalne pridelke</p>
            </div>
          </div>
        </Link>
        <Link href="/farms" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group">
          <div className="flex items-center space-x-4">
            <span className="text-3xl">🏡</span>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-green-600 transition">Odkrijte kmetije</p>
              <p className="text-sm text-gray-500">Spoznajte nase kmete</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
