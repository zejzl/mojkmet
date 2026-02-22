export default function CategoriesPage() {
  const categories = [
    {
      name: 'Sadje',
      icon: '🍎',
      description: 'Sveže in sezonsko sadje neposredno iz sadovnjakov',
      examples: 'Jabolka, hruške, češnje, jagode, borovnice',
    },
    {
      name: 'Zelenjava',
      icon: '🥬',
      description: 'Lokalno pridelana zelenjava polna vitaminov',
      examples: 'Solata, paradižnik, kumara, paprika, korenje',
    },
    {
      name: 'Mlečni izdelki',
      icon: '🧀',
      description: 'Tradicionalni mlečni izdelki iz lokalnih kmetij',
      examples: 'Mleko, sir, jogurt, skuta, maslo',
    },
    {
      name: 'Meso',
      icon: '🥩',
      description: 'Kakovostno meso iz etične reje',
      examples: 'Govedina, svinjina, piščanec, divjačina',
    },
    {
      name: 'Pekovsko',
      icon: '🍞',
      description: 'Sveže pečen kruh in pecivo vsak dan',
      examples: 'Domač kruh, pecivo, pite, potica',
    },
    {
      name: 'Med',
      icon: '🍯',
      description: 'Naravni slovenski med iz čebeljih panjev',
      examples: 'Cvetlični, kostanjev, gozdni, akacijev med',
    },
    {
      name: 'Vino',
      icon: '🍷',
      description: 'Izbrana vina slovenskih vinogradov',
      examples: 'Belo, rdeče, rose, penina',
    },
    {
      name: 'Olja',
      icon: '🫒',
      description: 'Hladno stiskana olja in druge specialitete',
      examples: 'Bučno olje, olivno olje, oreškova olja',
    },
  ];

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kategorije izdelkov</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Raziščite pestro ponudbo lokalnih kmetijskih izdelkov
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {categories.map((category) => (
              <div 
                key={category.name} 
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition cursor-pointer border border-gray-200"
              >
                <div className="text-6xl mb-4 text-center">{category.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-center">{category.name}</h3>
                <p className="text-gray-600 mb-4 text-center">{category.description}</p>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    <span className="font-semibold">Primeri:</span> {category.examples}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Browse Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Kako iskati izdelke</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Izberite kategorijo</h3>
                <p className="text-gray-600">
                  Kliknite na kategorijo, ki vas zanima
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">Filtrirajte rezultate</h3>
                <p className="text-gray-600">
                  Uporabite filtre za regijo, ceno ali kmetijo
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Dodajte v košarico</h3>
                <p className="text-gray-600">
                  Izberite želene izdelke in naročite
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal Highlight */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-green-50 rounded-xl p-8 border-2 border-green-200">
            <div className="text-center mb-6">
              <span className="text-4xl">🌿</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-center">Sezonski izdelki</h2>
            <p className="text-lg text-gray-700 text-center mb-6">
              Vsak mesec poudarjamo najboljše sezonske izdelke. 
              Sezonska hrana je najbolj sveža, okusna in cenovno dostopna.
            </p>
            <div className="text-center">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                Oglejte si ponudbe meseca
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Začnite iskati lokalne izdelke</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Več kot 150 kmetij čaka, da odkrijete njihove izdelke
          </p>
          <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
            Raziskujte vse izdelke
          </button>
        </div>
      </section>
    </main>
  );
}
