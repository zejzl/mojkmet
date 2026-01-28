import Link from 'next/link'

export default function FeaturedFarms() {
  const farms = [
    {
      id: 1,
      name: 'Kmetija Novak',
      location: 'Kranj, Gorenjska',
      products: 'Mleko, sir, jogurt',
      rating: 4.9,
      reviews: 42,
      verified: true,
      deliveryTime: '1-2 dni',
    },
    {
      id: 2,
      name: 'Ekološka kmetija Zupan',
      location: 'Maribor, Štajerska',
      products: 'Zelenjava, sadje, jajca',
      rating: 4.8,
      reviews: 38,
      verified: true,
      deliveryTime: '1 dan',
    },
    {
      id: 3,
      name: 'Čebelarstvo Košir',
      location: 'Ljubljana, Osrednjeslovenska',
      products: 'Med, matični mleček, propolis',
      rating: 5.0,
      reviews: 67,
      verified: true,
      deliveryTime: '2-3 dni',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Priljubljene kmetije
            </h2>
            <p className="text-xl text-gray-600">
              Odkrijte najboljše kmetije v vaši bližini
            </p>
          </div>
          <Link
            href="/farms"
            className="hidden md:inline-block text-green-600 hover:text-green-700 font-semibold"
          >
            Poglej vse →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {farms.map((farm) => (
            <Link
              key={farm.id}
              href={`/farms/${farm.id}`}
              className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition group"
            >
              {/* Farm Image */}
              <div className="h-48 bg-gradient-to-br from-green-200 to-amber-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-6xl">
                  🏡
                </div>
                {farm.verified && (
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verificirana
                  </div>
                )}
              </div>

              {/* Farm Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">
                  {farm.name}
                </h3>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {farm.location}
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {farm.products}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="font-semibold text-gray-900">{farm.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({farm.reviews})</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {farm.deliveryTime}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/farms"
            className="inline-block text-green-600 hover:text-green-700 font-semibold"
          >
            Poglej vse kmetije →
          </Link>
        </div>
      </div>
    </section>
  )
}
