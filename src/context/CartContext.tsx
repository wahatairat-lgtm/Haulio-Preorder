import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem, Product } from '../types'

const STORAGE_KEY = 'haulio-cart'

interface CartContextValue {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clear: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore storage failures (private mode, quota, etc.)
    }
  }, [items])

  function addItem(product: Product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) {
        return prev.map((i) => (i.productId === product.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          qty: 1,
        },
      ]
    })
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  function setQty(productId: string, qty: number) {
    if (qty <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, qty } : i)))
  }

  function clear() {
    setItems([])
  }

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items])
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, setQty, clear, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
