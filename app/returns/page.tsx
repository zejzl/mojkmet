export default function ReturnsPage() {
  const returnReasons = [
    {
      icon: '🥬',
      title: 'Izdelek ni svež',
      description: 'Če izdelek ni svež ali ni kakovosti, kot je bila opisana',
      refund: 'Celotno vračilo ali zamenjava'
    },
    {
      icon: '📦',
      title: 'Poškodovan paket',
      description: 'Paket je bil poškodovan med transportom',
      refund: 'Celotno vračilo ali zamenjava'
    },
    {
      icon: '❌',
      title: 'Napačen izdelek',
      description: 'Prejeli ste napačen izdelek ali manjka del naročila',
      refund: 'Celotno vračilo ali zamenjava'
    },
    {
      icon: '🕐',
      title: 'Zamuda dostave',
      description: 'Izdelek je bil dostavljen prepozno in ni več svež',
      refund: 'Celotno vračilo'
    },
  ];

  const returnSteps = [
    {
      step: '1',
      title: 'Kontaktirajte nas',
      description: 'V 24 urah po dostavi nas kontaktirajte na podpora@mojkmet.eu ali pokličite +386 1 234 5678. Opišite problem in pripnite fotografije izdelka.'
    },
    {
      step: '2',
      title: 'Odobritev vračila',
      description: 'Naša ekipa bo pregledala vašo zahtevo in jo običajno odobri v 12 urah. Prejmete navodila za vračilo izdelka.'
    },
    {
      step: '3',
      title: 'Vračilo izdelka',
      description: 'Za pokvarljive izdelke vračilo ni potrebno. Za druge izdelke vam pošljemo povratno nalepko za brezplačno vračilo.'
    },
    {
      step: '4',
      title: 'Prejemite povračilo',
      description: 'Ko odobrimo zahtevo, prejmete povračilo v 3-5 delovnih dneh na originalni način plačila ali kot kredit za naslednjo naročilo.'
    },
  ];

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Vračila in povračila</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Vaše zadovoljstvo je naša prioriteta - enostavna in pravična politika vračil
          </p>
        </div>
      </section>

      {/* Main Policy */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6">Naša garancija</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  <strong>100% garancija svežine:</strong> Vsi naši izdelki so sveži in kakovostni. Če niste popolnoma zadovoljni,
                  vam vrnemo denar ali zamenjamo izdelek. Brez vprašanj, brez zapletov.
                </p>
                <p>
                  <strong>24-urni rok:</strong> Težavo morate prijaviti v 24 urah po prejemu dostave. To nam omogoča,
                  da hitro rešimo problem in zagotovimo kakovost.
                </p>
                <p>
                  <strong>Fotografska dokumentacija:</strong> Za hitrejšo obravnavo prosimo, da ob prijavi priložite
                  fotografije izdelka in embalaže.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Return Reasons */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Upravičeni razlogi za vračilo</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {returnReasons.map((reason, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="text-5xl mb-4">{reason.icon}</div>
                <h3 className="font-bold text-lg mb-2">{reason.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{reason.description}</p>
                <div className="text-green-600 font-semibold text-sm">{reason.refund}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Postopek vračila</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {returnSteps.map((item, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {item.step}
                  </div>
                  <div className="flex-1 bg-white rounded-xl shadow-md p-6">
                    <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Special Cases */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Pomembne informacije</h2>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <span className="text-3xl mr-3">✅</span>
                Sprejemljiva vračila
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Izdelki, ki niso sveži ali kakovostni
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Poškodovani ali napačni izdelki
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Manjkajoči deli naročila
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Zamujene dostave s pokvarljivimi izdelki
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <span className="text-3xl mr-3">❌</span>
                Nesprejemljiva vračila
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Izdelki, ki so bili nepravilno shranjeni
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Zahteve po 24 urah od dostave
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Uporabljeni ali porabljeni izdelki
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Osebne preference ("ni mi všeč okus")
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Načini povračila</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="font-bold text-lg mb-2">Originalni način plačila</h3>
              <p className="text-gray-600 text-sm">Vračilo na kartice ali PayPal v 3-5 delovnih dneh</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="font-bold text-lg mb-2">Kredit za nakupe</h3>
              <p className="text-gray-600 text-sm">Takojšnji kredit + bonus 10% za naslednjo naročilo</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="font-bold text-lg mb-2">Zamenjava izdelka</h3>
              <p className="text-gray-600 text-sm">Hitra zamenjava za drug izdelek ali sveži kos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Potrebujete pomoč z vračilom?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Naša ekipa za podporo je na voljo vsak delovni dan od 8:00 do 17:00
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:podpora@mojkmet.eu" 
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              E-pošta: podpora@mojkmet.eu
            </a>
            <a 
              href="tel:+38612345678" 
              className="bg-green-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-800 transition border-2 border-white"
            >
              Telefon: +386 1 234 5678
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
