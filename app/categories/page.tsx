import Link from 'next/link';

export default function CategoriesPage() {
  const categories = [
    {
      name: 'Sadje',
      slug: 'sadje',
      icon: '🍎',
      description: 'Sveže sezonsko sadje slovenskih sadjarjev',
      color: 'from-red-500 to-orange-500'
    },
    {
      name: 'Zelenjava',
      slug: 'zelenjava',
      icon: '🥕',
      description: 'Zelenjava direktno iz vrta na vašo mizo',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Mlečni izdelki',
      slug: 'mlecni-izdelki',
      icon: '🥛',
      description: 'Mleko, jogurt, sir in skuta iz lokalnih mlekarn',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      name: 'Meso',
      slug: 'meso',
      icon: '🥩',
      description: 'Kakovostno meso z domačih kmetij',
      color: 'from-red-600 to-pink-600'
    },
    {
      name: 'Pekovsko',
      slug: 'pekovsko',
      icon: '🥖',
      description: 'Domač kruh, pecivo in testenine',
      color: 'from-amber-600 to-yellow-600'
    },
    {
      name: 'Med',
      slug: 'med',
      icon: '🍯',
      description: 'Pravi slovenski med iz slovenskih panjev',
      color: 'from-yellow-500 to-orange-400'
    },
    {
      name: 'Vino',
      slug: 'vino',
      icon: '🍷',
      description: 'Vrhunska vina slovenskih vinogradnikov',
      color: 'from-purple-600 to-red-600'
    },
    {
      name: 'Olja',
      slug: 'olja',
      icon: '🫒',
      description: 'Bučno, olivno in druga domača olja',
      color: 'from-green-700 to-lime-600'
    },
  ];

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kategorije izdelkov</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Raziščite našo ponudbo svežih kmetijskih pridelkov iz vseh slovenskih regij
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  <div className={`bg-gradient-to-br ${category.color} p-8 text-center transition-transform group-hover:scale-105`}>
                    <div className="text-6xl mb-2">{category.icon}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-green-600 transition">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Zakaj kupovati po kategorijah?</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-bold mb-2">Hitra navigacija</h3>
                <p className="text-gray-600">
                  Hitro najdite točno tisto, kar potrebujete
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-lg font-bold mb-2">Sezonska ponudba</h3>
                <p className="text-gray-600">
                  Odkrijte, kaj je ravno v sezoni
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-4xl mb-4">👨‍🌾</div>
                <h3 className="text-lg font-bold mb-2">Lokalni kmeti</h3>
                <p className="text-gray-600">
                  Spoznajte pridelovalce za vsakim izdelkom
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
