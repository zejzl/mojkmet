import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProductsPage() {
  const categories = [
    { name: 'Sadje', icon: '🍎', count: 45 },
    { name: 'Zelenjava', icon: '🥕', count: 62 },
    { name: 'Mlečni izdelki', icon: '🧀', count: 38 },
    { name: 'Meso', icon: '🥩', count: 28 },
    { name: 'Med in sladkosti', icon: '🍯', count: 19 },
    { name: 'Pijače', icon: '🥤', count: 24 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sveži Proizvodi</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Odkrijte našo ponudbo lokalno pridelanih živil
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="bg-gray-50 py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <input
                type="text"
                placeholder="Išči proizvode..."
                className="w-full px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Kategorije</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition cursor-pointer border border-gray-200"
                >
                  <div className="text-5xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} izdelkov</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Kmalu na voljo</h2>
              <p className="text-lg text-gray-600 mb-8">
                Trenutno pripravljamo našo celotno ponudbo proizvodov. Spremljajte nas!
              </p>
              <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition">
                Obvestite me ob zagonu
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
