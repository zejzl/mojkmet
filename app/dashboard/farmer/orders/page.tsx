'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import OrderStatusBadge from '@/components/dashboard/OrderStatusBadge'
import PageHeader from '@/components/dashboard/PageHeader'
import type { Order, OrderStatus } from '@/types/api'

const STATUS_TRANSITIONS: Record<OrderStatus, { value: OrderStatus; label: string }[]> = {
  AWAITING_PAYMENT: [],
  PAID: [{ value: 'ACCEPTED', label: 'Sprejmi naročilo' }],
  ACCEPTED: [{ value: 'READY', label: 'Pripravljeno' }],
  READY: [{ value: 'COLLECTED', label: 'Prevzeto' }],
  COLLECTED: [],
  COMPLETED: [],
  CANCELLED: [],
  REFUNDED: [],
}

interface PickupSlot {
  id: string
  start: string
  end: string
  startTime: string
  endTime: string
}

function ProposeSlots({
  slots,
  selected,
  onSelect,
}: {
  slots: PickupSlot[]
  selected: PickupSlot | null
  onSelect: (slot: PickupSlot) => void
}) {
  const groups = new Map<string, PickupSlot[]>()
  for (const slot of slots) {
    const d = new Date(slot.start)
    const key = d.toDateString()
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(slot)
  }
  return (
    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
      {Array.from(groups.entries()).map(([key, group]) => {
        const label = new Date(group[0].start).toLocaleString('sl-SI', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })
        return (
          <div key={key}>
            <p className="text-sm font-semibold text-gray-900 capitalize mb-1.5">{label}</p>
            <div className="flex flex-wrap gap-2">
              {group.map((slot) => {
                const isSelected = selected?.id === slot.id
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => onSelect(slot)}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                      isSelected
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-700'
                    }`}
                  >
                    {slot.startTime}–{slot.endTime}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function FarmerOrdersPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [responding, setResponding] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')

  const [proposeFor, setProposeFor] = useState<string | null>(null)
  const [proposalSlots, setProposalSlots] = useState<PickupSlot[]>([])
  const [proposalLoading, setProposalLoading] = useState(false)
  const [proposalSelected, setProposalSelected] = useState<PickupSlot | null>(null)
  const [proposalReason, setProposalReason] = useState('')
  const [proposing, setProposing] = useState(false)
  const [proposalError, setProposalError] = useState('')

  const loadOrders = () => {
    fetch('/api/dashboard/orders')
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (session?.user?.role !== 'FARMER') {
      router.replace('/dashboard')
      return
    }

    loadOrders()
  }, [session, router])

  const formatSlot = (value?: string | Date | null) => {
    if (!value) return null
    return new Date(value).toLocaleString('sl-SI', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const respondChange = async (
    orderId: string,
    changeId: string,
    action: 'ACCEPT' | 'REJECT' | 'CANCEL'
  ) => {
    setResponding(changeId)
    setActionError('')
    try {
      const res = await fetch(`/api/orders/${orderId}/pickup-changes/${changeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Napaka pri odzivu')
      loadOrders()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Napaka')
    } finally {
      setResponding(null)
    }
  }

  const togglePropose = (order: Order) => {
    setProposalError('')
    if (proposeFor === order.id) {
      setProposeFor(null)
      setProposalSelected(null)
      setProposalReason('')
      return
    }
    if (!order.farmId) return
    setProposeFor(order.id)
    setProposalSlots([])
    setProposalSelected(null)
    setProposalReason('')
    setProposalLoading(true)
    fetch(`/api/farms/${order.farmId}/pickup-slots?days=14`)
      .then(async (r) => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.error || 'Napaka pri nalaganju terminov')
        setProposalSlots(data.slots || [])
      })
      .catch((err) => setProposalError(err instanceof Error ? err.message : 'Napaka'))
      .finally(() => setProposalLoading(false))
  }

  const submitProposal = async (order: Order) => {
    if (!proposalSelected) {
      setProposalError('Izberite termin.')
      return
    }
    setProposing(true)
    setProposalError('')
    try {
      const res = await fetch('/api/orders/pickup-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          requestedBy: 'FARMER',
          proposedStart: new Date(proposalSelected.start).toISOString(),
          proposedEnd: new Date(proposalSelected.end).toISOString(),
          reason: proposalReason || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Napaka pri oddaji predloga')
      setProposeFor(null)
      setProposalSelected(null)
      setProposalReason('')
      loadOrders()
    } catch (err) {
      setProposalError(err instanceof Error ? err.message : 'Napaka')
    } finally {
      setProposing(false)
    }
  }

  async function handleStatusUpdate(orderId: string, newStatus: OrderStatus) {
    setUpdatingId(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
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
      <PageHeader title="Prejeta naročila" description="Naročila, ki vsebujejo vaše izdelke" />

      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
          {actionError}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Se nimate prejetih naročil</h3>
          <p className="text-gray-500 mt-2">
            Ko kupci narocijo vaše izdelke, se bodo pojavili tukaj.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const transitions = STATUS_TRANSITIONS[order.status] || []
            const pendingChange = order.activePickupChange
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
                      {order.items?.length || 0}{' '}
                      {order.items?.length === 1 ? 'izdelek' : 'izdelkov'} &middot;{' '}
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
                      {order.subtotal.toFixed(2)} EUR
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {pendingChange && (
                  <div className="px-6 py-4 bg-amber-50 border-t border-amber-200">
                    {pendingChange.requestedBy === 'CONSUMER' &&
                    pendingChange.status === 'PROPOSED' ? (
                      <>
                        <p className="text-sm text-amber-900 mb-2">
                          <span className="font-semibold">Kupec predlaga nov termin:</span>{' '}
                          {formatSlot(pendingChange.currentStart) || 'določen pozneje'} →{' '}
                          <span className="font-medium">
                            {formatSlot(pendingChange.proposedStart)}
                          </span>
                        </p>
                        {pendingChange.reason && (
                          <p className="text-sm text-amber-800 mb-2 italic">
                            &ldquo;{pendingChange.reason}&rdquo;
                          </p>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              respondChange(order.id, pendingChange.id, 'ACCEPT')
                            }
                            disabled={responding === pendingChange.id}
                            className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                          >
                            Sprejmi
                          </button>
                          <button
                            onClick={() =>
                              respondChange(order.id, pendingChange.id, 'REJECT')
                            }
                            disabled={responding === pendingChange.id}
                            className="px-4 py-1.5 bg-white border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition disabled:opacity-50"
                          >
                            Zavrni
                          </button>
                        </div>
                      </>
                    ) : pendingChange.requestedBy === 'FARMER' &&
                      pendingChange.status === 'PROPOSED' ? (
                      <>
                        <p className="text-sm text-amber-900 mb-2">
                          <span className="font-semibold">Vaš predlog čaka:</span>{' '}
                          {formatSlot(pendingChange.currentStart) || 'določen pozneje'} →{' '}
                          <span className="font-medium">
                            {formatSlot(pendingChange.proposedStart)}
                          </span>
                        </p>
                        <button
                          onClick={() =>
                            respondChange(order.id, pendingChange.id, 'CANCEL')
                          }
                          disabled={responding === pendingChange.id}
                          className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                        >
                          Prekliči predlog
                        </button>
                      </>
                    ) : null}
                  </div>
                )}

                {expandedOrder === order.id && (
                  <div className="px-6 pb-5 border-t border-gray-100 space-y-4">
                    {/* Order items */}
                    <table className="w-full mt-4">
                      <thead>
                        <tr className="text-left text-xs text-gray-500 uppercase">
                          <th className="pb-2">Izdelek</th>
                          <th className="pb-2 text-right">Količina</th>
                          <th className="pb-2 text-right">Cena</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {order.items?.map((item) => (
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

                    {/* Pickup info */}
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Prevzem</p>
                      <p className="text-sm text-gray-900">
                        {order.pickupStartsAt
                          ? new Date(order.pickupStartsAt).toLocaleString('sl-SI', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Po dogovoru'}
                      </p>
                      {order.phone && (
                        <p className="text-sm text-gray-500 mt-0.5">{order.phone}</p>
                      )}
                      {order.notes && (
                        <p className="text-sm text-gray-500 mt-1 italic">{order.notes}</p>
                      )}
                    </div>

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

                    {/* Slot change proposal */}
                    {!pendingChange && (
                      <div className="pt-3 border-t border-gray-100">
                        <button
                          onClick={() => togglePropose(order)}
                          className="text-sm font-medium text-green-700 hover:text-green-900"
                        >
                          {proposeFor === order.id ? 'Skrij' : '+ Predlagaj nov termin'}
                        </button>

                        {proposeFor === order.id && (
                          <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                            {proposalError && (
                              <p className="text-sm text-red-600">{proposalError}</p>
                            )}
                            {proposalLoading ? (
                              <p className="text-sm text-gray-500">Nalagam termine…</p>
                            ) : proposalSlots.length === 0 ? (
                              <p className="text-sm text-gray-500">
                                V naslednjih 14 dneh ni razpoložljivih terminov.
                              </p>
                            ) : (
                              <>
                                <ProposeSlots
                                  slots={proposalSlots}
                                  selected={proposalSelected}
                                  onSelect={setProposalSelected}
                                />
                                <textarea
                                  rows={2}
                                  value={proposalReason}
                                  onChange={(e) => setProposalReason(e.target.value)}
                                  placeholder="Razlog (neobvezno)"
                                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => submitProposal(order)}
                                    disabled={proposing}
                                    className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                                  >
                                    {proposing ? 'Pošiljam...' : 'Pošlji predlog'}
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
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
