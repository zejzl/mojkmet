'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { getErrorMessage } from '@/lib/errors'

interface PaymentResult {
  payment: {
    paymentRef: string
    amountCents: number
    currency: string
    status: string
    paidAt: string | null
  }
  order: {
    id: string
    status: string
    paymentStatus: string
  }
}

function PaymentResultContent() {
  const { status: sessionStatus } = useSession()
  const searchParams = useSearchParams()

  const orderId = searchParams.get('order') || ''
  const statusParam = searchParams.get('status') || ''
  const refParam = searchParams.get('ref') || ''

  const [result, setResult] = useState<PaymentResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (sessionStatus === 'loading') return
    if (sessionStatus === 'unauthenticated') {
      window.location.href = `/login?redirect=${encodeURIComponent(`/payment/result?order=${orderId}`)}`
      return
    }
    if (!orderId || !refParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('Zmanjkalo je informacij o plačilu.')
      setLoading(false)
      return
    }

    fetch(`/api/payments/status?ref=${encodeURIComponent(refParam)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setResult(data)
      })
      .catch((err) => setError(getErrorMessage(err, 'Napaka pri preverjanju plačila')))
      .finally(() => setLoading(false))
  }, [sessionStatus, orderId, refParam])

  if (sessionStatus === 'loading' || loading) {
    return (
      <main className="flex-grow bg-gray-50 py-16 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  const providerStatus = statusParam || result?.payment.status || ''
  const paid = providerStatus === 'success' || providerStatus === 'paid' ||
    result?.order.paymentStatus === 'PAID'
  const cancelled = providerStatus === 'cancelled' || result?.payment.status === 'cancelled'
  const expired = providerStatus === 'expired' || result?.payment.status === 'expired'

  if (error) {
    return (
      <main className="flex-grow bg-gray-50 py-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-md p-10">
            <span className="text-5xl block mb-4">⚠️</span>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Plačilo ni preverljivo</h1>
            <p className="text-gray-500 mb-6">{error}</p>
            <Link
              href="/dashboard/orders"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Moja naročila
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-grow bg-gray-50 py-16">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-md p-10">
          {paid ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Plačilo je uspelo!</h1>
              <p className="text-gray-500 mb-4">
                Hvala za vaše naročilo. Kmet ga bo sprejel in pripravil za prevzem.
              </p>
              {result?.payment.paymentRef && (
                <p className="text-xs text-gray-400 mb-6">
                  Plačilo: {result.payment.paymentRef}
                </p>
              )}
              <Link
                href={`/order-confirmation/${orderId}`}
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition w-full"
              >
                Poglej naročilo
              </Link>
            </>
          ) : cancelled ? (
            <>
              <span className="text-5xl block mb-4">🚫</span>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Plačilo je bilo preklicano</h1>
              <p className="text-gray-500 mb-4">
                Plačilo naročila {orderId.slice(-6).toUpperCase()} ni bilo izvedeno. Zaloga je bila sproščena.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/cart"
                  className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                >
                  Nazaj na košarico
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition"
                >
                  Moja naročila
                </Link>
              </div>
            </>
          ) : expired ? (
            <>
              <span className="text-5xl block mb-4">⏳</span>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Plačilni rok je potekel</h1>
              <p className="text-gray-500 mb-4">
                Termin za plačilo naročila je potekel in zaloga je bila sproščena. Po želji oddajte naročilo znova.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/cart"
                  className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                >
                  Nazaj na košarico
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition"
                >
                  Moja naročila
                </Link>
              </div>
            </>
          ) : (
            <>
              <span className="text-5xl block mb-4">❓</span>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Status plačila ni znan</h1>
              <p className="text-gray-500 mb-4">
                Plačilo še ni potrjeno. Preverite lahko svoja naročila.
              </p>
              <Link
                href="/dashboard/orders"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition w-full"
              >
                Moja naročila
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-grow bg-gray-50 py-16 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </main>
      }
    >
      <PaymentResultContent />
    </Suspense>
  )
}