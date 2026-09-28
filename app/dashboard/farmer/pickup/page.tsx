'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/dashboard/PageHeader'

export interface PickupWindowRow {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  active: boolean
}

const DAY_NAMES = ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota']

export default function PickupPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [windows, setWindows] = useState<PickupWindowRow[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [form, setForm] = useState({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' })

  useEffect(() => {
    if (session?.user?.role !== 'FARMER') {
      router.replace('/dashboard')
      return
    }
    loadWindows()
  }, [session, router])

  const loadWindows = () => {
    fetch('/api/dashboard/pickup-windows')
      .then((r) => r.json())
      .then((data) => setWindows(data.windows || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const addWindow = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    setMessage({ type: '', text: '' })
    try {
      const res = await fetch('/api/dashboard/pickup-windows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setWindows([...windows, data.window].sort((a, b) => a.dayOfWeek - b.dayOfWeek))
      setMessage({ type: 'success', text: 'Termin dodan.' })
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Napaka' })
    } finally {
      setAdding(false)
    }
  }

  const toggleActive = async (w: PickupWindowRow) => {
    try {
      const res = await fetch(`/api/dashboard/pickup-windows/${w.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !w.active }),
      })
      if (res.ok) {
        setWindows(windows.map((x) => (x.id === w.id ? { ...x, active: !w.active } : x)))
      }
    } catch (error) {
      console.error('Toggle error:', error)
    }
  }

  const deleteWindow = async (id: string) => {
    if (!confirm('Ali ste prepričani, da želite izbrisati ta termin?')) return
    try {
      const res = await fetch(`/api/dashboard/pickup-windows/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setWindows(windows.filter((w) => w.id !== id))
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Prevzemni termini"
        description="Kateri dnevi in ure so kupcem na voljo za prevzem"
      />

      <div className="max-w-3xl space-y-6">
        {message.text && (
          <div
            className={`px-4 py-3 rounded text-sm ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Add form */}
        <form onSubmit={addWindow} className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Dodaj termin</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">
                Dan *
              </label>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                value={form.dayOfWeek}
                onChange={(e) => setForm({ ...form, dayOfWeek: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              >
                {DAY_NAMES.map((name, i) => (
                  <option key={i} value={i}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                Od *
              </label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                required
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                Do *
              </label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                required
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={adding}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? 'Dodajam...' : '+ Dodaj termin'}
          </button>
        </form>

        {/* List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {windows.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-5xl block mb-4">🕑</span>
              <h3 className="text-lg font-semibold text-gray-900">Se nimate prevzemnih terminov</h3>
              <p className="text-gray-500 mt-2">
                Brez termina kupci ne morejo dokončati naročila.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs text-gray-500 uppercase">
                  <th className="px-6 py-3">Dan</th>
                  <th className="px-6 py-3">Ura</th>
                  <th className="px-6 py-3 text-center">Aktiven</th>
                  <th className="px-6 py-3 text-right">Dejanja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {windows.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {DAY_NAMES[w.dayOfWeek]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {w.startTime} – {w.endTime}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleActive(w)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          w.active ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            w.active ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteWindow(w.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Izbriši
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}