export default function TermsPage() {
  const sections = [
    {
      title: '1. Splošne določbe',
      icon: '📜',
      content: [
        'Ti splošni pogoji urejajo razmerje med Mojkmet.eu, s.p. (v nadaljevanju "ponudnik") in uporabniki spletne platforme.',
        'Z uporabo naših storitev se strinjate s temi pogoji.',
        'Ponudnik si pridržuje pravico do spremembe pogojev. O spremembah boste obveščeni po e-pošti.',
        'Nadaljevanje uporabe storitev po spremembah pomeni sprejem novih pogojev.',
      ],
    },
    {
      title: '2. Registracija in račun',
      icon: '👤',
      content: [
        'Za nakup izdelkov je potrebna registracija z veljavnimi podatki.',
        'Odgovorni ste za zaupnost svojega gesla in vseh aktivnosti na vašem računu.',
        'Če menite, da je vaš račun ogrožen, nas takoj obvestite.',
        'Račun lahko uporabljate samo vi. Prenos računa na drugo osebo ni dovoljen.',
        'Ponudnik si pridržuje pravico do blokade ali izbrisa računa v primeru kršitev pogojev.',
      ],
    },
    {
      title: '3. Naročanje in plačilo',
      icon: '💳',
      content: [
        'Naročilo je zavezujoče, ko ga potrdite in opravite plačilo.',
        'Vse cene so v evrih (EUR) in vključujejo DDV.',
        'Ponudnik si pridržuje pravico do spremembe cen brez predhodnega obvestila.',
        'Plačilo je možno s kreditno/debetno kartico, PayPal ali plačilom ob dostavi (po dogovoru).',
        'V primeru neuspešnega plačila bo naročilo avtomatsko preklicano.',
        'Račun boste prejeli po e-pošti po uspešnem plačilu.',
      ],
    },
    {
      title: '4. Dostava',
      icon: '🚚',
      content: [
        'Dostava je mogoča na naslove v Sloveniji.',
        'Dobavni roki so informativne narave in niso zavezujoči.',
        'Pri dostavi morate preveriti pošiljko in prijaviti morebitne poškodbe.',
        'Če vas ne bo doma, bomo poskusili dostaviti naslednji dan ali pustiti na dogovorjenem varnem mestu.',
        'Za zamude pri dostavi, ki so posledica višje sile ali izjem okoliščin, ponudnik ne odgovarja.',
      ],
    },
    {
      title: '5. Pravica do odstopa',
      icon: '↩️',
      content: [
        'Pri spletnih nakupih imate pravico odstopiti od pogodbe v 14 dneh brez navedbe razloga.',
        'Ta pravica NE velja za sveža živila, ki so pokvarljiva po naravi.',
        'Za odstop od pogodbe pošljite pisno izjavo na info@mojkmet.eu.',
        'Vračilo plačila izvedemo v 14 dneh po prejemu vašega odstopa.',
        'Stroške vračila izdelkov krijete sami, razen če je izdelek okvarjen.',
      ],
    },
    {
      title: '6. Reklamacije',
      icon: '⚠️',
      content: [
        'Za neskladne izdelke lahko uveljavljate reklamacijo v skladu z Zakonom o varstvu potrošnikov.',
        'Reklamacijo moramo prejeti v 48 urah po dostavi s fotografijo izdelka.',
        'Ponudnik bo reklamacijo preučil in odgovoril v 15 dneh.',
        'Upravičene reklamacije bomo rešili z zamenjavo, popravo, znižanjem cene ali vrnitvijo denarja.',
      ],
    },
    {
      title: '7. Omejitev odgovornosti',
      icon: '🛡️',
      content: [
        'Ponudnik ne odgovarja za škodo, ki nastane zaradi napačne uporabe izdelkov.',
        'Ponudnik si prizadeva za točnost informacij, vendar ne jamči za morebitne napake v opisih.',
        'Ponudnik ne odgovarja za začasno nedostopnost spletne strani zaradi vzdrževanja ali tehničnih težav.',
        'Odgovornost ponudnika je omejena na vrednost posameznega naročila.',
      ],
    },
    {
      title: '8. Intelektualna lastnina',
      icon: '©️',
      content: [
        'Vse vsebine na spletni strani (besedila, slike, logotipi) so last ponudnika ali licenčnih partnerjev.',
        'Uporaba vsebin za komercialne namene brez pisnega dovoljenja ni dovoljena.',
        'Dovoljeno je prelaganje za osebno, nekomercialno uporabo.',
      ],
    },
  ];

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Splošni pogoji poslovanja</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Pravila in pogoji uporabe platforme Mojkmet.eu
          </p>
          <p className="mt-4 text-sm opacity-90">
            Nazadnje posodobljeno: 22. februar 2026
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Dobrodošli na Mojkmet.eu</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Mojkmet.eu, s.p., s sedežem na Dunajski cesti 123, 1000 Ljubljana, matična številka: 
                  1234567000, davčna številka: SI12345678 (v nadaljevanju "ponudnik") upravlja spletno 
                  platformo za povezavo lokalnih kmetij in potrošnikov.
                </p>
                <p>
                  Ti splošni pogoji urejajo uporabo platforme in nakup izdelkov. Prosimo, da jih natančno 
                  preberete pred uporabo naših storitev.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
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

      {/* Additional Important Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Farmers */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">👨‍🌾</div>
                <h2 className="text-2xl font-bold">9. Pogoji za kmete</h2>
              </div>
              <ul className="space-y-3 text-gray-700 leading-relaxed">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>
                    Kmetije, ki želijo prodajati preko platforme, morajo biti registrirane in imeti veljavno dovoljenje za prodajo.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>
                    Kmetije jamčijo za kakovost, svežino in varnost svojih izdelkov.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>
                    Ponudnik zaračuna provizijo od prodaje v skladu z izbranim paketom.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>
                    Kmetije morajo zagotoviti točne opise izdelkov in slike.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>
                    Ponudnik si pridržuje pravico do odstranitve kmetije, ki krši pogoje ali prejme večkratne negativne ocene.
                  </span>
                </li>
              </ul>
            </div>

            {/* Prohibited Activities */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">🚫</div>
                <h2 className="text-2xl font-bold">10. Prepovedane dejavnosti</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Pri uporabi platforme so prepovedane naslednje aktivnosti:
              </p>
              <ul className="space-y-3 text-gray-700 leading-relaxed">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <span>Zloraba platforme za nezakonite namene</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <span>Poskusi vdora v sistem ali kraja podatkov</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <span>Objavljanje lažnih informacij ali goljufive ponudbe</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <span>Žaljiva, diskriminatorna ali sovražna komunikacija</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <span>Izkoriščanje tehničnih napak za lastno korist</span>
                </li>
              </ul>
            </div>

            {/* Privacy Reference */}
            <div className="bg-green-50 rounded-xl p-8 border-2 border-green-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">🔒</div>
                <h2 className="text-2xl font-bold">11. Varstvo podatkov</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Varstvo vaših osebnih podatkov je podrobno urejeno v naši Politiki zasebnosti, 
                ki je skladna z GDPR in slovensko zakonodajo.
              </p>
              <a 
                href="/privacy" 
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Preberite politiko zasebnosti
              </a>
            </div>

            {/* Dispute Resolution */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">⚖️</div>
                <h2 className="text-2xl font-bold">12. Reševanje sporov</h2>
              </div>
              <ul className="space-y-3 text-gray-700 leading-relaxed">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>
                    V primeru spora se bomo trudili najti rešitev po mirni poti.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>
                    Potrošniki lahko za reševanje sporov uporabijo platformo za spletno reševanje potrošniških sporov: 
                    <a href="https://ec.europa.eu/consumers/odr" className="text-green-600 hover:underline ml-1" target="_blank" rel="noopener">
                      ec.europa.eu/consumers/odr
                    </a>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>
                    Pristojna zunajsodna institucija za reševanje sporov: Zveza potrošnikov Slovenije (ZPS)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>
                    Za spore, ki jih ni mogoče rešiti zunajsodno, je pristojno sodišče v Ljubljani.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>
                    Za razmerja se uporablja slovensko pravo.
                  </span>
                </li>
              </ul>
            </div>

            {/* Final Provisions */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">📋</div>
                <h2 className="text-2xl font-bold">13. Končne določbe</h2>
              </div>
              <ul className="space-y-3 text-gray-700 leading-relaxed">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>
                    Ti splošni pogoji so objavljeni na spletni strani in dostopni vsakomur.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>
                    Ponudnik si pridržuje pravico do spremembe pogojev. Spremembe veljajo od objave naprej.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>
                    Če je katera od določb neveljavna, to ne vpliva na veljavnost ostalih določb.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">•</span>
                  <span>
                    Za vprašanja v zvezi s temi pogoji nas kontaktirajte na info@mojkmet.eu.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Kontaktni podatki ponudnika</h2>
            <div className="bg-white rounded-xl p-8 shadow-md text-center">
              <h3 className="text-xl font-bold mb-6">Mojkmet.eu, s.p.</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
                <div>
                  <p className="text-sm text-gray-600">Naslov:</p>
                  <p className="font-semibold">Dunajska cesta 123, 1000 Ljubljana</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Matična številka:</p>
                  <p className="font-semibold">1234567000</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Davčna številka:</p>
                  <p className="font-semibold">SI12345678</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">E-pošta:</p>
                  <p className="font-semibold text-green-600">info@mojkmet.eu</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefon:</p>
                  <p className="font-semibold text-green-600">+386 1 234 5678</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transakcijski račun:</p>
                  <p className="font-semibold">SI56 0110 0603 0347 521</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consumer Rights */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-blue-50 rounded-xl p-8 border-2 border-blue-200">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🛡️</div>
              <h2 className="text-2xl font-bold">Pravice potrošnikov</h2>
            </div>
            <p className="text-gray-700 text-center mb-6">
              Kot potrošnik imate pravice, ki so zaščitene z zakonodajo. Za več informacij o 
              vaših pravicah obiščite:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.zps.si" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
              >
                Zveza potrošnikov Slovenije
              </a>
              <a 
                href="https://www.gov.si/teme/varstvo-potrosnikov/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
              >
                Varstvo potrošnikov (GOV.SI)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Imate vprašanja?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Naša ekipa vam bo z veseljem pomagala razumeti naše pogoje
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
