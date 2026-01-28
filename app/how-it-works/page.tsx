export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      title: 'Izberite proizvode',
      description: 'Brskajte po ponudbi lokalnih kmetij in dodajte izdelke v košarico',
      icon: '🛒',
    },
    {
      number: 2,
      title: 'Naročite in plačajte',
      description: 'Oddajte naročilo in plačajte varno prek naše platforme',
      icon: '💳',
    },
    {
      number: 3,
      title: 'Prejmite dostavo',
      description: 'Svežo živilo prejmete na dom ali si ga privezemite neposredno na kmetiji',
      icon: '🚚',
    },
  ];

  const benefits = [
    {
      title: 'Za kupce',
      icon: '👨‍👩‍👧‍👦',
      points: [
        'Sveže, lokalno pridelano',
        'Transparentno poreklo',
        'Podpora lokalnim kmetom',
        'Konkurenčne cene',
        'Dostava na dom',
      ],
    },
    {
      title: 'Za kmete',
      icon: '🚜',
      points: [
        'Neposredna prodaja',
        'Boljše marže',
        'Večja vidnost',
        'Enostavna dostava',
        'Plačilo v 24h',
      ],
    },
  ];

  return (
    <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Kako deluje?</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Enostavna pot od kmetije do vaše mize
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 text-5xl">
                    {step.icon}
                  </div>
                  <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-600 text-lg">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Prednosti</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="bg-white rounded-xl p-8 shadow-md">
                  <div className="text-6xl mb-4 text-center">{benefit.icon}</div>
                  <h3 className="text-2xl font-bold mb-6 text-center">{benefit.title}</h3>
                  <ul className="space-y-3">
                    {benefit.points.map((point) => (
                      <li key={point} className="flex items-start">
                        <span className="text-green-600 mr-3 text-xl">✓</span>
                        <span className="text-gray-700 text-lg">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Pogosta vprašanja</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-xl font-bold mb-3">Kakšni so stroški dostave?</h3>
                <p className="text-gray-600">
                  Stroški dostave so odvisni od vaše lokacije in velikosti naročila. Brezplačna dostava za naročila nad 50€.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-xl font-bold mb-3">Kako hitro prejmem naročilo?</h3>
                <p className="text-gray-600">
                  Večina naročil je dostavljenih v 24-48 urah. Lahko pa si izdelke tudi sami prevzamete neposredno na kmetiji.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-xl font-bold mb-3">Ali lahko vrnem izdelke?</h3>
                <p className="text-gray-600">
                  Zaradi narave svežih izdelkov vračilo ni možno, vendar jamčimo za kakovost. Če niste zadovoljni, nas kontaktirajte.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Pripravljeni začeti?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Pridružite se tisočim zadovoljnim strankam, ki kupujejo lokalno
            </p>
            <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
              Začni nakupovati
            </button>
          </div>
        </section>
      </main>
  );
}
