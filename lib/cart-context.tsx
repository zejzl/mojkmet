'use client'

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

export interface CartItem {
  productId: string
  name: string
  price: number
  unit: string
  quantity: number
  farmId: string
  farmName: string
  categoryIcon: string
  maxStock: number
  available?: boolean
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (productId: string) => void
  removeItems: (productIds: string[]) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
}

const CartContext = createContext<CartContextType | null>(null)

const STORAGE_KEY = 'mojkmet-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const { status } = useSession()
  const [items, setItems] = useState<CartItem[]>([])
  const [initialized, setInitialized] = useState(false)
  // Guards the one-time guest->server merge so it fires once per login, not on every render
  // while `status` stays 'authenticated'.
  const mergedRef = useRef(false)
  // Server mutations can finish out of order (e.g. quickly tapping + several times). Every
  // mutation takes a sequence number and a response is applied only if no newer response has
  // been applied yet, so an older reply can never overwrite a newer cart.
  const requestSeqRef = useRef(0)
  const appliedSeqRef = useRef(0)

  useEffect(() => {
    if (status === 'unauthenticated') mergedRef.current = false
  }, [status])

  // Guest path (signed out): same localStorage load/save as before the server-cart sync
  // existed. Skipped entirely once authenticated — see the sync effect below.
  useEffect(() => {
    if (status !== 'unauthenticated') return
    // Always reset to what localStorage holds (or empty). Without the `[]` fallback, signing
    // out kept the previous user's server cart in state and then wrote it to localStorage,
    // leaking it to the next person on a shared device.
    let guestItems: CartItem[] = []
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) guestItems = JSON.parse(saved)
    } catch {
      // ignore parse errors
    }
    setItems(guestItems)
    setInitialized(true)
  }, [status])

  useEffect(() => {
    if (!initialized || status !== 'unauthenticated') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore storage errors
    }
  }, [items, initialized, status])

  // Authenticated path: merge whatever was in the guest cart into the server cart exactly
  // once per login, then the server is the source of truth (all mutations below re-fetch
  // from it) for the rest of the session.
  useEffect(() => {
    if (status !== 'authenticated' || mergedRef.current) return
    mergedRef.current = true

    async function syncServerCart() {
      let guestItems: CartItem[] = []
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        guestItems = saved ? JSON.parse(saved) : []
      } catch {
        guestItems = []
      }

      try {
        for (const item of guestItems) {
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: item.productId, quantity: item.quantity }),
          })
        }
        if (guestItems.length > 0) {
          try {
            localStorage.removeItem(STORAGE_KEY)
          } catch {
            // ignore
          }
        }

        const res = await fetch('/api/cart')
        if (res.ok) {
          const data = await res.json()
          setItems(data.items || [])
        }
      } catch {
        // best-effort merge; a failed sync just leaves the server cart as-is
      } finally {
        setInitialized(true)
      }
    }

    syncServerCart()
  }, [status])

  function applyServerResponse(res: Response, seq: number) {
    // Error replies ({ error }, e.g. sold out / session expired) carry no `items`; applying
    // them used to blank the cart. Keep the current cart instead.
    if (!res.ok) return
    res
      .json()
      .then((data) => {
        if (!Array.isArray(data.items) || seq < appliedSeqRef.current) return
        appliedSeqRef.current = seq
        setItems(data.items)
      })
      .catch(() => {
        // ignore — cart state just stays whatever it was before this mutation
      })
  }

  // Fire-and-apply for signed-in users: the reply carries the full server cart.
  function sendToServer(url: string, init: RequestInit) {
    const seq = ++requestSeqRef.current
    fetch(url, init)
      .then((res) => applyServerResponse(res, seq))
      .catch(() => {
        // network error: leave the cart as it was
      })
  }

  function addToCart(item: Omit<CartItem, 'quantity'>) {
    if (status === 'authenticated') {
      sendToServer('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.productId }),
      })
      return
    }
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId)
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: Math.min(i.quantity + 1, item.maxStock) }
            : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  function removeFromCart(productId: string) {
    if (status === 'authenticated') {
      sendToServer(`/api/cart/${productId}`, { method: 'DELETE' })
      return
    }
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    if (status === 'authenticated') {
      sendToServer(`/api/cart/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })
      return
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.min(quantity, i.maxStock) } : i
      )
    )
  }

  // Removes several items at once. For signed-in users the DELETEs run one after another:
  // each response carries the full cart, so firing them in parallel could let an older
  // response overwrite a newer one.
  async function removeItems(productIds: string[]) {
    if (status === 'authenticated') {
      const seq = ++requestSeqRef.current
      let last: Response | undefined
      for (const productId of productIds) {
        try {
          last = await fetch(`/api/cart/${productId}`, { method: 'DELETE' })
        } catch {
          // keep going; the final response (if any) reflects the server's cart
        }
      }
      if (last) applyServerResponse(last, seq)
      return
    }
    setItems((prev) => prev.filter((i) => !productIds.includes(i.productId)))
  }

  function clearCart() {
    if (status === 'authenticated') {
      sendToServer('/api/cart', { method: 'DELETE' })
      return
    }
    setItems([])
  }

  function getCartTotal() {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  function getCartCount() {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        removeItems,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart mora biti znotraj CartProvider')
  return ctx
}
