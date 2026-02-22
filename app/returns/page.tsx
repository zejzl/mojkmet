export default function ReturnsPage() {
  const returnReasons = [
    {
      icon: '🥬',
      title: 'Izdelek ni svež',
      timeframe: '48 ur',
      refund: '100% vračilo',
    },
    {
      icon: '📦',
      title: 'Napačen izdelek',
      timeframe: '48 ur',
      refund: '100% vračilo ali zamenjava',
    },
    {
      icon: '💔',
      title: 'Poškodovan izdelek',
      timeframe: 'Ob dostavi',
      refund: '100% vračilo ali zamenjava',
    },
    {
      icon: '🤔',
      title: 'Premislil/a sem si',
      timeframe: '24 ur',
      refund: 'Vračilo minus stroški dostave',
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Kontaktirajte nas',
      description: 'Pošljite nam fotografijo izdelka in opišite problem v 48 urah po dostavi',
    },
    {
      number: 2,
      title: 'Odobritev',
      description: 'Naša ekipa pregleda prijavo in vas obvesti o odobritvi (običajno v 24 urah)',
    },
    {
      number: 3,
      title: 'Vračilo',
      description: 'Pustite izdelek na naslednji dostavi ali ga prinesete na zbirno mesto',
    },
    {
      number: 4,
      title: 'Povračilo',
      description: 'Denar vam vrnemo v 3-5 delovnih dneh na vaš račun',
    },
  ];

  const nonReturnable = [
    'Sveže meso in ribe (razen če niso sveži)',
    'Odprti mlečni izdelki',
    'Izdelki s pretečenim rokom (če je bila napaka vaša)',
    'Izdelki na akciji ali posebni popusti (razen okvar)',
  ];

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Vračila in reklamacije</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Vaše zadovoljstvo je naša prioriteta. Enostavno in pošteno vračilo.
          </p>
        </div>
      </section>

      {/* Return Reasons */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Razlogi za vračilo</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Razumemo, da lahko pride do težav. Tukaj so najpogostejši razlogi za vračilo in naša politika.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {returnReasons.map((reason) => (
              <div 
                key={reason.title} 
                className="bg-white rounded-xl p-6 shadow-md text-center border border-gray-200"
              >
                <div className="text-5xl mb-4">{reason.icon}</div>
                <h3 className="text-lg font-bold mb-3">{reason.title}</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-600">Rok za prijavo:</div>
                    <div className="font-semibold text-green-600">{reason.timeframe}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Povračilo:</div>
                    <div className="font-semibold">{reason.refund}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Postopek vračila</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                      {step.number}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-md flex-grow">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Pomembne informacije</h2>
            
            <div className="space-y-8">
              {/* Guarantee */}
              <div className="bg-green-50 rounded-xl p-8 border-2 border-green-200">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">✅</div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Garancija svežine</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Vsi naši izdelki so zajamčeno sveži. Če iz kateregakoli razloga niste zadovoljni 
                      s svežino, vam bomo izdelek zamenjali ali vrnili denar - brez vprašanj. 
                      Fotografirajte izdelek in nas kontaktirajte v 48 urah po dostavi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact for Returns */}
              <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
                <h3 className="text-xl font-bold mb-4">Kako prijaviti vračilo?</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl mb-2">📧</div>
                    <div className="font-semibold">E-pošta</div>
                    <div className="text-green-600">vracila@mojkmet.eu</div>
                  </div>
                  <div>
                    <div className="text-3xl mb-2">📞</div>
                    <div className="font-semibold">Telefon</div>
                    <div className="text-green-600">+386 1 234 5678</div>
                  </div>
                  <div>
                    <div className="text-3xl mb-2">💬</div>
                    <div className="font-semibold">Klepet</div>
                    <div className="text-green-600">V aplikaciji</div>
                  </div>
                </div>
              </div>

              {/* What You Need */}
              <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
                <h3 className="text-xl font-bold mb-4">Kaj potrebujemo za vračilo?</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3">✓</span>
                    <span>Številko naročila</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3">✓</span>
                    <span>Fotografijo izdelka in embalaže</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3">✓</span>
                    <span>Kratek opis problema</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3">✓</span>
                    <span>Vaše kontaktne podatke (če drugačni od naročila)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Non-Returnable Items */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Izdelki, ki jih ne moremo sprejeti nazaj</h2>
            <p className="text-lg text-gray-600 text-center mb-8">
              Iz zdravstvenih in varnostnih razlogov nekaterih izdelkov ne moremo sprejeti nazaj, 
              razen če so poškodovani ali nesveži ob dostavi.
            </p>
            <div className="bg-white rounded-xl p-8 shadow-md">
              <ul className="space-y-3">
                {nonReturnable.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-red-500 mr-3">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Kdaj prejmem povračilo?</h2>
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1d
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Pregled prijave</h3>
                    <p className="text-gray-600">
                      Vaša prijava za vračilo je pregledana in odobrena običajno v 24 urah
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2d
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Prevzem izdelka</h3>
                    <p className="text-gray-600">
                      Izdelek prevzamemo ali pa ga pustite pri naslednji dostavi
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3-5d
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Povračilo denarja</h3>
                    <p className="text-gray-600">
                      Denar je vrnjen na vaš plačilni način v 3-5 delovnih dneh
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consumer Rights */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Vaše pravice kot potrošnik</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                Kot potrošnik v Sloveniji imate pravico do vračila izdelkov v skladu z Zakonom o varstvu potrošnikov (ZVPot).
              </p>
              <p>
                Za nakupe preko spleta imate pravico do odstopa od pogodbe v 14 dneh brez navedbe razloga, 
                razen za sveže živilske izdelke, ki niso primerni za vračilo iz zdravstvenih razlogov.
              </p>
              <p>
                Za izdelke, ki so pokvarjeni ali ne ustrezajo opisu, imate pravico do:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Zamenjave izdelka</li>
                <li>Popravila</li>
                <li>Znižanja cene</li>
                <li>Vračila denarja</li>
              </ul>
              <p className="text-sm mt-6">
                Za več informacij o vaših pravicah obiščite{' '}
                <a href="https://www.gov.si/teme/varstvo-potrosnikov/" className="text-green-600 hover:underline" target="_blank" rel="noopener">
                  spletno stran Zveze potrošnikov Slovenije
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Potrebujete pomoč z vračilom?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Naša ekipa za podporo je tu, da vam pomaga
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
              Kontaktirajte podporo
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
