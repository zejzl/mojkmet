'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Napaka pri prijavi')
      }

      setSubscribed(true)
      setEmail('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center transform hover:scale-105 transition-all duration-300">
          <div className="text-7xl mb-6 animate-bounce">🚀</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pridružite se listi čakanja
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Bodite med prvimi, ki boste prejeli obvestilo o odprtju platforme. 
            Ekskluzivne ponudbe za prve uporabnike! 🎁
          </p>

          {subscribed ? (
            <div className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-8 py-6 rounded-2xl inline-flex items-center gap-3 text-lg font-semibold">
              <span className="text-3xl">✓</span>
              Hvala! Na listi ste. Kmalu vas obvestimo o odprtju.
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vaš@email.si"
                    required
                    disabled={loading}
                    className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-10 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {loading ? 'Pošiljanje...' : 'Pridruži se 🌟'}
                  </button>
                </div>
              </form>
              
              {error && (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Brez spam-a
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Ekskluzivne ugodnosti
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Zgodnji dostop
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
