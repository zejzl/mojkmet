export default function TrustBadges() {
  const stats = [
    { value: '100+', label: 'Kmetij', icon: '🏡' },
    { value: '500+', label: 'Srečnih strank', icon: '😊' },
    { value: '1000+', label: 'Dostavljenih naročil', icon: '📦' },
    { value: '4.9', label: 'Povprečna ocena', icon: '⭐' },
  ]

  const features = [
    {
      title: 'Svežina zagotovljena',
      description: 'Vse pridelke dostavimo v 1-3 dneh',
      icon: '✓',
    },
    {
      title: 'Lokalni kmetje',
      description: 'Podpirajte lokalne slovenske kmete',
      icon: '✓',
    },
    {
      title: 'Poštene cene',
      description: 'Brez posrednikov, brez napihnjenj',
      icon: '✓',
    },
    {
      title: 'Varno plačilo',
      description: 'Zaščiteno plačevanje s Stripe',
      icon: '✓',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-green-600 to-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-5xl mb-2">{stat.icon}</div>
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-green-100">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white/10 backdrop-blur rounded-xl p-6">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-green-100">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
