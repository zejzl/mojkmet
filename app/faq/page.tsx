'use client';

import { useState } from 'react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: 'Naročanje',
      icon: '🛒',
      questions: [
        {
          q: 'Kako lahko naročim izdelke?',
          a: 'Preprosto izberite izdelke, ki jih želite, jih dodajte v košarico in sledite navodilom za zaključek naročila. Potrebovali boste račun in naslov za dostavo.',
        },
        {
          q: 'Kakšen je minimalni znesek naročila?',
          a: 'Minimalni znesek naročila je 15 €. To nam pomaga zagotoviti, da lahko ponudimo brezplačno dostavo v večini regij.',
        },
        {
          q: 'Ali lahko naročim iz več kmetij hkrati?',
          a: 'Da! Vaše naročilo lahko vsebuje izdelke iz različnih kmetij. Označili bomo, kateri izdelki prihajajo od katerih kmetov.',
        },
      ],
    },
    {
      category: 'Dostava',
      icon: '🚚',
      questions: [
        {
          q: 'Kdaj bom prejel svoje naročilo?',
          a: 'Večina naročil je dostavljenih v 2-3 delovnih dneh. Za nekatere sveže izdelke ponujamo tudi dostavo naslednji dan.',
        },
        {
          q: 'Koliko stane dostava?',
          a: 'Dostava je brezplačna za naročila nad 30 €. Za manjša naročila je strošek dostave 3,99 €.',
        },
        {
          q: 'V katere kraje dostavljate?',
          a: 'Dostavljamo po vsej Sloveniji. Nekatere oddaljene lokacije lahko zahtevajo podaljšan čas dostave ali dodatne stroške.',
        },
      ],
    },
    {
      category: 'Plačilo',
      icon: '💳',
      questions: [
        {
          q: 'Kakšni načini plačila so na voljo?',
          a: 'Sprejemamo plačila s kreditnimi/debetnimi karticami (Visa, Mastercard), PayPal in plačilo ob dostavi (po dogovoru).',
        },
        {
          q: 'Ali so moji podatki o plačilu varni?',
          a: 'Absolutno. Uporabljamo šifrirano povezavo SSL in ne shranjujemo podatkov vaših kartic. Vsa plačila obdelujejo varni plačilni partnerji.',
        },
      ],
    },
    {
      category: 'Izdelki in kakovost',
      icon: '✅',
      questions: [
        {
          q: 'Kako vem, da so izdelki sveži?',
          a: 'Vsi izdelki so pobrani ali proizvedeni najkasneje 24 ur pred dostavo. Vsaka kmetija je certificirana in redno pregledana.',
        },
        {
          q: 'Kaj če nisem zadovoljen z izdelkom?',
          a: 'Če niste zadovoljni, nas kontaktirajte v 48 urah po dostavi. Ponudimo polno vračilo ali zamenjavo za večino izdelkov.',
        },
        {
          q: 'Ali so izdelki ekološki?',
          a: 'Veliko naših kmetij uporablja ekološke metode. Vsi ekološko certificirani izdelki so jasno označeni z znakom.',
        },
      ],
    },
    {
      category: 'Račun',
      icon: '👤',
      questions: [
        {
          q: 'Ali potrebujem račun za naročanje?',
          a: 'Da, za oddajo naročila potrebujete račun. Registracija je brezplačna in traja manj kot minuto.',
        },
        {
          q: 'Kako spremenim svoje podatke?',
          a: 'Prijavite se v svoj račun in pojdite na "Nastavitve". Tam lahko posodobite osebne podatke, naslove in nastavitve plačila.',
        },
      ],
    },
  ];

  const toggleFAQ = (categoryIndex: number, questionIndex: number) => {
    const index = categoryIndex * 100 + questionIndex;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pogosta vprašanja</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Odgovori na najpogostejša vprašanja naših uporabnikov
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Poiščite odgovor..."
                className="w-full px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 pl-12"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {faqs.map((category, categoryIndex) => (
              <div key={category.category} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <div className="bg-green-50 p-6 border-b border-green-100">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    <h2 className="text-2xl font-bold">{category.category}</h2>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {category.questions.map((faq, questionIndex) => {
                    const index = categoryIndex * 100 + questionIndex;
                    const isOpen = openIndex === index;
                    
                    return (
                      <div key={questionIndex}>
                        <button
                          onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                          className="w-full text-left p-6 hover:bg-gray-50 transition flex justify-between items-center"
                        >
                          <span className="font-semibold text-lg pr-8">{faq.q}</span>
                          <span className="text-green-600 text-2xl flex-shrink-0">
                            {isOpen ? '−' : '+'}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Uporabne povezave</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <a href="/shipping" className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="font-bold">Dostava</h3>
            </a>
            <a href="/returns" className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition">
              <div className="text-4xl mb-3">↩️</div>
              <h3 className="font-bold">Vračila</h3>
            </a>
            <a href="/privacy" className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold">Zasebnost</h3>
            </a>
            <a href="/contact" className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-bold">Kontakt</h3>
            </a>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-green-50 rounded-xl p-8 border-2 border-green-200 text-center">
            <div className="text-5xl mb-4">🤔</div>
            <h2 className="text-3xl font-bold mb-4">Še vedno potrebujete pomoč?</h2>
            <p className="text-lg text-gray-700 mb-6">
              Naša ekipa za podporo je tu, da vam pomaga. Kontaktirajte nas in z veseljem odgovorimo na vaša vprašanja.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                Pošljite vprašanje
              </button>
              <button className="bg-white border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition">
                Pokličite nas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Priljubljene teme</h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                'Dostava naslednji dan',
                'Ekološki izdelki',
                'Plačilo ob dostavi',
                'Vračilo denarja',
                'Registracija kmetije',
                'Shranjevanje izdelkov',
                'Sezonska hrana',
                'Popusti',
              ].map((topic) => (
                <button 
                  key={topic}
                  className="bg-white border border-gray-300 px-4 py-2 rounded-full hover:bg-green-50 hover:border-green-600 transition"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
