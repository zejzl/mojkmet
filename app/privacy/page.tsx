export default function PrivacyPage() {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Politika zasebnosti</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Kako varujemo in uporabljamo vaše osebne podatke v skladu z GDPR
          </p>
          <p className="text-sm mt-4 opacity-90">Zadnja posodobitev: 22. februar 2026</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Introduction */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Uvod</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Mojkmet.eu, ki ga upravlja podjetje Mojkmet d.o.o. (v nadaljevanju "mi", "nas" ali "Mojkmet"), 
                  spoštuje vašo zasebnost in je zavezano k zaščiti vaših osebnih podatkov. Ta politika zasebnosti 
                  vas obvešča, kako ravnamo z vašimi osebnimi podatki, ko obiščete našo spletno stran in nam 
                  poveste o vaših pravicah glede zasebnosti.
                </p>
                <p>
                  Ta politika zasebnosti je v skladu z Splošno uredbo o varstvu podatkov (GDPR - EU 2016/679) 
                  in slovensko zakonodajo o varstvu osebnih podatkov.
                </p>
              </div>
            </div>

            {/* Data Controller */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Upravljavec podatkov</h2>
              <div className="text-gray-700 space-y-3">
                <p><strong>Mojkmet d.o.o.</strong></p>
                <p>Slovenska cesta 54, 1000 Ljubljana, Slovenija</p>
                <p>Matična številka: 1234567000</p>
                <p>Davčna številka: SI12345678</p>
                <p>E-pošta: <a href="mailto:privacy@mojkmet.eu" className="text-green-600 hover:underline">privacy@mojkmet.eu</a></p>
                <p>Telefon: +386 1 234 5678</p>
              </div>
            </div>

            {/* Data Collection */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Katere podatke zbiramo</h2>
              <div className="text-gray-700 space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">2.1 Podatki, ki jih vi posredujete</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Podatki za registracijo:</strong> ime, priimek, e-poštni naslov, telefonska številka</li>
                    <li><strong>Podatki za dostavo:</strong> naslov dostave, poštna številka, kraj</li>
                    <li><strong>Plačilni podatki:</strong> način plačila (plačilne podatke shranjujejo plačilni procesorji, ne mi)</li>
                    <li><strong>Komunikacija:</strong> vsebina vaših sporočil, povratnih informacij ali pritožb</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">2.2 Podatki, ki jih zbiramo samodejno</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Tehnični podatki:</strong> IP naslov, tip brskalnika, operacijski sistem</li>
                    <li><strong>Podatki o uporabi:</strong> obiskane strani, čas obiska, klikni vzorci</li>
                    <li><strong>Piškotki:</strong> podatki shranjeni preko piškotkov (glej našo politiko piškotkov)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Data Usage */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Kako uporabljamo vaše podatke</h2>
              <div className="text-gray-700">
                <p className="mb-4">Vaše osebne podatke uporabljamo za naslednje namene:</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <div>
                      <strong>Obdelava naročil:</strong> za procesiranje, pakiranje in dostavo vaših naročil
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <div>
                      <strong>Komunikacija:</strong> za odgovarjanje na vprašanja in zagotavljanje podpore strankam
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <div>
                      <strong>Izboljšave storitve:</strong> za analizo uporabe in izboljšanje uporabniške izkušnje
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <div>
                      <strong>Marketing:</strong> pošiljanje ponudb in novosti (samo s vašo privolitvijo)
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <div>
                      <strong>Pravne obveznosti:</strong> izpolnjevanje zakonskih zahtev (npr. izdaja računov)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Basis */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Pravna podlaga za obdelavo</h2>
              <div className="text-gray-700 space-y-3">
                <p>Vaše podatke obdelujemo na podlagi:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Pogodba:</strong> za izvedbo naročila in dostave (člen 6(1)(b) GDPR)</li>
                  <li><strong>Privolitev:</strong> za marketinška sporočila in piškotke (člen 6(1)(a) GDPR)</li>
                  <li><strong>Zakonske obveznosti:</strong> za davčne in računovodske namene (člen 6(1)(c) GDPR)</li>
                  <li><strong>Legitimni interes:</strong> za preprečevanje goljufij in izboljšave storitev (člen 6(1)(f) GDPR)</li>
                </ul>
              </div>
            </div>

            {/* Data Sharing */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Posredovanje podatkov tretjim osebam</h2>
              <div className="text-gray-700 space-y-3">
                <p>Vaše podatke lahko posredujemo naslednjim kategorijam prejemnikov:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Kmeti:</strong> podatke za dostavo (ime, naslov, telefon) za izvedbo naročila</li>
                  <li><strong>Kurirske službe:</strong> podatke potrebne za dostavo paketov</li>
                  <li><strong>Plačilni procesorji:</strong> za procesiranje plačil (npr. Stripe, PayPal)</li>
                  <li><strong>IT ponudniki:</strong> za gostovanje strežnikov in tehnično podporo</li>
                  <li><strong>Analitični orodja:</strong> anonimni podatki za analitiko (Google Analytics)</li>
                </ul>
                <p className="mt-4">
                  <strong>Ne prodajamo</strong> vaših osebnih podatkov tretjim osebam za marketinške namene.
                </p>
              </div>
            </div>

            {/* Data Retention */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Hramba podatkov</h2>
              <div className="text-gray-700 space-y-3">
                <p>Vaše podatke hranimo za naslednja obdobja:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Podatki naročil:</strong> 5 let (zakonska obveznost za davčne namene)</li>
                  <li><strong>Računi uporabnikov:</strong> dokler je račun aktiven + 2 leti po izbrimu</li>
                  <li><strong>Marketinška privolitev:</strong> do preklica ali 3 leta neaktivnosti</li>
                  <li><strong>Tehnični podatki (piškotki):</strong> do 12 mesecev</li>
                </ul>
              </div>
            </div>

            {/* Your Rights */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Vaše pravice</h2>
              <div className="text-gray-700 space-y-3">
                <p>V skladu z GDPR imate naslednje pravice:</p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold mb-2">🔍 Pravica do dostopa</h4>
                    <p className="text-sm">Pravica do kopije vaših osebnih podatkov</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold mb-2">✏️ Pravica do popravka</h4>
                    <p className="text-sm">Popravite netočne ali nepopolne podatke</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold mb-2">🗑️ Pravica do izbrisa</h4>
                    <p className="text-sm">Zahtevajte izbris vaših podatkov</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold mb-2">⛔ Pravica do omejitve</h4>
                    <p className="text-sm">Omejite obdelavo vaših podatkov</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold mb-2">📦 Pravica do prenosljivosti</h4>
                    <p className="text-sm">Prenesite svoje podatke drugam</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-bold mb-2">🚫 Pravica do ugovora</h4>
                    <p className="text-sm">Ugovarjajte določenim obdelavam</p>
                  </div>
                </div>
                <p className="mt-4">
                  Za uveljavljanje pravic nas kontaktirajte na <a href="mailto:privacy@mojkmet.eu" className="text-green-600 hover:underline">privacy@mojkmet.eu</a>
                </p>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Varnost podatkov</h2>
              <div className="text-gray-700 space-y-3">
                <p>Vaše podatke varujemo z naslednjimi ukrepi:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>SSL/TLS šifriranje za vse prenose podatkov</li>
                  <li>Varna shramba podatkov na šifriranih strežnikih</li>
                  <li>Dostop do podatkov imajo samo pooblaščeni zaposleni</li>
                  <li>Redne varnostne revizije in posodobitve</li>
                  <li>Dvopostopkovna avtentikacija za dostop do sistemov</li>
                </ul>
              </div>
            </div>

            {/* Cookies */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Piškotki</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  Naša spletna stran uporablja piškotke za izboljšanje uporabniške izkušnje. Uporabljamo:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Nujno potrebni piškotki:</strong> za delovanje spletne strani (npr. košarica)</li>
                  <li><strong>Analitični piškotki:</strong> za razumevanje uporabe strani (Google Analytics)</li>
                  <li><strong>Marketinški piškotki:</strong> za prikaz relevantnih oglasov (samo s privolitvijo)</li>
                </ul>
                <p className="mt-3">
                  Piškotke lahko upravljate v nastavitvah brskalnika ali preko našega bannerja za piškotke.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">10. Kontakt</h2>
              <div className="text-gray-700 space-y-3">
                <p>Za vprašanja o tej politiki zasebnosti nas kontaktirajte:</p>
                <p>E-pošta: <a href="mailto:privacy@mojkmet.eu" className="text-green-600 hover:underline font-semibold">privacy@mojkmet.eu</a></p>
                <p>Telefon: +386 1 234 5678</p>
                <p>Naslov: Slovenska cesta 54, 1000 Ljubljana</p>
                <p className="mt-4">
                  <strong>Informacijski pooblaščenec Republike Slovenije:</strong><br />
                  Če menite, da kršimo vašo zasebnost, imate pravico do pritožbe pri nadzornem organu:<br />
                  <a href="https://www.ip-rs.si" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">www.ip-rs.si</a>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
