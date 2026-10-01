import Link from 'next/link'
import DistanceBadge from '@/components/DistanceBadge'
import { getFarmsList } from '@/lib/catalog'
import { getErrorMessage } from '@/lib/errors'

// Always render fresh on the server: the list changes whenever a farm joins or a review lands.
export const dynamic = 'force-dynamic'

export default async function FarmsPage() {
  let farms: Awaited<ReturnType<typeof getFarmsList>>['farms'] = []
  let error: string | null = null

  try {
    farms = (await getFarmsList()).farms
  } catch (err) {
    error = getErrorMessage(
      err,
      'Kmetij ni bilo mogoče naložiti. Osvežite stran in poskusite znova.'
    )
  }

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Naše Kmetije</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Spoznajte lokalne kmete, ki pridelujejo vaša živila
          </p>
        </div>
      </section>

      {/* Farms Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
            >
              {error}
            </div>
          )}

          {!error && farms.length === 0 && (
            <div className="text-center text-gray-600">Trenutno ni aktivnih kmetij.</div>
          )}

          {!error && farms.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {farms.map((farm) => (
                <div
                  key={farm.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition border border-gray-200"
                >
                  <div className="bg-gradient-to-br from-green-50 to-green-100 h-48 flex items-center justify-center text-8xl relative">
                    {farm.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={farm.image}
                        alt={farm.name}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <span aria-hidden="true">🌾</span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{farm.name}</h3>
                      <div className="flex items-center text-amber-600">
                        <span className="mr-1" aria-hidden="true">
                          ⭐
                        </span>
                        <span className="font-semibold">{Number(farm.rating).toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">
                      <span aria-hidden="true">📍</span> {farm.city}{' '}
                      <DistanceBadge latitude={farm.latitude} longitude={farm.longitude} />
                    </p>
                    {farm.description && (
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{farm.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {farm.total_reviews} {farm.total_reviews === 1 ? 'ocena' : 'ocen'}
                      </span>
                      {farm.is_verified && (
                        <span className="text-green-700 text-sm font-medium">✓ Verificirano</span>
                      )}
                    </div>
                    <Link
                      href={`/farms/${farm.id}`}
                      className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition mt-4 text-center"
                    >
                      Obišči kmetijo
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ste kmet?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Pridružite se naši platformi in dosezite več strank neposredno
            </p>
            <Link
              href="/for-farmers"
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Registrirajte svojo kmetijo
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
