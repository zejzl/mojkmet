import Link from 'next/link'

export default function Categories() {
  const categories = [
    { name: 'Mleko in mlecni izdelki', slug: 'mlecni-izdelki', icon: '🥛', color: 'from-blue-100 to-blue-200' },
    { name: 'Jajca', slug: 'jajca', icon: '🥚', color: 'from-yellow-100 to-yellow-200' },
    { name: 'Zelenjava', slug: 'zelenjava', icon: '🥕', color: 'from-green-100 to-green-200' },
    { name: 'Sadje', slug: 'sadje', icon: '🍎', color: 'from-red-100 to-red-200' },
    { name: 'Meso', slug: 'meso', icon: '🥩', color: 'from-pink-100 to-pink-200' },
    { name: 'Med in cebelji izdelki', slug: 'med', icon: '🍯', color: 'from-amber-100 to-amber-200' },
    { name: 'Pekarna', slug: 'pekarna', icon: '🍞', color: 'from-orange-100 to-orange-200' },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Kategorije
          </h2>
          <p className="text-xl text-gray-600">
            Raziskujte sveze pridelke po kategorijah
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-center hover:scale-105 transition group`}
            >
              <div className="text-5xl mb-3 group-hover:scale-110 transition">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
