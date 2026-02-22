export default function ShippingPage() {
  const deliveryZones = [
    {
      zone: 'Ljubljana z okolico',
      areas: ['Ljubljana', 'Domžale', 'Kamnik', 'Vrhnika', 'Grosuplje'],
      price: 'Brezplačno nad 30€',
      priceBellow: '2,50€',
      time: '1-2 dni'
    },
    {
      zone: 'Osrednja Slovenija',
      areas: ['Kranj', 'Jesenice', 'Škofja Loka', 'Trbovlje', 'Litija'],
      price: 'Brezplačno nad 35€',
      priceBellow: '3,50€',
      time: '2-3 dni'
    },
    {
      zone: 'Maribor z okolico',
      areas: ['Maribor', 'Ptuj', 'Slovenska Bistrica', 'Lenart', 'Ruše'],
      price: 'Brezplačno nad 35€',
      priceBellow: '3,50€',
      time: '2-3 dni'
    },
    {
      zone: 'Primorska',
      areas: ['Koper', 'Nova Gorica', 'Postojna', 'Sežana', 'Izola'],
      price: 'Brezplačno nad 40€',
      priceBellow: '4,50€',
      time: '2-4 dni'
    },
    {
      zone: 'Štajerska',
      areas: ['Celje', 'Velenje', 'Slovenj Gradec', 'Žalec', 'Laško'],
      price: 'Brezplačno nad 35€',
      priceBellow: '3,50€',
      time: '2-3 dni'
    },
    {
      zone: 'Ostale regije',
      areas: ['Murska Sobota', 'Novo mesto', 'Krško', 'Brežice', 'Črnomelj'],
      price: 'Brezplačno nad 40€',
      priceBellow: '4,50€',
      time: '3-4 dni'
    },
  ];

  const deliveryInfo = [
    {
      icon: '📦',
      title: 'Priprava naročila',
      description: 'Kmet pripravi vaše naročilo v 24-48 urah po oddaji. Prejmete obvestilo, ko je pripravljeno za dostavo.'
    },
    {
      icon: '🚚',
      title: 'Dostava na dom',
      description: 'Pakete dostavljamo od ponedeljka do petka med 8:00 in 17:00. Za sobotno dostavo nas kontaktirajte.'
    },
    {
      icon: '📱',
      title: 'Sledenje paketu',
      description: 'Ko je naročilo oddano v dostavo, prejmete sledilno številko za spremljanje v realnem času.'
    },
    {
      icon: '❄️',
      title: 'Hlajenje',
      description: 'Sveži in zamrznjeni izdelki so dostavljeni v izoliranih embalaža s hladilnimi elementi.'
    },
  ];

  const specialCases = [
    {
      title: 'Velika naročila',
      content: 'Za naročila nad 200€ ali več kot 20kg nas kontaktirajte za dogovor o dostavi. Morda lahko organiziramo neposredno dostavo s strani kmeta.'
    },
    {
      title: 'Oddaljene lokacije',
      content: 'Če vaša lokacija ni na seznamu, nas kontaktirajte. Trudimo se dostavljati po vsej Sloveniji, morda bomo našli rešitev.'
    },
    {
      title: 'Ponavljajoča naročila',
      content: 'Želite redne tedenske ali mesečne dostave? Nastavite lahko avtomatsko dostavo in prihranite dodatnih 5% na stroških dostave.'
    },
  ];

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Dostava</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Hitro in zanesljivo dostavljamo sveže pridelke po vsej Sloveniji
          </p>
        </div>
      </section>

      {/* Delivery Info Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {deliveryInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="text-5xl mb-4">{info.icon}</div>
                <h3 className="font-bold text-lg mb-2">{info.title}</h3>
                <p className="text-gray-600 text-sm">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Zones */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Območja dostave in cene</h2>
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Table Header */}
              <div className="bg-green-600 text-white px-6 py-4 grid grid-cols-4 gap-4 font-semibold">
                <div>Območje</div>
                <div>Brezplačna dostava</div>
                <div>Cena dostave</div>
                <div>Čas dostave</div>
              </div>
              
              {/* Table Rows */}
              {deliveryZones.map((zone, index) => (
                <div 
                  key={index} 
                  className={`px-6 py-5 grid grid-cols-4 gap-4 items-center ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div>
                    <div className="font-semibold mb-1">{zone.zone}</div>
                    <div className="text-sm text-gray-500">{zone.areas.join(', ')}</div>
                  </div>
                  <div className="text-green-600 font-semibold">{zone.price}</div>
                  <div className="text-gray-700">{zone.priceBellow}</div>
                  <div className="text-gray-700">{zone.time}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <strong>Opomba:</strong> Časi dostave so okvirni in odvisni od razpoložljivosti izdelkov ter vremenskih razmer.
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Kako poteka dostava?</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="flex-1 bg-white rounded-xl shadow-md p-6">
                  <h3 className="font-bold text-lg mb-2">Oddajte naročilo</h3>
                  <p className="text-gray-600">Izberite izdelke in oddajte naročilo do 15:00 za procesiranje istega dne.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="flex-1 bg-white rounded-xl shadow-md p-6">
                  <h3 className="font-bold text-lg mb-2">Kmet pripravi izdelke</h3>
                  <p className="text-gray-600">Kmet nabere/pripravi sveže izdelke in jih skrbno zapakira za transport.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="flex-1 bg-white rounded-xl shadow-md p-6">
                  <h3 className="font-bold text-lg mb-2">Prevzem in transport</h3>
                  <p className="text-gray-600">Naš kurir prevzame paket s kmetije in ga dostavi na vaš naslov.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div className="flex-1 bg-white rounded-xl shadow-md p-6">
                  <h3 className="font-bold text-lg mb-2">Dostava na vaš dom</h3>
                  <p className="text-gray-600">Prejmete sveže pridelke direktno na dom. Uživajte!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Cases */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Posebni primeri</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {specialCases.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Še vprašanja o dostavi?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Oglejte si našo stran s pogostimi vprašanji ali nas kontaktirajte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/faq" className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition">
                Pogosta vprašanja
              </a>
              <a href="/contact" className="bg-white border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition">
                Kontaktirajte nas
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
