export default function AboutPage() {
  const values = [
    {
      title: 'Lokalno',
      icon: '🏠',
      description: 'Podpiramo lokalne kmete in kratke dobavne verige',
    },
    {
      title: 'Svežina',
      icon: '🌱',
      description: 'Zagotavljamo največjo svežino od njive do vaše mize',
    },
    {
      title: 'Transparentnost',
      icon: '👁️',
      description: 'Veste natanko, kje in kako je bilo pridelano vaše živilo',
    },
    {
      title: 'Skupnost',
      icon: '🤝',
      description: 'Gradimo most med kmeti in potrošniki',
    },
  ];

  const team = [
    {
      name: 'Marko Novak',
      role: 'Ustanovitelj & CEO',
      bio: 'Odraščal na družinski kmetiji in pozna izzive lokalnih kmetov',
      icon: '👨‍💼',
    },
    {
      name: 'Ana Kovač',
      role: 'Vodja operacij',
      bio: 'Strokovnjakinja za logistiko in dostavo svežih izdelkov',
      icon: '👩‍💼',
    },
    {
      name: 'Janez Horvat',
      role: 'Vodja partnerstev',
      bio: 'Povezuje kmete s platformo in zagotavlja kakovost',
      icon: '👨‍🌾',
    },
  ];

  return (
    <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">O nas</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Povezujemo slovenske kmete s potrošniki za bolj lokalno prihodnost
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Naša zgodba</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <p>
                  Mojkmet.eu je nastal iz preprostega prepričanja: lokalno pridelana hrana je boljša za vas, 
                  za kmete in za okolje. Ugotovili smo, da je preveč korakov med kmetom in končnim potrošnikom, 
                  kar dviguje cene in zmanjšuje svežino.
                </p>
                <p>
                  Naša platforma odpravi nepotrebne posrednike in omogoča kmetom, da prodajajo neposredno kupcem. 
                  To pomeni svežo hrano za vas in pošteno ceno za kmete. Vsi zmagajo, razen posrednikov.
                </p>
                <p>
                  Od našega začetka leta 2024 smo povezali več kot 150 lokalnih kmetij z več kot 5.000 zadovoljnimi 
                  kupci po vsej Sloveniji. To je šele začetek.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Naše vrednote</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {values.map((value) => (
                <div key={value.title} className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-lg transition">
                  <div className="text-6xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Naša ekipa</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {team.map((member) => (
                <div key={member.name} className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-200">
                  <div className="text-7xl mb-4">{member.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-green-600 font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-green-600 text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
              <div>
                <div className="text-5xl font-bold mb-2">150+</div>
                <div className="text-xl">Kmetij</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">5,000+</div>
                <div className="text-xl">Zadovoljnih strank</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">20,000+</div>
                <div className="text-xl">Dostavljenih naročil</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">98%</div>
                <div className="text-xl">Pozitivnih ocen</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Pridružite se našemu poslanstvu</h2>
              <p className="text-xl text-gray-600 mb-8">
                Ali ste kmet, ki želi prodajati neposredno? Ali kupec, ki išče lokalno hrano? 
                Prostor je za vse.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition">
                  Registrirajte kmetijo
                </button>
                <button className="bg-white border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition">
                  Začnite nakupovati
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
  );
}
