'use client'

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kontakt</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Imate vprašanje? Radi bi se pridružili? Pišite nam!
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Pošljite nam sporočilo</h2>
              
              {submitted && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                  Hvala za vaše sporočilo! Odgovorili vam bomo v najkrajšem možnem času.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Ime in priimek *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Janez Novak"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    E-pošta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="janez@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Zadeva *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Izberite zadevo</option>
                    <option value="general">Splošno vprašanje</option>
                    <option value="farmer">Želim pridružiti kmetijo</option>
                    <option value="order">Vprašanje o naročilu</option>
                    <option value="technical">Tehnična podpora</option>
                    <option value="partnership">Poslovno sodelovanje</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Sporočilo *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    placeholder="Vaše sporočilo..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Pošlji sporočilo
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">Kontaktni podatki</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">📍</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Naslov</h3>
                      <p className="text-gray-600">
                        Mojkmet d.o.o.<br />
                        Slovenska cesta 54<br />
                        1000 Ljubljana<br />
                        Slovenija
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="text-3xl">📧</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">E-pošta</h3>
                      <p className="text-gray-600">
                        Splošna vprašanja: <a href="mailto:info@mojkmet.eu" className="text-green-600 hover:underline">info@mojkmet.eu</a><br />
                        Podpora: <a href="mailto:podpora@mojkmet.eu" className="text-green-600 hover:underline">podpora@mojkmet.eu</a><br />
                        Za kmete: <a href="mailto:kmeti@mojkmet.eu" className="text-green-600 hover:underline">kmeti@mojkmet.eu</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="text-3xl">📞</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Telefon</h3>
                      <p className="text-gray-600">
                        +386 1 234 5678<br />
                        <span className="text-sm text-gray-500">Pon-Pet: 8:00 - 17:00</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="text-3xl">⏰</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Delovni čas</h3>
                      <p className="text-gray-600">
                        Ponedeljek - Petek: 8:00 - 17:00<br />
                        Sobota: 9:00 - 13:00<br />
                        Nedelja: Zaprto
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-md p-8">
                <h3 className="text-xl font-bold mb-3">Hitra podpora</h3>
                <p className="mb-4">
                  Za nujne zadeve lahko pokličete našo telefonsko linijo za podporo.
                </p>
                <a 
                  href="tel:+38612345678" 
                  className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Pokliči zdaj
                </a>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8">
                <h3 className="text-xl font-bold mb-3">Sledite nam</h3>
                <div className="flex gap-4">
                  <a href="#" className="text-4xl hover:scale-110 transition">📘</a>
                  <a href="#" className="text-4xl hover:scale-110 transition">📷</a>
                  <a href="#" className="text-4xl hover:scale-110 transition">🐦</a>
                  <a href="#" className="text-4xl hover:scale-110 transition">💼</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Naša lokacija</h2>
            <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">🗺️</div>
                <p>Zemljevid lokacije</p>
                <p className="text-sm">(Google Maps embed)</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
