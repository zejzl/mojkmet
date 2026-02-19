'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items, getCartTotal, clearCart } = useCart()

  const [formData, setFormData] = useState({
    deliveryAddress: '',
    deliveryCity: '',
    deliveryPostal: '',
    phone: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const total = getCartTotal()

  // Ce kosarca je prazna, preusmeri
  if (items.length === 0 && status !== 'loading') {
    return (
      <main className="flex-grow bg-gray-50 py-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-md p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Kosarca je prazna</h2>
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

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          deliveryAddress: formData.deliveryAddress,
          deliveryCity: formData.deliveryCity,
          deliveryPostal: formData.deliveryPostal,
          phone: formData.phone,
          notes: formData.notes || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Napaka pri oddaji narocila')
      }

      // PLACEHOLDER: Stripe placilo bi bilo tukaj
      // await stripe.confirmPayment(...)

      clearCart()
      router.push(`/order-confirmation/${data.orderId}`)
    } catch (err: any) {
      setError(err.message || 'Napaka pri oddaji narocila')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <main className="flex-grow bg-gray-50 py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
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
                  Za dokoncanje narocila se morate{' '}
                  <Link href="/login?redirect=/checkout" className="font-semibold underline hover:text-amber-900">
                    prijaviti
                  </Link>
                  {' '}ali{' '}
                  <Link href="/register" className="font-semibold underline hover:text-amber-900">
                    registrirati
                  </Link>
                  .
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Podatki za dostavo</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Naslov dostave *
                </label>
                <input
                  id="deliveryAddress"
                  name="deliveryAddress"
                  type="text"
                  required
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  placeholder="Ulica in hisna stevilka"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="deliveryCity" className="block text-sm font-medium text-gray-700 mb-1">
                    Mesto *
                  </label>
                  <input
                    id="deliveryCity"
                    name="deliveryCity"
                    type="text"
                    required
                    value={formData.deliveryCity}
                    onChange={handleChange}
                    placeholder="Ljubljana"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="deliveryPostal" className="block text-sm font-medium text-gray-700 mb-1">
                    Postna stevilka *
                  </label>
                  <input
                    id="deliveryPostal"
                    name="deliveryPostal"
                    type="text"
                    required
                    value={formData.deliveryPostal}
                    onChange={handleChange}
                    placeholder="1000"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
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
                  placeholder="Posebne zelje za dostavo..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Nacin placila</p>
                  <p className="text-sm text-gray-500">
                    Placilo ob dostavi
                    {/* PLACEHOLDER: Stripe integracija bo dodana tukaj */}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !session}
                  className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {submitting
                    ? 'Oddajam narocilo...'
                    : !session
                    ? 'Prijavite se za nakup'
                    : `Placaj ${total.toFixed(2)} EUR`}
                </button>
              </div>
            </form>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Povzetek narocila</h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded bg-green-50 flex items-center justify-center text-base flex-shrink-0">
                      {item.categoryIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">
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
                  <span>Vmesni seštevek</span>
                  <span>{total.toFixed(2)} EUR</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Dostava</span>
                  <span>Po dogovoru</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-200">
                  <span>Skupaj</span>
                  <span className="text-green-700">{total.toFixed(2)} EUR</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href="/cart"
                  className="text-sm text-gray-500 hover:text-green-600 transition"
                >
                  Uredi kosarco
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
