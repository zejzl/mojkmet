'use client'

import { useCart } from '@/lib/cart-context'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <main className="flex-grow bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-md p-12">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vasa kosarca je prazna</h2>
            <p className="text-gray-500 mb-8">Dodajte izdelke iz nase ponudbe in zacnite z nakupovanjem.</p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Odkrijte izdelke
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const total = getCartTotal()

  return (
    <main className="flex-grow bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kosarca</h1>
          <button
            onClick={clearCart}
            className="text-sm text-gray-500 hover:text-red-600 transition underline"
          >
            Izprazni kosarco
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Item list */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-xl shadow-sm p-5 flex items-start gap-4 border border-gray-100"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {item.categoryIcon}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.farmName}</p>
                  <p className="text-sm text-green-700 font-medium mt-1">
                    {item.price.toFixed(2)} EUR / {item.unit}
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-green-600 hover:text-green-600 transition font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-green-600 hover:text-green-600 transition font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>

                {/* Line total */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900">
                    {(item.price * item.quantity).toFixed(2)} EUR
                  </p>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-xs text-gray-400 hover:text-red-500 transition mt-1"
                  >
                    Odstrani
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Povzetek narocila</h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate pr-2">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="text-gray-900 font-medium whitespace-nowrap">
                      {(item.price * item.quantity).toFixed(2)} EUR
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Skupaj</span>
                  <span className="font-bold text-green-700 text-lg">{total.toFixed(2)} EUR</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Dostava ni vkljucena</p>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-green-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                Nadaljuj na blagajno
              </Link>

              <Link
                href="/products"
                className="block w-full text-center text-sm text-gray-500 hover:text-green-600 mt-4 transition"
              >
                Nadaljuj z nakupovanjem
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
