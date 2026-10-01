'use client'

import { getErrorMessage } from '@/lib/errors'
import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart, CartItem } from '@/lib/cart-context'

interface FarmGroup {
  farmId: string
  farmName: string
  items: CartItem[]
  total: number
}

interface PickupSlot {
  id: string
  start: string
  end: string
  startTime: string
  endTime: string
}

interface FarmMeta {
  id: string
  name: string
  minOrder: number | null
  hasWindows: boolean
}

function SlotPicker({
  slots,
  selected,
  onSelect,
}: {
  slots: PickupSlot[]
  selected: PickupSlot | null
  onSelect: (slot: PickupSlot) => void
}) {
  const groups = useMemo(() => {
    const map = new Map<string, PickupSlot[]>()
    for (const slot of slots) {
      const d = new Date(slot.start)
      const key = d.toDateString()
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(slot)
    }
    return Array.from(map.entries())
  }, [slots])

  return (
    <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
      {groups.map(([key, group]) => {
        const date = new Date(group[0].start)
        const label = date.toLocaleString('sl-SI', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })
        return (
          <div key={key}>
            <p className="text-sm font-semibold text-gray-900 capitalize mb-2">{label}</p>
            <div className="flex flex-wrap gap-2">
              {group.map((slot) => {
                const isSelected = selected?.id === slot.id
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => onSelect(slot)}
                    aria-pressed={isSelected}
                    aria-label={`${label}, ${slot.startTime} do ${slot.endTime}`}
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

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items, removeItems } = useCart()

  const [formData, setFormData] = useState({
    phone: '',
    notes: '',
  })

  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [slots, setSlots] = useState<PickupSlot[]>([])
  const [farmMeta, setFarmMeta] = useState<FarmMeta | null>(null)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<PickupSlot | null>(null)

  const farmGroups = useMemo(() => {
    const groups = new Map<string, FarmGroup>()
    for (const item of items) {
      const existing = groups.get(item.farmId)
      if (existing) {
        existing.items.push(item)
        existing.total += item.price * item.quantity
      } else {
        groups.set(item.farmId, {
          farmId: item.farmId,
          farmName: item.farmName,
          items: [item],
          total: item.price * item.quantity,
        })
      }
    }
    return Array.from(groups.values())
  }, [items])

  const activeGroup =
    farmGroups.find((g) => g.farmId === selectedFarmId) ||
    farmGroups.reduce((a, b) => (b.items.length > a.items.length ? b : a), farmGroups[0])

  const total = activeGroup?.total ?? 0
  // The farm whose pickup slots we show: the radio choice for multi-farm carts, otherwise the
  // only farm in the cart. (Keying the effect on selectedFarmId alone never loaded slots for
  // single-farm carts, because nothing sets it there.)
  const activeFarmId = activeGroup?.farmId ?? null

  const belowMin =
    farmMeta?.minOrder != null && activeGroup != null && activeGroup.total < farmMeta.minOrder

  useEffect(() => {
    if (!activeFarmId) return
    setSlotsLoading(true)
    setSlotsError('')
    setSelectedSlot(null)
    setSlots([])
    setFarmMeta(null)
    fetch(`/api/farms/${activeFarmId}/pickup-slots?days=14`)
      .then(async (r) => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.error || 'Napaka pri nalaganju terminov')
        setFarmMeta({
          id: data.farm.id,
          name: data.farm.name,
          minOrder: data.farm.minOrder,
          hasWindows: data.farm.hasWindows,
        })
        setSlots(data.slots || [])
      })
      .catch((err) => setSlotsError(err instanceof Error ? err.message : 'Napaka'))
      .finally(() => setSlotsLoading(false))
  }, [activeFarmId])

  // Ce kosarica je prazna, preusmeri
  if (items.length === 0 && status !== 'loading') {
    return (
      <main className="flex-grow bg-gray-50 py-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-md p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Košarica je prazna</h2>
            <Link
              href="/products"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Pojdi na izdelke
            </Link>
          </div>
        </div>
      </main>
    )
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!session) {
      router.push('/login?redirect=/checkout')
      return
    }

    if (!activeGroup) {
      setError('Košarica je prazna.')
      return
    }

    if (!selectedSlot) {
      setError('Izberite termin prevzema.')
      return
    }

    if (farmMeta?.minOrder != null && activeGroup.total < farmMeta.minOrder) {
      setError(
        `Minimalna vrednost naročila za ${farmMeta.name} je ${farmMeta.minOrder.toFixed(2)} EUR.`
      )
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: activeGroup.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          pickupStartsAt: new Date(selectedSlot.start).toISOString(),
          pickupEndsAt: new Date(selectedSlot.end).toISOString(),
          phone: formData.phone,
          notes: formData.notes || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Napaka pri oddaji naročila')
      }

      // Other farms' items stay in the cart (the summary tells the customer so)
      await removeItems(activeGroup.items.map((item) => item.productId))

      if (data.paymentUrl) {
        // Preusmeri na gostiteljsko plačilno stran ponudnika; po plačilu
        // ponudnik preusmeri nazaj na /payment/result?order=...
        window.location.href = data.paymentUrl
        return
      }

      router.push(`/order-confirmation/${data.orderId}`)
    } catch (err) {
      setError(getErrorMessage(err, 'Napaka pri oddaji naročila'))
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <main className="flex-grow bg-gray-50 py-16 flex items-center justify-center">
        <div
          role="status"
          aria-label="Nalaganje"
          className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"
        />
      </main>
    )
  }

  return (
    <main className="flex-grow bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Blagajna</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            {!session && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-amber-800">
                  Za dokončanje naročila se morate{' '}
                  <Link
                    href="/login?redirect=/checkout"
                    className="font-semibold underline hover:text-amber-900"
                  >
                    prijaviti
                  </Link>{' '}
                  ali{' '}
                  <Link href="/register" className="font-semibold underline hover:text-amber-900">
                    registrirati
                  </Link>
                  .
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-sm p-6 space-y-6 border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-900">Prevzem</h2>

              {error && (
                <div
                  role="alert"
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </div>
              )}

              {farmGroups.length > 1 && (
                <fieldset>
                  <legend className="block text-sm font-medium text-gray-700 mb-2">
                    Izberite kmetijo (naročilo vsebuje izdelke iz več kmetij)
                  </legend>
                  <div className="space-y-2">
                    {farmGroups.map((group) => (
                      <label
                        key={group.farmId}
                        className={`flex items-center justify-between gap-3 border rounded-lg px-4 py-3 cursor-pointer transition ${
                          activeGroup?.farmId === group.farmId
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="farm"
                            checked={activeGroup?.farmId === group.farmId}
                            onChange={() => setSelectedFarmId(group.farmId)}
                            className="accent-green-600"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {group.farmName}
                          </span>
                        </span>
                        <span className="text-sm text-gray-600">
                          {group.items.reduce((s, i) => s + i.quantity, 0)} izd. ·{' '}
                          {group.total.toFixed(2)} EUR
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {farmGroups.length === 1 && activeGroup && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700">
                  Prevzem pri:{' '}
                  <span className="font-medium text-gray-900">{activeGroup.farmName}</span>
                </div>
              )}

              <div role="group" aria-labelledby="slot-heading">
                <p id="slot-heading" className="block text-sm font-medium text-gray-700 mb-2">
                  Termin prevzema *
                </p>

                {slotsLoading && (
                  <div className="py-3 text-sm text-gray-600" role="status">
                    Nalagam termine…
                  </div>
                )}

                {!slotsLoading && slotsError && (
                  <div
                    role="alert"
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                  >
                    {slotsError}
                  </div>
                )}

                {!slotsLoading && !slotsError && farmMeta && !farmMeta.hasWindows && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm">
                    Kmetija še ni objavila prevzemnih terminov. Naročila trenutno ni mogoče oddati.
                  </div>
                )}

                {!slotsLoading &&
                  !slotsError &&
                  farmMeta &&
                  farmMeta.hasWindows &&
                  slots.length === 0 && (
                    <div className="py-3 text-sm text-gray-600">
                      V naslednjih 14 dneh ni prostih terminov.
                    </div>
                  )}

                {!slotsLoading && !slotsError && farmMeta?.hasWindows && slots.length > 0 && (
                  <SlotPicker slots={slots} selected={selectedSlot} onSelect={setSelectedSlot} />
                )}

                {farmMeta?.minOrder != null &&
                  activeGroup &&
                  activeGroup.total < farmMeta.minOrder && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm mt-3">
                      Minimalna vrednost naročila za {farmMeta.name} je{' '}
                      {farmMeta.minOrder.toFixed(2)} EUR.
                    </div>
                  )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+386 41 123 456"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Opombe (neobvezno)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Posebne želje glede prevzema..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Način plačila</p>
                  <p className="text-sm text-gray-600">Spletno plačilo s kartico</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !session || !selectedSlot || belowMin}
                  className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {submitting
                    ? 'Oddajam naročilo...'
                    : !session
                      ? 'Prijavite se za nakup'
                      : `Plačaj ${total.toFixed(2)} EUR`}
                </button>
                {session && !selectedSlot && !submitting && (
                  <p className="mt-2 text-center text-sm text-gray-600">
                    Izberite termin prevzema, da lahko oddate naročilo.
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Povzetek naročila</h2>

              {farmGroups.length > 1 && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
                  V košarici imate izdelke iz več kmetij. Izberite eno kmetijo za naročilo; ostalo
                  ostane v košarici.
                </p>
              )}

              <div className="space-y-3 mb-4">
                {(activeGroup?.items ?? []).map((item) => (
                  <div key={item.productId} className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded bg-green-50 flex items-center justify-center text-base flex-shrink-0">
                      {item.categoryIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-600">
                        {item.quantity} x {item.price.toFixed(2)} EUR
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                      {(item.price * item.quantity).toFixed(2)} EUR
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Kmetija</span>
                  <span>{activeGroup?.farmName ?? '—'}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Vmesni seštevek</span>
                  <span>{total.toFixed(2)} EUR</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-200">
                  <span>Skupaj</span>
                  <span className="text-green-700">{total.toFixed(2)} EUR</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href="/cart"
                  className="text-sm text-gray-600 hover:text-green-700 transition"
                >
                  Uredi košarico
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
