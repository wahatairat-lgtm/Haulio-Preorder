export type Category = 'kr' | 'jp'

export interface Product {
  id: string
  name: string
  category: Category
  price: number
  imageUrl: string
  description?: string
  deadline?: string
  available: boolean
  createdAt: number
}

export interface CartItem {
  productId: string
  name: string
  price: number
  imageUrl: string
  qty: number
}

export type OrderStatus = 'pending' | 'paid' | 'rejected' | 'shipped' | 'done'

export interface Order {
  id: string
  items: CartItem[]
  total: number
  customerName: string
  customerPhone: string
  address: string
  note?: string
  slipUrl: string
  status: OrderStatus
  createdAt: number
  updatedAt: number
}

export interface BankInfo {
  bankName: string
  accountName: string
  accountNumber: string
  promptpay?: string
}
