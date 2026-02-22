export default function DealsPage() {
  const currentDeals = [
    {
      title: 'Pomladne jagode',
      discount: '20%',
      description: 'Sveže pobrane jagode iz Štajerske',
      validUntil: '30. maj 2026',
      icon: '🍓',
      farm: 'Kmetija Novak',
    },
    {
      title: 'Kozji sir',
      discount: '15%',
      description: 'Tradicionalni kozji sir iz Gorenjske',
      validUntil: '15. maj 2026',
      icon: '🧀',
      farm: 'Kmetija Horvat',
    },
    {
      title: 'Ekološka zelenjava',
      discount: '25%',
      description: 'Paket sveže zelenjave za štiri osebe',
      validUntil: '20. maj 2026',
      icon: '🥬',
      farm: 'Bio kmetija Zupan',
    },
    {
      title: 'Domač kruh',
      discount: '10%',
      description: 'Sveže pečen kruh iz žitaric z naše njive',
      validUntil: '31. maj 2026',
      icon: '🍞',
      farm: 'Pekarna Kovač',
    },
  ];

  const seasonalDeals = [
    {
      season: 'Pomlad',
      items: 'Jagode, špargljii, črevi, mladi krompir',
      icon: '🌸',
    },
    {
      season: 'Poletje',
      items: 'Paradižnik, paprika, maline, breskvee',
      icon: '☀️',
    },
    {
      season: 'Jesen',
      items: 'Jabolka, grozdje, buče, orehi',
      icon: '🍂',
    },
    {
      season: 'Zima',
      items: 'Zelje, korenček, repo, shranjena zelenjava',
      icon: '❄️',
    },
  ];

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Posebne ponudbe</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Odkrijte tedenske popuste in sezonske akcije naših kmetij
          </p>
        </div>
      </section>

      {/* Current Deals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Trenutne akcije</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {currentDeals.map((deal) => (
              <div 
                key={deal.title} 
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition border border-gray-200 relative"
              >
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{deal.discount}
                </div>
                <div className="text-5xl mb-4 text-center">{deal.icon}</div>
                <h3 className="text-xl font-bold mb-2">{deal.title}</h3>
                <p className="text-gray-600 mb-4">{deal.description}</p>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-sm text-green-600 font-semibold mb-2">{deal.farm}</p>
                  <p className="text-sm text-gray-500">
                    Velja do: <span className="font-semibold">{deal.validUntil}</span>
                  </p>
                </div>
                <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                  Poglej ponudbo
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Offers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Sezonske ponudbe</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Vsaka sezona prinaša svoje posebnosti. Sezonski izdelki so najbolj sveži in okusni.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {seasonalDeals.map((season) => (
              <div 
                key={season.season} 
                className="bg-white rounded-xl p-8 text-center shadow-md"
              >
                <div className="text-6xl mb-4">{season.icon}</div>
                <h3 className="text-xl font-bold mb-3">{season.season}</h3>
                <p className="text-gray-600">{season.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-green-50 rounded-xl p-8 border-2 border-green-200 text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-3xl font-bold mb-4">Bodite obveščeni o novih akcijah</h2>
            <p className="text-lg text-gray-700 mb-6">
              Prijavite se na naše obvestilo in kot prvi izveste za nove popuste in posebne ponudbe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Vaš e-naslov"
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition whitespace-nowrap">
                Prijavi se
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Kako delujejo popusti?</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Izberite akcijo</h3>
              <p className="text-gray-600">
                Prebrskajte trenutne popuste in posebne ponudbe
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Dodajte v košarico</h3>
              <p className="text-gray-600">
                Popust se samodejno uporabi pri nakupu
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Prihranite</h3>
              <p className="text-gray-600">
                Uživajte v kakovostnih izdelkih po nižji ceni
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ne zamudite odličnih ponudb!</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Nove akcije dodajamo vsak teden
          </p>
          <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
            Raziščite vse izdelke
          </button>
        </div>
      </section>
    </main>
  );
}
