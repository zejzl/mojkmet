'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export default function CartButton() {
  const { getCartCount } = useCart()
  const totalItems = getCartCount()

  return (
    <Link
      href="/cart"
      className="relative text-gray-700 hover:text-green-600 transition"
      title="Kosarco"
    >
      <span className="text-2xl">&#x1F6D2;</span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  )
}
