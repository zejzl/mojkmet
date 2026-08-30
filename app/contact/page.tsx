'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSending(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Prišlo je do napake pri pošiljanju sporočila.')
        return
      }
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } catch {
      setError('Prišlo je do napake. Prosimo, poskusite ponovno.')
    } finally {
      setSending(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kontakt</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Imate vprašanje? Radi bi se pridružili? Pišite nam!
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Pošljite nam sporočilo</h2>

              {submitted && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                  Hvala za vaše sporočilo! Odgovorili vam bomo v najkrajšem možnem času.
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Ime in priimek *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Janez Novak"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    E-pošta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="janez@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Zadeva *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Izberite zadevo</option>
                    <option value="general">Splošno vprašanje</option>
                    <option value="farmer">Želim pridružiti kmetijo</option>
                    <option value="order">Vprašanje o naročilu</option>
                    <option value="technical">Tehnična podpora</option>
                    <option value="partnership">Poslovno sodelovanje</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Sporočilo *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    placeholder="Vaše sporočilo..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Pošiljanje...' : 'Pošlji sporočilo'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">Kontaktni podatki</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">📧</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">E-pošta</h3>
                      <p className="text-gray-600">
                        Splošna vprašanja:{' '}
                        <a href="mailto:info@mojkmet.eu" className="text-green-600 hover:underline">
                          info@mojkmet.eu
                        </a>
                        <br />
                        Podpora:{' '}
                        <a
                          href="mailto:podpora@mojkmet.eu"
                          className="text-green-600 hover:underline"
                        >
                          podpora@mojkmet.eu
                        </a>
                        <br />
                        Za kmete:{' '}
                        <a
                          href="mailto:kmeti@mojkmet.eu"
                          className="text-green-600 hover:underline"
                        >
                          kmeti@mojkmet.eu
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-md p-8">
                <h3 className="text-xl font-bold mb-3">Hitra podpora</h3>
                <p className="mb-4">
                  Pišite nam na podpora@mojkmet.eu in odgovorili vam bomo v najkrajšem možnem času.
                </p>
                <a
                  href="mailto:podpora@mojkmet.eu"
                  className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Napišite nam
                </a>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8">
                <h3 className="text-xl font-bold mb-3">Sledite nam</h3>
                <div className="flex gap-4">
                  <a href="#" className="text-4xl hover:scale-110 transition">
                    📘
                  </a>
                  <a href="#" className="text-4xl hover:scale-110 transition">
                    📷
                  </a>
                  <a href="#" className="text-4xl hover:scale-110 transition">
                    🐦
                  </a>
                  <a href="#" className="text-4xl hover:scale-110 transition">
                    💼
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
