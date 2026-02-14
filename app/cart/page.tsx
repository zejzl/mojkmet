'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Vaša košarica je prazna
          </h1>
          <p className="text-gray-600 mb-8">
            Dodajte izdelke v košarico za nadaljevanje
          </p>
          <Link
            href="/products"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Prebrskaj izdelke
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-grow bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            🛒 Vaša košarica
          </h1>
          <p className="text-lg opacity-90">
            {totalItems} {totalItems === 1 ? 'izdelek' : totalItems === 2 ? 'izdelka' : 'izdelkov'} v košarici
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.productId} className="p-6">
                      <div className="flex gap-6">
                        {/* Product Icon */}
                        <div className="flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 w-24 h-24 rounded-lg flex items-center justify-center text-4xl">
                          {item.categoryIcon}
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <span>🌾</span> {item.farmName}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                              title="Odstrani iz košarice"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="text-gray-700">
                              <span className="font-bold text-lg">
                                {item.price.toFixed(2)} EUR
                              </span>
                              <span className="text-sm text-gray-500">/{item.unit}</span>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold transition"
                                disabled={item.quantity <= 1}
                              >
                                −
                              </button>
                              <span className="font-semibold text-gray-900 min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={item.quantity >= item.stock}
                              >
                                +
                              </button>
                            </div>

                            {/* Subtotal */}
                            <div className="text-right min-w-[6rem]">
                              <div className="font-bold text-gray-900 text-lg">
                                {(item.price * item.quantity).toFixed(2)} EUR
                              </div>
                              {item.quantity >= item.stock && (
                                <div className="text-xs text-yellow-600">
                                  Max. količina
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Povzetek naročila
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Izdelki ({totalItems})</span>
                    <span className="font-semibold">{totalPrice.toFixed(2)} EUR</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Dostava</span>
                    <span className="font-semibold">Po dogovoru</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Skupaj</span>
                    <span className="text-green-600">{totalPrice.toFixed(2)} EUR</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-green-600 text-white text-center px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold mb-3"
                >
                  Nadaljuj na blagajno
                </Link>

                <Link
                  href="/products"
                  className="block w-full text-center text-green-600 hover:text-green-700 font-medium"
                >
                  ← Nadaljuj z nakupovanjem
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
