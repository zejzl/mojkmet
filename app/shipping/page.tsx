export default function ShippingPage() {
  const deliveryZones = [
    {
      zone: 'Ljubljana in okolica',
      price: 'Brezplačno',
      time: 'Naslednji dan',
      areas: 'Ljubljana, Domžale, Kamnik, Medvode, Škofljica',
    },
    {
      zone: 'Ostala večja mesta',
      price: 'Brezplačno (nad 30 €)',
      time: '1-2 dni',
      areas: 'Maribor, Celje, Kranj, Koper, Novo mesto',
    },
    {
      zone: 'Preostala Slovenija',
      price: '3,99 € (brezplačno nad 50 €)',
      time: '2-3 dni',
      areas: 'Vsa ostala območja Slovenije',
    },
    {
      zone: 'Oddaljene lokacije',
      price: '5,99 €',
      time: '3-4 dni',
      areas: 'Hribovske in oddaljene vasi',
    },
  ];

  const deliveryTimes = [
    {
      icon: '🌅',
      time: '7:00 - 10:00',
      title: 'Jutranji dostava',
      price: '+ 2 €',
    },
    {
      icon: '☀️',
      time: '10:00 - 14:00',
      title: 'Dopoldanska dostava',
      price: 'Brezplačno',
    },
    {
      icon: '🌆',
      time: '14:00 - 18:00',
      title: 'Popoldanska dostava',
      price: 'Brezplačno',
    },
    {
      icon: '🌙',
      time: '18:00 - 21:00',
      title: 'Večerna dostava',
      price: '+ 2 €',
    },
  ];

  const features = [
    {
      icon: '❄️',
      title: 'Hlajeno prevažanje',
      description: 'Vsi sveži izdelki se prevažajo v hladilnih vozilih za maksimalno svežino',
    },
    {
      icon: '📦',
      title: 'Varna embalaža',
      description: 'Uporabljamo ekološko embalažo, ki ščiti vaše izdelke med prevozom',
    },
    {
      icon: '📍',
      title: 'Sledenje pošiljki',
      description: 'V realnem času spremljajte kje je vaše naročilo',
    },
    {
      icon: '🔔',
      title: 'SMS obvestila',
      description: 'Prejmete obvestilo, ko je dostavljalec na poti k vam',
    },
  ];

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Dostava</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Hitra in zanesljiva dostava svežih izdelkov na vaš dom
          </p>
        </div>
      </section>

      {/* Delivery Zones */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Območja dostave</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Dostavljamo po vsej Sloveniji. Stroški in čas dostave se razlikujejo glede na območje.
          </p>
          <div className="max-w-5xl mx-auto space-y-4">
            {deliveryZones.map((zone) => (
              <div 
                key={zone.zone} 
                className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition"
              >
                <div className="grid md:grid-cols-4 gap-4 items-center">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{zone.zone}</h3>
                    <p className="text-sm text-gray-600">{zone.areas}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-green-600 font-bold text-lg">{zone.price}</div>
                    <div className="text-sm text-gray-600">Strošek</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{zone.time}</div>
                    <div className="text-sm text-gray-600">Čas dostave</div>
                  </div>
                  <div className="text-center md:text-right">
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                      Naroči
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Time Slots */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Časovni termini dostave</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Izberite časovno okno, ki vam najbolj ustreza
          </p>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {deliveryTimes.map((slot) => (
              <div 
                key={slot.time} 
                className="bg-white rounded-xl p-6 shadow-md text-center border border-gray-200 hover:shadow-lg transition cursor-pointer"
              >
                <div className="text-5xl mb-4">{slot.icon}</div>
                <div className="text-2xl font-bold mb-2">{slot.time}</div>
                <h3 className="font-semibold mb-2">{slot.title}</h3>
                <div className="text-green-600 font-bold">{slot.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Naše storitve dostave</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Kako poteka dostava?</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold mb-2">Oddajte naročilo</h3>
                <p className="text-gray-600 text-sm">
                  Izberite izdelke in zaključite naročilo
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold mb-2">Priprava</h3>
                <p className="text-gray-600 text-sm">
                  Kmetije pripravijo vaše sveže izdelke
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold mb-2">Prevoz</h3>
                <p className="text-gray-600 text-sm">
                  Hlajeno vozilo pobere in dostavi izdelke
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-lg font-bold mb-2">Dostava</h3>
                <p className="text-gray-600 text-sm">
                  Prejmete svež izdelek na vaš naslov
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Deliveries */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Posebne storitve</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold mb-4">Ekspresna dostava</h3>
              <p className="text-gray-700 mb-4">
                Potrebujete izdelke še danes? Naročite do 10:00 in prejmete isti dan (samo Ljubljana in okolica).
              </p>
              <p className="text-green-600 font-bold">Dodatni strošek: 9,99 €</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-2xl font-bold mb-4">Naročnina</h3>
              <p className="text-gray-700 mb-4">
                Naročite se na redno dostavo in prihranite. Izberite tedenski ali mesečni paket vaših najljubših izdelkov.
              </p>
              <p className="text-green-600 font-bold">Prihranite do 15%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Pomembne informacije</h2>
            <div className="bg-white rounded-xl p-8 shadow-md space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">📝 Ob dostavi</h3>
                <p className="text-gray-700">
                  Prosimo, da ste dosegljivi na vašem telefonskem številko med dostavo. 
                  Če vas ne bo doma, lahko dostavimo na varno lokacijo ali sosedu po vašem navodilu.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">🎁 Darila</h3>
                <p className="text-gray-700">
                  Pošiljamo lahko tudi na drug naslov kot darilno. Pri plačilu označite opcijo "darilo" 
                  in dodajte sporočilo.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">📆 Prazniki</h3>
                <p className="text-gray-700">
                  Med prazniki se čas dostave lahko podaljša za 1-2 dni. O spremembah vas obvestimo po e-pošti.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">❄️ Pozimi</h3>
                <p className="text-gray-700">
                  V zimskih mesecih dodatno pazimo, da izdelki ne zamrznejo med prevozom. 
                  Prosimo, da jih po dostavi takoj prinesete v toplo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Imate vprašanja o dostavi?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Naša ekipa za podporo vam bo z veseljem pomagala
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
              Kontaktirajte nas
            </button>
            <button className="bg-green-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-800 transition border-2 border-white">
              Pogosta vprašanja
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
