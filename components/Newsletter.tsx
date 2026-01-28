'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add newsletter subscription logic
    setSubscribed(true)
    setEmail('')
  }

  return (
    <section className="py-20 bg-amber-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-6xl mb-6">📬</div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Ostanite obveščeni
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Prijavite se na naše novice in prejemite ekskluzivne ponudbe ter nove kmetije v vaši bližini
        </p>

        {subscribed ? (
          <div className="bg-green-100 text-green-800 px-6 py-4 rounded-lg inline-block">
            Hvala za prijavo! Kmalu boste prejeli naše novice.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Vnesite vaš e-naslov"
                required
                className="flex-1 px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition font-semibold whitespace-nowrap"
              >
                Prijavi se
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Nič spam-a. Odjava kadarkoli.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
