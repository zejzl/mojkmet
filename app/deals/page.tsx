import Link from 'next/link';

export default function DealsPage() {
  const seasonalDeals = [
    {
      title: 'Pomladna zelenjava',
      discount: '20%',
      description: 'Sveža špinača, radič in solata iz Prekmurja',
      validUntil: '30. marec 2026',
      icon: '🥬',
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Kranjska klobasa',
      discount: '15%',
      description: 'Tradicionalna slovenška klobasa iz domačih kmetij',
      validUntil: '15. marec 2026',
      icon: '🌭',
      color: 'from-red-500 to-orange-600'
    },
    {
      title: 'Slovenski med',
      discount: '25%',
      description: 'Akacijev in gozdni med letošnje letine',
      validUntil: '31. marec 2026',
      icon: '🍯',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      title: 'Jajca iz proste reje',
      discount: '10%',
      description: 'Sveža jajca iz Štajerske - paket 30 kosov',
      validUntil: '25. marec 2026',
      icon: '🥚',
      color: 'from-orange-400 to-yellow-500'
    },
    {
      title: 'Bučno olje',
      discount: '30%',
      description: 'Prekmursko bučno olje - hladno stiskano',
      validUntil: '20. marec 2026',
      icon: '🫒',
      color: 'from-green-700 to-lime-600'
    },
    {
      title: 'Domači kruh',
      discount: '12%',
      description: 'Polnozrnati kruh z ajdo in orehi',
      validUntil: '28. marec 2026',
      icon: '🥖',
      color: 'from-amber-600 to-yellow-600'
    },
  ];

  const bundleDeals = [
    {
      name: 'Zajtrk paket',
      price: '24.99€',
      originalPrice: '32.00€',
      items: ['Mleko 2L', 'Jajca 10 kosov', 'Domač kruh', 'Maslo 250g'],
      icon: '🍳'
    },
    {
      name: 'Zelenjava paket',
      price: '18.99€',
      originalPrice: '25.00€',
      items: ['Solata', 'Paradižnik 1kg', 'Kumare 5 kosov', 'Paprika 500g'],
      icon: '🥗'
    },
    {
      name: 'Mesni paket',
      price: '45.99€',
      originalPrice: '59.00€',
      items: ['Piščanec 1.5kg', 'Goveja zarebrnica 1kg', 'Svinjska krača 1kg'],
      icon: '🥩'
    },
  ];

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sezonske ponudbe</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Najboljše cene za sveže kmetijske izdelke - samo še ta teden!
          </p>
        </div>
      </section>

      {/* Seasonal Deals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Akcijske ponudbe tedna</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {seasonalDeals.map((deal, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden">
                <div className={`bg-gradient-to-br ${deal.color} p-6 relative`}>
                  <div className="absolute top-4 right-4 bg-white text-green-700 font-bold px-4 py-2 rounded-full text-lg shadow-lg">
                    -{deal.discount}
                  </div>
                  <div className="text-6xl mb-2">{deal.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{deal.title}</h3>
                  <p className="text-gray-600 mb-4">{deal.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Velja do: {deal.validUntil}</span>
                  </div>
                  <Link href="/products" className="mt-4 block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition font-semibold">
                    Poglej ponudbo
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle Deals */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Paketi s popustom</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {bundleDeals.map((bundle, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="text-5xl mb-4 text-center">{bundle.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-center">{bundle.name}</h3>
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-green-600">{bundle.price}</span>
                  <span className="text-gray-400 line-through ml-2">{bundle.originalPrice}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {bundle.items.map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/products" className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition font-semibold">
                  Dodaj v košarico
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Ne zamudite nobene akcije!</h2>
            <p className="text-lg mb-6">
              Prijavite se na naše obvestilo in bodite prvi obveščeni o novih ponudbah in popustih.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Vaš e-mail naslov"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Prijavi se
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
