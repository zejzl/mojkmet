export default function ContactPage() {
  const contactMethods = [
    {
      icon: '📧',
      title: 'E-pošta',
      content: 'info@mojkmet.eu',
      description: 'Odgovorimo v 24 urah',
    },
    {
      icon: '📞',
      title: 'Telefon',
      content: '+386 1 234 5678',
      description: 'Pon-Pet: 9:00 - 17:00',
    },
    {
      icon: '📍',
      title: 'Naslov',
      content: 'Dunajska cesta 123, 1000 Ljubljana',
      description: 'Obiščite nas po dogovoru',
    },
  ];

  const departments = [
    {
      name: 'Splošna vprašanja',
      email: 'info@mojkmet.eu',
      description: 'Za splošne informacije in povpraševanja',
    },
    {
      name: 'Podpora kupcem',
      email: 'podpora@mojkmet.eu',
      description: 'Pomoč pri naročilih in dostavi',
    },
    {
      name: 'Podpora kmetom',
      email: 'kmeti@mojkmet.eu',
      description: 'Vprašanja za kmete in partnerje',
    },
    {
      name: 'Tehnična podpora',
      email: 'tehnicna@mojkmet.eu',
      description: 'Težave s platformo ali aplikacijo',
    },
  ];

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kontaktirajte nas</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Tu smo za vas. Pošljite nam sporočilo ali nas pokličite.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {contactMethods.map((method) => (
              <div key={method.title} className="bg-white rounded-xl p-8 shadow-md text-center border border-gray-200">
                <div className="text-5xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                <p className="text-green-600 font-semibold mb-2">{method.content}</p>
                <p className="text-gray-600 text-sm">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-3xl font-bold mb-8 text-center">Pošljite nam sporočilo</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Ime in priimek *
                    </label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="Janez Novak"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      E-pošta *
                    </label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="janez@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Telefon
                    </label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="+386 40 123 456"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Zadeva *
                    </label>
                    <select 
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                      <option value="">Izberite...</option>
                      <option value="general">Splošno vprašanje</option>
                      <option value="order">Vprašanje o naročilu</option>
                      <option value="farmer">Vprašanje za kmete</option>
                      <option value="technical">Tehnična težava</option>
                      <option value="partnership">Sodelovanje</option>
                      <option value="other">Drugo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Sporočilo *
                  </label>
                  <textarea 
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Vaše sporočilo..."
                  />
                </div>

                <div className="flex items-start">
                  <input 
                    type="checkbox" 
                    id="privacy" 
                    required
                    className="mt-1 mr-3"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-600">
                    Strinjam se z obdelavo mojih osebnih podatkov v skladu s{' '}
                    <a href="/privacy" className="text-green-600 hover:underline">
                      politiko zasebnosti
                    </a>.
                  </label>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Pošlji sporočilo
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Kontaktirajte pravi oddelek</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {departments.map((dept) => (
              <div key={dept.name} className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-xl font-bold mb-2">{dept.name}</h3>
                <p className="text-green-600 font-semibold mb-2">{dept.email}</p>
                <p className="text-gray-600 text-sm">{dept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Hours */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Delovni čas</h2>
            <div className="bg-white rounded-xl p-8 shadow-md">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Pisarna</h3>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <span>Ponedeljek - Petek:</span>
                      <span className="font-semibold">9:00 - 17:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sobota:</span>
                      <span className="font-semibold">9:00 - 13:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nedelja:</span>
                      <span className="font-semibold">Zaprto</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">Telefonska podpora</h3>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <span>Ponedeljek - Petek:</span>
                      <span className="font-semibold">8:00 - 20:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sobota - Nedelja:</span>
                      <span className="font-semibold">9:00 - 15:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prazniki:</span>
                      <span className="font-semibold">Zaprto</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Naša lokacija</h2>
            <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <div className="text-5xl mb-4">🗺️</div>
                <p className="text-lg">Zemljevid Google Maps</p>
                <p className="text-sm">Dunajska cesta 123, 1000 Ljubljana</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Potrebujete hitro pomoč?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Oglejte si naša pogosta vprašanja za hitre odgovore
          </p>
          <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
            Pogosta vprašanja
          </button>
        </div>
      </section>
    </main>
  );
}
