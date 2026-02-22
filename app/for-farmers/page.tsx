export default function ForFarmersPage() {
  const benefits = [
    {
      title: 'Neposredna prodaja',
      icon: '🤝',
      description: 'Prodajajte direktno kupcem brez posrednikov in večajte svoj zaslužek',
    },
    {
      title: 'Večja zaslužek',
      icon: '💰',
      description: 'Obdržite do 30% več prihodkov v primerjavi s tradicionalno prodajo',
    },
    {
      title: 'Enostavna prodaja',
      icon: '📱',
      description: 'Enostaven nadzor zalog, cen in naročil prek naše platforme',
    },
    {
      title: 'Marketing za vas',
      icon: '📣',
      description: 'Mi poskrbimo za promocijo in pridobivanje novih kupcev',
    },
    {
      title: 'Hitra izplačila',
      icon: '⚡',
      description: 'Redna tedenska izplačila brez dolgih čakalnih dob',
    },
    {
      title: 'Podpora skupnosti',
      icon: '❤️',
      description: 'Pridružite se skupnosti lokalnih kmetov in delite izkušnje',
    },
  ];

  const pricingTiers = [
    {
      name: 'Začetnik',
      price: 'Brezplačno',
      commission: '12%',
      features: [
        'Do 20 izdelkov',
        'Osnovna podpora',
        'Mesečna izplačila',
        'Osnovna statistika prodaje',
      ],
      highlight: false,
    },
    {
      name: 'Profesional',
      price: '29 €/mesec',
      commission: '8%',
      features: [
        'Neomejeno izdelkov',
        'Prednostna podpora',
        'Tedenska izplačila',
        'Napredna analitika',
        'Promocijske akcije',
        'Fotografska podpora',
      ],
      highlight: true,
    },
    {
      name: 'Premium',
      price: '79 €/mesec',
      commission: '5%',
      features: [
        'Vse iz Professional',
        '24/7 podpora',
        'Dnevna izplačila',
        'Osebni svetovalec',
        'Video vsebina',
        'Prednostni prikaz',
      ],
      highlight: false,
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Registracija',
      description: 'Izpolnite preprost obrazec z osnovnimi podatki o vaši kmetiji',
    },
    {
      number: 2,
      title: 'Verifikacija',
      description: 'Preverimo vašo kmetijo in vam pomagamo nastaviti profil',
    },
    {
      number: 3,
      title: 'Dodajte izdelke',
      description: 'Naložite fotografije in opise svojih izdelkov',
    },
    {
      number: 4,
      title: 'Začnite prodajati',
      description: 'Vaši izdelki so vidni tisočem kupcem po Sloveniji',
    },
  ];

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Prodajajte na Mojkmet.eu</h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Pridružite se več kot 150 kmetijam, ki uspešno prodajajo lokalno
          </p>
          <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
            Registrirajte kmetijo brezplačno
          </button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Zakaj izbrati Mojkmet.eu?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Pregledne cene</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Izberite paket, ki ustreza velikosti vaše kmetije. Brez skritih stroškov.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <div 
                key={tier.name} 
                className={`rounded-xl p-8 ${
                  tier.highlight 
                    ? 'bg-green-600 text-white shadow-xl scale-105' 
                    : 'bg-white shadow-md border border-gray-200'
                }`}
              >
                {tier.highlight && (
                  <div className="text-center mb-4">
                    <span className="bg-yellow-400 text-green-900 px-4 py-1 rounded-full text-sm font-bold">
                      PRIPOROČENO
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2 text-center">{tier.name}</h3>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold mb-2">{tier.price}</div>
                  <div className={`text-sm ${tier.highlight ? 'text-green-100' : 'text-gray-600'}`}>
                    + {tier.commission} provizija od prodaje
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    tier.highlight
                      ? 'bg-white text-green-600 hover:bg-gray-100'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Izberi paket
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Kako začeti?</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                      {step.number}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Zgodbe uspеha</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <div className="text-4xl mb-4">👨‍🌾</div>
              <p className="text-gray-700 italic mb-4">
                "Od kar prodajam preko Mojkmet.eu, sem povečal prihodke za 40%. Kupci cenijo 
                neposredno povezavo in jaz ne potrebujem več posrednikov."
              </p>
              <p className="font-semibold">Janez Novak</p>
              <p className="text-sm text-gray-600">Sadjarstvo Novak, Maribor</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-md">
              <div className="text-4xl mb-4">👩‍🌾</div>
              <p className="text-gray-700 italic mb-4">
                "Platforma je zelo enostavna za uporabo. Podpora je odlična in zdaj dosežem 
                kupce iz cele Slovenije, ne samo lokalno."
              </p>
              <p className="font-semibold">Ana Horvat</p>
              <p className="text-sm text-gray-600">Ekološka kmetija Horvat, Ljubljana</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Imate vprašanja?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Oglejte si naše najpogostejša vprašanja ali nas kontaktirajte za več informacij.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition">
                Pogosta vprašanja
              </button>
              <button className="bg-white border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition">
                Kontaktirajte nas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pripravlieni na začetek?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Registracija je brezplačna in traja manj kot 5 minut
          </p>
          <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
            Začnite prodajati danes
          </button>
        </div>
      </section>
    </main>
  );
}
