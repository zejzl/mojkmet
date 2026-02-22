export default function TermsPage() {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pogoji uporabe</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Splošni pogoji poslovanja za uporabo platforme Mojkmet.eu
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
                  Dobrodošli na Mojkmet.eu! Ti splošni pogoji poslovanja ("Pogoji") urejajo vašo uporabo 
                  spletne platforme Mojkmet.eu in nakupovanje izdelkov preko nje. Z uporabo naše platforme 
                  ali nakupom izdelkov se strinjate s temi Pogoji.
                </p>
                <p>
                  Platformo Mojkmet.eu upravlja družba <strong>Mojkmet d.o.o.</strong>, Slovenska cesta 54, 
                  1000 Ljubljana, Slovenija, matična številka 1234567000, davčna številka SI12345678.
                </p>
              </div>
            </div>

            {/* Definitions */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Opredelitev pojmov</h2>
              <div className="text-gray-700 space-y-3">
                <p><strong>"Platforma"</strong> pomeni spletno stran Mojkmet.eu in vse povezane storitve.</p>
                <p><strong>"Uporabnik"</strong> pomeni fizično ali pravno osebo, ki uporablja Platformo.</p>
                <p><strong>"Kupec"</strong> pomeni Uporabnika, ki kupi izdelke preko Platforme.</p>
                <p><strong>"Prodajalec"</strong> pomeni lokalnega kmeta ali pridelovalca, ki prodaja izdelke preko Platforme.</p>
                <p><strong>"Izdelek"</strong> pomeni kmetijski ali prehrambeni izdelek, ki ga Prodajalec ponuja na Platformi.</p>
              </div>
            </div>

            {/* Registration */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Registracija in račun</h2>
              <div className="text-gray-700 space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">2.1 Registracija</h3>
                  <p>
                    Za nakup izdelkov je potrebna registracija. Pri registraciji se zavezujete, da boste 
                    posredovali točne, popolne in trenutne informacije ter jih sproti posodabljali.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">2.2 Starostna omejitev</h3>
                  <p>
                    Platforma je namenjena osebam, starejšim od 18 let. Z registracijo potrjujete, da ste 
                    polnoletni in poslovno sposobni.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">2.3 Varnost računa</h3>
                  <p>
                    Odgovorni ste za ohranjanje zaupnosti vašega gesla in računa. Vse dejavnosti, ki se 
                    zgodijo preko vašega računa, so vaša odgovornost.
                  </p>
                </div>
              </div>
            </div>

            {/* Orders and Payment */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Naročila in plačila</h2>
              <div className="text-gray-700 space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">3.1 Oddaja naročila</h3>
                  <p>
                    Z oddajo naročila podate zavezujočo ponudbo za nakup izdelkov. Naročilo je potrjeno, 
                    ko prejmete e-poštno potrditev od nas.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">3.2 Cene</h3>
                  <p>
                    Vse cene so v evrih (EUR) in vključujejo DDV. Stroški dostave so navedeni posebej 
                    in se dodajo k ceni izdelkov.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">3.3 Plačilo</h3>
                  <p>
                    Sprejemamo plačila s kreditnimi/debetnimi karticami, PayPal in plačilo po povzetju. 
                    Plačilo mora biti opravljeno pred dostavo, razen pri plačilu po povzetju.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">3.4 Zavrnitev naročila</h3>
                  <p>
                    Pridržujemo si pravico zavrniti ali preklicati naročilo v primeru nedostopnosti 
                    izdelka, napake v ceni, suma na goljufijo ali drugih upravičenih razlogov.
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Dostava</h2>
              <div className="text-gray-700 space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">4.1 Območje dostave</h3>
                  <p>
                    Dostavljamo po vsej Sloveniji. Roki in cene dostave so odvisni od lokacije in so 
                    navedeni na strani <a href="/shipping" className="text-green-600 hover:underline">Dostava</a>.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">4.2 Rok dostave</h3>
                  <p>
                    Roki dostave so okvirni in niso zavezujoči. Trudimo se, da dostavimo v navedenih rokih, 
                    vendar lahko pride do zamud zaradi vremenskih razmer ali drugih nepredvidljivih okoliščin.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">4.3 Prevzem pošiljke</h3>
                  <p>
                    Ob prevzemu preverite celovitost in stanje pošiljke. Morebitne poškodbe ali manjkajoče 
                    izdelke nemudoma sporočite nam in kurirju.
                  </p>
                </div>
              </div>
            </div>

            {/* Returns */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Vračilo in reklamacije</h2>
              <div className="text-gray-700 space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">5.1 Pravica do odstopa</h3>
                  <p>
                    Zaradi narave izdelkov (sveža, pokvarljiva živila) pravica do odstopa od pogodbe v 
                    14 dneh ne velja. Vračila so možna samo v primeru okvarjenih ali napačnih izdelkov.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">5.2 Reklamacije</h3>
                  <p>
                    Reklamacije morate vložiti v 24 urah po prevzemu pošiljke na 
                    <a href="mailto:podpora@mojkmet.eu" className="text-green-600 hover:underline"> podpora@mojkmet.eu</a>. 
                    Več informacij na strani <a href="/returns" className="text-green-600 hover:underline">Vračila</a>.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">5.3 Povračilo</h3>
                  <p>
                    V primeru upravičene reklamacije vam vrnemo plačilo ali ponudimo zamenjavo izdelka 
                    v roku 3-5 delovnih dni.
                  </p>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Informacije o izdelkih</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  Informacije o izdelkih (opisi, fotografije, cene) zagotavljajo Prodajalci. Trudimo se, 
                  da so vse informacije točne, vendar lahko pride do napak ali sprememb.
                </p>
                <p>
                  Fotografije izdelkov so simbolične in lahko odstopajo od dejanskega videza izdelka. 
                  Teža in velikost lahko varirata zaradi naravnih razlik v pridelkih.
                </p>
              </div>
            </div>

            {/* Prohibited Uses */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Prepovedana uporaba</h2>
              <div className="text-gray-700 space-y-2">
                <p>Platforme ne smete uporabljati za:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Kršenje veljavnih zakonov ali predpisov</li>
                  <li>Lažno predstavljanje ali goljufije</li>
                  <li>Nalaganje škodljive kode ali virusov</li>
                  <li>Nezakonito zbiranje podatkov drugih uporabnikov</li>
                  <li>Motenje delovanja Platforme</li>
                  <li>Komercializacijo vsebine brez naše pisne privolitve</li>
                </ul>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Intelektualna lastnina</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  Vsa vsebina na Platformi (besedila, grafike, logotipi, ikone, slike, avdio posnetki, 
                  programska oprema) je lastnina Mojkmet d.o.o. ali naših Prodajalcev in je zaščitena z 
                  avtorskimi pravicami in drugimi zakoni o intelektualni lastnini.
                </p>
                <p>
                  Prepovedano je reproduciranje, distribuiranje, modificiranje ali javno prikazovanje 
                  katere koli vsebine brez našega pisnega dovoljenja.
                </p>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Omejitev odgovornosti</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  <strong>Mojkmet d.o.o.</strong> ne odgovarja za:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Kakovost, varnost ali zakonitost izdelkov, ki jih prodajajo Prodajalci</li>
                  <li>Točnost ali popolnost informacij o izdelkih, ki jih posredujejo Prodajalci</li>
                  <li>Posredne, naključne ali posledične škode</li>
                  <li>Izgubo dobička ali podatkov</li>
                  <li>Prekinitve ali napake v delovanju Platforme</li>
                </ul>
                <p className="mt-3">
                  Naša skupna odgovornost je v vsakem primeru omejena na vrednost vašega naročila.
                </p>
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">10. Zasebnost</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  Vaša zasebnost nam je pomembna. Podrobnosti o tem, kako zbiramo, uporabljamo in varujemo 
                  vaše osebne podatke, najdete v naši 
                  <a href="/privacy" className="text-green-600 hover:underline"> Politiki zasebnosti</a>.
                </p>
              </div>
            </div>

            {/* Changes to Terms */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">11. Spremembe pogojev</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  Pridržujemo si pravico do spremembe teh Pogojev kadarkoli. O pomembnih spremembah vas 
                  bomo obvestili po e-pošti ali z obvestilom na Platformi. Nadaljevanje uporabe Platforme 
                  po spremembi pomeni, da sprejemate nove Pogoje.
                </p>
              </div>
            </div>

            {/* Governing Law */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">12. Pravo in pristojnost</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  Ti Pogoji se razlagajo v skladu s slovenskim pravom. Za reševanje sporov je pristojno 
                  stvarno pristojno sodišče v Ljubljani.
                </p>
                <p>
                  Potrošniki imajo pravico do izvensodnega reševanja sporov preko platforme 
                  <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline"> EU ODR</a>.
                </p>
              </div>
            </div>

            {/* Severability */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">13. Delna neveljavnost</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  Če se katera koli določba teh Pogojev izkaže za neveljavno ali neizvedljivo, to ne vpliva 
                  na veljavnost preostalih določb.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">14. Kontakt</h2>
              <div className="text-gray-700 space-y-3">
                <p>Za vprašanja o teh Pogojih nas kontaktirajte:</p>
                <p><strong>Mojkmet d.o.o.</strong></p>
                <p>Slovenska cesta 54, 1000 Ljubljana, Slovenija</p>
                <p>E-pošta: <a href="mailto:info@mojkmet.eu" className="text-green-600 hover:underline font-semibold">info@mojkmet.eu</a></p>
                <p>Telefon: +386 1 234 5678</p>
                <p>Matična številka: 1234567000</p>
                <p>Davčna številka: SI12345678</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
