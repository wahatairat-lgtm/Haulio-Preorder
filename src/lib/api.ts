import type { BankInfo, CartItem, Order, Product, Schedule } from '../types'

const API_URL = import.meta.env.VITE_SHEET_API_URL as string | undefined

function requireApiUrl(): string {
  if (!API_URL) {
    throw new Error('ยังไม่ได้ตั้งค่า VITE_SHEET_API_URL ดู README สำหรับขั้นตอนตั้งค่า')
  }
  return API_URL
}

type Settings = { bank: BankInfo; schedule: Schedule }

// Apps Script ช้าตอน cold start (หลายวินาที) — เก็บผลล่าสุดไว้ในเครื่อง เปิดซ้ำเห็นทันที แล้วค่อยอัปเดตเบื้องหลัง
const CACHE_PREFIX = 'haulio-cache:'

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeCache(key: string, value: unknown) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value))
  } catch {
    // ignore storage failures
  }
}

/** GET พร้อม timeout และลองซ้ำ 1 ครั้ง (cold start / เครือข่ายสะดุด) */
async function getJson<T>(url: string, errorMessage: string): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < 2; attempt++) {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 30000)
    try {
      const res = await fetch(url, { signal: ctrl.signal })
      if (!res.ok) throw new Error(errorMessage)
      return (await res.json()) as T
    } catch (e) {
      lastError = e
    } finally {
      clearTimeout(timer)
    }
  }
  throw lastError instanceof Error ? lastError : new Error(errorMessage)
}

export const cachedProducts = () => readCache<Product[]>('products')
export const cachedSettings = () => readCache<Settings>('settings')

export async function fetchProducts(): Promise<Product[]> {
  const data = await getJson<Product[]>(`${requireApiUrl()}?type=products`, 'โหลดสินค้าไม่สำเร็จ')
  writeCache('products', data)
  return data
}

export async function fetchSettings(): Promise<Settings> {
  const data = await getJson<Settings>(`${requireApiUrl()}?type=settings`, 'โหลดการตั้งค่าไม่สำเร็จ')
  writeCache('settings', data)
  return data
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
  lineId: string
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

/** ย่อรูปสลิปก่อนอัปโหลด — รูปจากมือถือหลาย MB ทำให้ส่งออเดอร์ช้า สลิปอ่านออกได้ที่ 1400px */
export async function compressImage(file: File, maxSide = 1400, quality = 0.82): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
    if (!blob || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file // ย่อไม่ได้ (เช่น HEIC บางเครื่อง) ส่งไฟล์เดิม
  }
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
