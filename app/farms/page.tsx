import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function FarmsPage() {
  const farms = [
    {
      id: 1,
      name: 'Ekološka kmetija Novak',
      location: 'Ljubljana',
      specialty: 'Zelenjava in sadje',
      rating: 4.9,
      image: '🌾',
    },
    {
      id: 2,
      name: 'Kmetija Pri Juretu',
      location: 'Maribor',
      specialty: 'Mlečni izdelki',
      rating: 4.8,
      image: '🐄',
    },
    {
      id: 3,
      name: 'Bio kmetija Sonce',
      location: 'Celje',
      specialty: 'Med in sadni sokovi',
      rating: 4.9,
      image: '🌻',
    },
    {
      id: 4,
      name: 'Kmetija Zeleni hrib',
      location: 'Kranj',
      specialty: 'Perutnina in jajca',
      rating: 4.7,
      image: '🐔',
    },
    {
      id: 5,
      name: 'Domačija Planinka',
      location: 'Bled',
      specialty: 'Gorski sir in skuta',
      rating: 5.0,
      image: '⛰️',
    },
    {
      id: 6,
      name: 'Ekološka farma Dolina',
      location: 'Koper',
      specialty: 'Oljčno olje in olive',
      rating: 4.8,
      image: '🫒',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {farms.map((farm) => (
                <div
                  key={farm.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition border border-gray-200"
                >
                  <div className="bg-gradient-to-br from-green-50 to-green-100 h-48 flex items-center justify-center text-8xl">
                    {farm.image}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{farm.name}</h3>
                      <div className="flex items-center text-amber-500">
                        <span className="mr-1">⭐</span>
                        <span className="font-semibold">{farm.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">📍 {farm.location}</p>
                    <p className="text-gray-700 font-medium mb-4">{farm.specialty}</p>
                    <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                      Obišči kmetijo
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
              <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition">
                Registrirajte svojo kmetijo
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
