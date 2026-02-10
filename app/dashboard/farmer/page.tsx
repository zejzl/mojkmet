'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import StatCard from '@/components/dashboard/StatCard'
import OrderStatusBadge from '@/components/dashboard/OrderStatusBadge'
import PageHeader from '@/components/dashboard/PageHeader'

export default function FarmerDashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.role !== 'FARMER') {
      router.replace('/dashboard')
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Pozdravljeni, ${session?.user?.name || 'kmet'}!`}
        description="Pregled vase kmetije"
        action={
          <Link
            href="/dashboard/farmer/products/new"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
          >
            + Dodaj izdelek
          </Link>
        }
      />

      {/* Farm setup prompt */}
      {stats && !stats.hasFarm && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <span className="text-3xl">🏡</span>
            <div>
              <h3 className="font-semibold text-amber-900">Nastavite svojo kmetijo</h3>
              <p className="text-sm text-amber-700 mt-1">
                Pred dodajanjem izdelkov morate najprej ustvariti profil kmetije.
              </p>
              <Link
                href="/dashboard/farmer/farm"
                className="mt-3 inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm font-medium"
              >
                Ustvari kmetijo
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Izdelki"
          value={stats?.products || 0}
          icon="🥬"
          color="green"
        />
        <StatCard
          label="Prejeta narocila"
          value={stats?.ordersReceived || 0}
          icon="📦"
          color="blue"
        />
        <StatCard
          label="Povprecna ocena"
          value={stats?.avgRating || '0.0'}
          icon="⭐"
          trend={`${stats?.reviewCount || 0} ocen`}
          color="amber"
        />
        <StatCard
          label="Skupni prihodek"
          value={`${(stats?.totalRevenue || 0).toFixed(2)} EUR`}
          icon="💰"
          color="green"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Zadnja narocila</h2>
          <Link href="/dashboard/farmer/orders" className="text-sm text-green-600 hover:text-green-700 font-medium">
            Vsa narocila →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Se nimate prejetih narocil</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order: any) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {order.buyer?.name || order.buyer?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.items?.length || 0} {order.items?.length === 1 ? 'izdelek' : 'izdelkov'} &middot;{' '}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/dashboard/farmer/farm" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group">
          <div className="flex items-center space-x-4">
            <span className="text-3xl">🏡</span>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-green-600 transition">Profil kmetije</p>
              <p className="text-sm text-gray-500">Uredite podatke kmetije</p>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/farmer/products" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group">
          <div className="flex items-center space-x-4">
            <span className="text-3xl">🥬</span>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-green-600 transition">Upravljaj izdelke</p>
              <p className="text-sm text-gray-500">Dodajaj, urejaj, brisi</p>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/farmer/orders" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group">
          <div className="flex items-center space-x-4">
            <span className="text-3xl">📦</span>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-green-600 transition">Narocila</p>
              <p className="text-sm text-gray-500">Upravljaj prejeta narocila</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
