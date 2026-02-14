'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  productId: string
  name: string
  price: number
  unit: string
  quantity: number
  farmName: string
  categoryIcon: string
  stock: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('mojkmet-cart')
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e)
      }
    }
    setMounted(true)
  }, [])

  // Persist to localStorage whenever items change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('mojkmet-cart', JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = (product: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.productId)
      
      if (existing) {
        // Increment quantity, respecting stock limit
        const newQuantity = Math.min(existing.quantity + 1, product.stock)
        if (newQuantity === existing.quantity) {
          // Already at stock limit
          return prev
        }
        return prev.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      }
      
      // Add new item
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const newQuantity = Math.min(quantity, item.stock)
          return { ...item, quantity: newQuantity }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
