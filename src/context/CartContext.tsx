import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem, Product } from '../types'

const STORAGE_KEY = 'haulio-cart'

interface CartContextValue {
  items: CartItem[]
  addItem: (product: Product, variant?: string) => void
  removeItem: (productId: string, variant?: string) => void
  setQty: (productId: string, qty: number, variant?: string) => void
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

function sameLine(item: CartItem, productId: string, variant?: string) {
  return item.productId === productId && (item.variant ?? '') === (variant ?? '')
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

  function addItem(product: Product, variant?: string) {
    setItems((prev) => {
      const existing = prev.find((i) => sameLine(i, product.id, variant))
      if (existing) {
        return prev.map((i) => (sameLine(i, product.id, variant) ? { ...i, qty: i.qty + 1 } : i))
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          qty: 1,
          variant,
        },
      ]
    })
  }

  function removeItem(productId: string, variant?: string) {
    setItems((prev) => prev.filter((i) => !sameLine(i, productId, variant)))
  }

  function setQty(productId: string, qty: number, variant?: string) {
    if (qty <= 0) {
      removeItem(productId, variant)
      return
    }
    setItems((prev) => prev.map((i) => (sameLine(i, productId, variant) ? { ...i, qty } : i)))
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
