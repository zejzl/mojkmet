export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Zbiranje podatkov',
      icon: '📋',
      content: [
        'Osebne podatke zbiramo samo, ko jih prostovoljno posredujete pri registraciji, naročilu ali kontaktu.',
        'Zbiramo: ime, priimek, e-naslov, telefonsko številko, naslov dostave, plačilne podatke.',
        'Tehnične podatke: IP naslov, tip naprave, brskalnik, čas obiska (za izboljšanje storitev).',
      ],
    },
    {
      title: '2. Uporaba podatkov',
      icon: '🔧',
      content: [
        'Obdelava naročil in dostava izdelkov',
        'Komunikacija o naročilih, dostavi in spremembah',
        'Izboljšanje naših storitev in uporabniške izkušnje',
        'Pošiljanje novicobvestil (samo z vašim soglasjem)',
        'Preprečevanje goljufij in zagotavljanje varnosti',
      ],
    },
    {
      title: '3. Deljenje podatkov',
      icon: '🤝',
      content: [
        'Vaših podatkov NIKOLI ne prodajamo tretjim osebam.',
        'Delimo jih samo s partnerji, ki so potrebni za izvedbo storitve:',
        '- Kmetijami (ime, naslov dostave, telefonska številka)',
        '- Dostavljavci (ime, naslov, telefonska številka)',
        '- Plačilnimi procesorji (samo podatki potrebni za plačilo)',
        'Vsi partnerji so zavezani k varovanju vaših podatkov.',
      ],
    },
    {
      title: '4. Piškotki',
      icon: '🍪',
      content: [
        'Uporabljamo piškotke za delovanje spletne strani in analitiko.',
        'Nujni piškotki: potrebni za delovanje (prijava, košarica)',
        'Analitični piškotki: pomagajo nam razumeti, kako uporabljate spletno stran',
        'Marketinški piškotki: samo z vašim soglasjem',
        'Piškotke lahko onemogočite v nastavitvah brskalnika.',
      ],
    },
    {
      title: '5. Vaše pravice (GDPR)',
      icon: '⚖️',
      content: [
        'Pravica do dostopa: lahko zahtevate kopijo svojih podatkov',
        'Pravica do popravka: popravite napačne ali zastarele podatke',
        'Pravica do izbrisa: zahtevate izbris vaših podatkov',
        'Pravica do omejitve: omejite obdelavo vaših podatkov',
        'Pravica do prenosljivosti: prenos podatkov k drugemu ponudniku',
        'Pravica do ugovora: ugovarjate marketinškim sporočilom',
        'Za uveljavitev pravic pišite na: privacy@mojkmet.eu',
      ],
    },
    {
      title: '6. Hranjenje podatkov',
      icon: '🗄️',
      content: [
        'Vaše podatke hranimo toliko časa, kot je potrebno za izvedbo storitev.',
        'Podatke o naročilih hranimo 5 let (zakonska zahteva za računovodstvo).',
        'Marketinške podatke hranimo do preklica soglasja.',
        'Po izbrisu računa so vaši podatki anonimizirani ali izbrisani v 30 dneh.',
      ],
    },
    {
      title: '7. Varnost',
      icon: '🔒',
      content: [
        'Uporabljamo šifrirano povezavo SSL za zaščito prenosa podatkov.',
        'Gesla so shranjena kot hash (ne shranjujemo jih v berljivi obliki).',
        'Dostop do podatkov imajo samo pooblaščeni zaposleni.',
        'Redno izvajamo varnostne preglede in posodobitve.',
        'V primeru kršitve varnosti vas bomo obvestili v 72 urah.',
      ],
    },
    {
      title: '8. Tretje osebe',
      icon: '🔗',
      content: [
        'Naša spletna stran lahko vsebuje povezave do zunanjih spletnih strani.',
        'Nismo odgovorni za politiko zasebnosti teh strani.',
        'Uporabljamo naslednje tretje storitve:',
        '- Google Analytics (analitika)',
        '- Stripe / PayPal (plačila)',
        '- SendGrid (e-pošta)',
        'Vse te storitve so skladne z GDPR.',
      ],
    },
  ];

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Politika zasebnosti</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Vaša zasebnost je naša prioriteta. Tukaj je vse, kar morate vedeti.
          </p>
          <p className="mt-4 text-sm opacity-90">
            Nazadnje posodobljeno: 22. februar 2026
          </p>
        </div>
      </section>

      {/* GDPR Badge */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-md text-center border-2 border-green-200">
            <div className="text-5xl mb-4">🇪🇺</div>
            <h2 className="text-2xl font-bold mb-3">Skladni z GDPR</h2>
            <p className="text-gray-700">
              Naša politika zasebnosti je v celoti skladna z Splošno uredbo o varstvu podatkov (GDPR) 
              Evropske unije in slovensko zakonodajo o varstvu osebnih podatkov.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Introduction */}
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">
                Mojkmet.eu, s.p. (v nadaljevanju "mi", "nas", "naš") spoštuje vašo zasebnost in se zavezuje 
                k zaščiti vaših osebnih podatkov. Ta politika zasebnosti pojasnjuje, kako zbiramo, uporabljamo, 
                shranjujemo in ščitimo vaše osebne podatke v skladu z veljavno zakonodajo.
              </p>
            </div>

            {/* Sections */}
            {sections.map((section, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-8 shadow-md border border-gray-200"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-4xl">{section.icon}</div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li 
                      key={itemIndex} 
                      className="flex items-start text-gray-700 leading-relaxed"
                    >
                      <span className="text-green-600 mr-3 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Children's Privacy */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-md">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">👶</div>
              <h2 className="text-2xl font-bold">9. Zasebnost otrok</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Naše storitve niso namenjene osebam, mlajšim od 16 let. Zavestno ne zbiramo osebnih 
              podatkov otrok, mlajših od 16 let.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Če ugotovimo, da smo zbrali podatke otroka brez soglasja staršev, bomo te podatke takoj izbrisali. 
              Če menite, da lahko imamo podatke otroka, nas prosimo kontaktirajte.
            </p>
          </div>
        </div>
      </section>

      {/* International Transfers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-md border border-gray-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">🌍</div>
              <h2 className="text-2xl font-bold">10. Mednarodni prenosi podatkov</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vaši podatki se shranjujejo na strežnikih v Evropski uniji. Nekateri naši partnerji 
              (npr. plačilni procesorji) lahko imajo strežnike izven EU.
            </p>
            <p className="text-gray-700 leading-relaxed">
              V takih primerih zagotavljamo, da so podatki zaščiteni z ustreznimi varnostnimi ukrepi 
              in pogodbami v skladu z GDPR (npr. standardne pogodbene klavzule).
            </p>
          </div>
        </div>
      </section>

      {/* Changes to Policy */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-md">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">📝</div>
              <h2 className="text-2xl font-bold">11. Spremembe politike</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Pridržujemo si pravico do posodobitve te politike zasebnosti. O pomembnih spremembah 
              vas bomo obvestili po e-pošti ali z obvestilom na spletni strani.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Datum zadnje posodobitve je vedno naveden na vrhu te strani. Priporočamo, da občasno 
              pregledate to politiko, da ostanete obveščeni o tem, kako varujemo vaše podatke.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Kontakt za varstvo podatkov</h2>
            <div className="bg-green-50 rounded-xl p-8 border-2 border-green-200">
              <p className="text-lg text-gray-700 mb-6 text-center">
                Če imate vprašanja o tej politiki zasebnosti ali želite uveljavljati svoje pravice, 
                nas lahko kontaktirate:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">📧</div>
                  <div className="font-semibold">E-pošta</div>
                  <div className="text-green-600">privacy@mojkmet.eu</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">📞</div>
                  <div className="font-semibold">Telefon</div>
                  <div className="text-green-600">+386 1 234 5678</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">📍</div>
                  <div className="font-semibold">Naslov</div>
                  <div className="text-green-600">Dunajska 123, Ljubljana</div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-green-200">
                <p className="text-sm text-gray-600 text-center">
                  <strong>Pooblaščena oseba za varstvo podatkov:</strong> Ana Kovač
                  <br />
                  E-pošta: dpo@mojkmet.eu
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supervisory Authority */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Nadzorni organ</h2>
            <p className="text-gray-700 mb-6 text-center">
              Če menite, da nismo primerno ravnali z vašimi podatki, imate pravico vložiti pritožbo 
              pri nadzornem organu:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="font-semibold mb-2">Informacijski pooblaščenec Republike Slovenije</p>
              <p className="text-sm text-gray-600">Dunajska cesta 22, 1000 Ljubljana</p>
              <p className="text-sm text-gray-600">Telefon: 01 230 97 30</p>
              <p className="text-sm text-gray-600">
                Splet:{' '}
                <a 
                  href="https://www.ip-rs.si" 
                  className="text-green-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.ip-rs.si
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Imate vprašanja o zasebnosti?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Radi bomo odgovorili na vsa vaša vprašanja
          </p>
          <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
            Kontaktirajte nas
          </button>
        </div>
      </section>
    </main>
  );
}
