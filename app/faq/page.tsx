'use client'

import { useState } from 'react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Kako deluje Mojkmet.eu?',
      answer: 'Mojkmet.eu je platforma, ki povezuje slovenske kmete neposredno s potrošniki. Kmeti objavljajo svoje pridelke, vi pa jih naročite in prejmete sveže na dom. Brez posrednikov, brez dolgih dobavnih verig - samo sveža hrana iz vaše regije.'
    },
    {
      question: 'Ali je dostava brezplačna?',
      answer: 'Dostava je brezplačna za naročila nad 30€. Za manjša naročila zaračunamo 3,50€ dostave. Dostavljamo v 2-4 delovnih dneh, odvisno od vaše lokacije in razpoložljivosti izdelkov.'
    },
    {
      question: 'Kako vem, da so izdelki res sveži?',
      answer: 'Vsi naši kmeti so preverjeni in certificirani. Izdelki so pobrani na dan odpreme ali najkasneje dan prej. Pri vsakem izdelku vidite datum nabiranja/proizvodnje, prav tako pa tudi oceno in mnenja drugih kupcev.'
    },
    {
      question: 'Kaj če nisem zadovoljen z izdelkom?',
      answer: 'Vaše zadovoljstvo je naša prioriteta. Če niste zadovoljni z izdelkom, nas kontaktirajte v 24 urah po dostavi. Ponudimo vam vračilo denarja ali zamenjavo izdelka. Glejte našo politiko vračil za več informacij.'
    },
    {
      question: 'Ali lahko naročim v naprej za določen datum?',
      answer: 'Da! Pri zaključku nakupa lahko izberete želeni datum dostave. Priporočamo naročilo vsaj 2 dni vnaprej, da kmet lahko pripravi vaše naročilo. Za določene izdelke (npr. pekovsko, ribe) pa je mogoče potrebno daljše napovedovanje.'
    },
    {
      question: 'Kako plačam naročilo?',
      answer: 'Sprejemamo plačila s kreditnimi/debetnimi karticami (Visa, Mastercard), PayPal in plačilo po povzetju. Vsa plačila so varna in šifrirana preko SSL certifikata.'
    },
    {
      question: 'Ali lahko spremljam svoje naročilo?',
      answer: 'Seveda! Ko kmet pripravi vaše naročilo in ga odda v dostavo, prejmete e-pošto s sledilno številko. Svoj naročilni status lahko spremljate tudi v vašem računu pod "Moja naročila".'
    },
    {
      question: 'Kaj če sem kmet in bi se rad pridružil platformi?',
      answer: 'Odlično! Registracija je preprosta in brezplačna za prve 3 mesece. Obiščite našo stran "Za kmete" ali nas kontaktirajte na kmeti@mojkmet.eu. Naša ekipa vam bo pomagala pri vsem procesu - od registracije do prve prodaje.'
    },
    {
      question: 'Ali obstajajo količinske omejitve za naročila?',
      answer: 'Minimalno naročilo je 10€. Maksimalne omejitve ni, vendar so nekateri izdelki omejeni z zalogami kmeta. Pri večjih naročilih (nad 200€) priporočamo, da kmetijo kontaktirate vnaprej za potrditev razpoložljivosti.'
    },
    {
      question: 'Kako dolgo je rok uporabnosti izdelkov?',
      answer: 'Rok uporabnosti je odvisen od izdelka. Sveža zelenjava in sadje običajno trajata 5-7 dni, mlečni izdelki 7-14 dni, meso 3-5 dni (sveže) ali več mesecev (zamrznjeno). Pri vsakem izdelku je naveden rok uporabnosti, ki je bil določen s strani proizvajalca.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pogosta vprašanja</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Odgovori na najpogostejša vprašanja o Mojkmet.eu
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition"
                  >
                    <span className="font-semibold text-lg pr-4">{faq.question}</span>
                    <span className={`text-2xl text-green-600 transition-transform ${openIndex === index ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Niste našli odgovora?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Naša ekipa za podporo je tukaj, da vam pomaga s kakršnimkoli vprašanjem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Kontaktirajte nas
              </a>
              <a 
                href="mailto:podpora@mojkmet.eu" 
                className="bg-white border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition"
              >
                Pošljite e-pošto
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Koristni nasveti</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="font-bold text-lg mb-3">Prvi nakup</h3>
              <p className="text-gray-600">
                Preglejte naš vodič za prve kupce in izkoristite 10% popust na prvo naročilo.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="font-bold text-lg mb-3">Mobilna aplikacija</h3>
              <p className="text-gray-600">
                Prenesite našo aplikacijo za lažje naročanje in ekskluzivne ponudbe.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-5xl mb-4">💌</div>
              <h3 className="font-bold text-lg mb-3">Novice</h3>
              <p className="text-gray-600">
                Prijavite se na newsletter za najnovejše ponudbe in recepte.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
