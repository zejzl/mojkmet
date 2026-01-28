import Link from 'next/link'

export default function Categories() {
  const categories = [
    { name: 'Mleko in mlečni izdelki', icon: '🥛', count: 45, color: 'from-blue-100 to-blue-200' },
    { name: 'Jajca', icon: '🥚', count: 32, color: 'from-yellow-100 to-yellow-200' },
    { name: 'Zelenjava', icon: '🥕', count: 78, color: 'from-green-100 to-green-200' },
    { name: 'Sadje', icon: '🍎', count: 54, color: 'from-red-100 to-red-200' },
    { name: 'Meso', icon: '🥩', count: 28, color: 'from-pink-100 to-pink-200' },
    { name: 'Med in čebelji izdelki', icon: '🍯', count: 19, color: 'from-amber-100 to-amber-200' },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Kategorije
          </h2>
          <p className="text-xl text-gray-600">
            Raziskujte sveže pridelke po kategorijah
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/products?category=${category.name}`}
              className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-center hover:scale-105 transition group`}
            >
              <div className="text-5xl mb-3 group-hover:scale-110 transition">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                {category.name}
              </h3>
              <p className="text-xs text-gray-600">
                {category.count} izdelkov
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
