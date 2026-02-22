import Link from 'next/link';

export default function ForFarmersPage() {
  const benefits = [
    {
      title: 'Neposredna prodaja',
      icon: '💰',
      description: 'Prodajajte neposredno kupcem brez posrednikov in obdržite večji del prihodkov.'
    },
    {
      title: 'Večja vidnost',
      icon: '📈',
      description: 'Dosežite tisoče kupcev po vsej Sloveniji preko naše platforme.'
    },
    {
      title: 'Enostavna uporaba',
      icon: '📱',
      description: 'Intuitivna platforma za upravljanje izdelkov, naročil in zalog.'
    },
    {
      title: 'Hitro plačilo',
      icon: '⚡',
      description: 'Prejemite plačila v 3-5 delovnih dneh po dostavi.'
    },
    {
      title: 'Brezplačna podpora',
      icon: '🤝',
      description: 'Naša ekipa vam pomaga pri vseh korakih - od registracije do prodaje.'
    },
    {
      title: 'Analitika prodaje',
      icon: '📊',
      description: 'Sledite svojim prodajam, najboljšim izdelkom in kupcem v realnem času.'
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Registracija',
      description: 'Izpolnite preprost registracijski obrazec z osnovnimi podatki o kmetiji.'
    },
    {
      number: '2',
      title: 'Verifikacija',
      description: 'Naša ekipa preveri vašo kmetijo in potrdi registracijo (1-2 dni).'
    },
    {
      number: '3',
      title: 'Nastavitev profila',
      description: 'Dodajte fotografije kmetije, opis in svoje zgodbe.'
    },
    {
      number: '4',
      title: 'Dodajanje izdelkov',
      description: 'Naložite svoje izdelke s fotografijami, opisi in cenami.'
    },
    {
      number: '5',
      title: 'Začnite prodajati',
      description: 'Vaši izdelki so takoj vidni kupcem po vsej Sloveniji!'
    },
  ];

  const pricing = [
    {
      name: 'Začetni paket',
      price: 'Brezplačno',
      period: 'prvi 3 meseci',
      features: [
        'Do 20 izdelkov',
        '5% provizija na prodajo',
        'Osnovna podpora',
        'Statistika prodaje',
      ],
      highlight: false
    },
    {
      name: 'Standardni paket',
      price: '29€',
      period: 'na mesec',
      features: [
        'Neomejeno izdelkov',
        '3% provizija na prodajo',
        'Prednostna podpora',
        'Napredna analitika',
        'Promocija na strani',
      ],
      highlight: true
    },
    {
      name: 'Premium paket',
      price: '79€',
      period: 'na mesec',
      features: [
        'Vse iz standardnega',
        '2% provizija na prodajo',
        'Osebni svetovalec',
        'Marketing podpora',
        'Lastna podstran',
      ],
      highlight: false
    },
  ];

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Za kmete</h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Pridružite se platformi, ki povezuje slovenske kmete s kupci po vsej državi
          </p>
          <Link href="/register" className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
            Registriraj kmetijo
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Zakaj izbrati Mojkmet.eu?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Kako začeti?</h2>
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0 w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {step.number}
                </div>
                <div className="flex-1 bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Cenovna paketa</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricing.map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-xl shadow-md p-8 ${
                  plan.highlight 
                    ? 'bg-green-600 text-white ring-4 ring-green-300 transform scale-105' 
                    : 'bg-white'
                }`}
              >
                {plan.highlight && (
                  <div className="text-center mb-4">
                    <span className="bg-white text-green-600 px-4 py-1 rounded-full text-sm font-bold">
                      PRIPOROČENO
                    </span>
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-green-600'}`}>
                    {plan.price}
                  </span>
                  <span className={`ml-2 ${plan.highlight ? 'text-green-100' : 'text-gray-500'}`}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className={`mr-2 ${plan.highlight ? 'text-green-200' : 'text-green-500'}`}>✓</span>
                      <span className={plan.highlight ? 'text-green-50' : 'text-gray-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/register"
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition ${
                    plan.highlight
                      ? 'bg-white text-green-600 hover:bg-gray-100'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Izberi paket
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Zgodbe uspešnih kmetov</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="text-4xl mb-4">👨‍🌾</div>
              <p className="text-gray-700 italic mb-4">
                "Od kar smo na Mojkmet.eu, se je naša prodaja podvojila. Končno lahko prodajamo neposredno 
                kupcem brez posrednikov, ki bi nam vzeli večino dobička."
              </p>
              <p className="font-bold">Franc Novak</p>
              <p className="text-sm text-gray-600">Ekološka kmetija Novak, Kranj</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="text-4xl mb-4">👩‍🌾</div>
              <p className="text-gray-700 italic mb-4">
                "Platforma je zelo enostavna za uporabo. V dveh dneh sem dodala vse izdelke in že prvi 
                teden prejela 15 naročil. Odlična ekipa za podporo!"
              </p>
              <p className="font-bold">Marija Horvat</p>
              <p className="text-sm text-gray-600">Kmetija pri Mariji, Maribor</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Pripravljeni začeti?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Registracija traja le 5 minut. Brez skritih stroškov. Brez obveznosti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition">
                Registriraj kmetijo zdaj
              </Link>
              <Link href="/contact" className="bg-white border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition">
                Kontaktiraj nas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
