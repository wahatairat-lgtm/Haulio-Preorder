import type { BankInfo, CartItem, Order, Product, Schedule } from '../types'

const API_URL = import.meta.env.VITE_SHEET_API_URL as string | undefined

function requireApiUrl(): string {
  if (!API_URL) {
    throw new Error('ยังไม่ได้ตั้งค่า VITE_SHEET_API_URL ดู README สำหรับขั้นตอนตั้งค่า')
  }
  return API_URL
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${requireApiUrl()}?type=products`)
  if (!res.ok) throw new Error('โหลดสินค้าไม่สำเร็จ')
  return res.json()
}

export async function fetchSettings(): Promise<{ bank: BankInfo; schedule: Schedule }> {
  const res = await fetch(`${requireApiUrl()}?type=settings`)
  if (!res.ok) throw new Error('โหลดการตั้งค่าไม่สำเร็จ')
  return res.json()
}

export async function fetchOrder(orderId: string): Promise<Order | null> {
  const res = await fetch(`${requireApiUrl()}?type=order&id=${encodeURIComponent(orderId)}`)
  if (!res.ok) throw new Error('ค้นหาออเดอร์ไม่สำเร็จ')
  const data = await res.json()
  return data.order ?? null
}

export interface NewOrderPayload {
  items: CartItem[]
  total: number
  customerName: string
  customerPhone: string
  address: string
  note: string
  slipBase64: string
  slipFileName: string
}

export async function submitOrder(payload: NewOrderPayload): Promise<string> {
  const res = await fetch(requireApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'createOrder', ...payload }),
  })
  if (!res.ok) throw new Error('ส่งคำสั่งซื้อไม่สำเร็จ')
  const data = await res.json()
  return data.orderId as string
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1] ?? '')
    }
    reader.onerror = () => reject(new Error('อ่านไฟล์ไม่สำเร็จ'))
    reader.readAsDataURL(file)
  })
}
