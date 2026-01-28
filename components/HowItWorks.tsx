export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Izberi',
      description: 'Prebrskaj ponudbo lokalnih kmetov in izberi sveže pridelke',
      icon: '🔍',
    },
    {
      number: 2,
      title: 'Naroči',
      description: 'Dodaj v košarico in oddaj naročilo v nekaj klikih',
      icon: '🛒',
    },
    {
      number: 3,
      title: 'Prejmi',
      description: 'Dvigni na kmetiji ali prejmi dostavo na dom',
      icon: '📦',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Kako deluje
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            V treh preprostih korakih do svežih kmetijskih pridelkov
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              {/* Connector Line */}
              {step.number < 3 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-green-300 to-transparent" />
              )}
              
              <div className="relative bg-gradient-to-br from-green-50 to-amber-50 rounded-2xl p-8 text-center hover:shadow-lg transition">
                {/* Step Number */}
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="text-6xl mb-4">{step.icon}</div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
