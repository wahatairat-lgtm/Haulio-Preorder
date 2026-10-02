import type { Product } from '../types'

export interface ProductType {
  label: string
  /** คำระดับ "หมวด" (ไม่ใช่ชื่อสินค้าแต่ละชิ้น) ที่ทำให้สินค้าหมวดนี้เจอเมื่อค้นด้วยชื่อหมวด */
  keywords: string
  test: RegExp
}

// เรียงตามลำดับความสำคัญของการจับคู่ (อันบนชนะ) — สินค้าที่ไม่เข้าเลยถือเป็น "สกินแคร์"
const RULES: ProductType[] = [
  { label: 'กันแดด', keywords: 'sunscreen sun uv spf กันแดด', test: /sunscreen|\bsun\b|\buv\b|spf/ },
  { label: 'เมคอัพ', keywords: 'makeup cosmetic เมคอัพ เครื่องสำอาง', test: /tint|cushion|foundation|lip(stick|\b)/ },
  { label: 'อาหารเสริม', keywords: 'supplement vitamin วิตามิน อาหารเสริม', test: /tablet|supplement|yakult|gummy|vitamin/ },
  { label: 'โปรตีน & เฮลตี้', keywords: 'protein shake bar healthy snack diet โปรตีน เฮลตี้ ไดเอท', test: /protein|crunt|delight project/ },
  { label: 'ขนม', keywords: 'snack sweet chocolate dessert ขนม ช็อกโกแลต ของหวาน', test: /chocolate|royce|shiroi|koibito|potato chip|caramel|cookie|snack/ },
  { label: 'ชา & มัทฉะ', keywords: 'tea matcha green ชา มัทฉะ ชาเขียว', test: /matcha|gyokuro|ocha|yamecha|ippodo|\btea\b/ },
  { label: 'กาแฟ & แก้ว', keywords: 'coffee drinkware กาแฟ', test: /blue bottle|coffee|espresso|tumbl|\bcup\b|miir|kinto/ },
  { label: 'อุปกรณ์ความงาม', keywords: 'beauty tool อุปกรณ์', test: /refa|brush|comb|hair/ },
  { label: 'แฟชั่น', keywords: 'fashion apparel clothes แฟชั่น เสื้อผ้า', test: /human made|\bfam\b|sock|t-shirt|\bcap\b|key ring|twill/ },
]
const DEFAULT: ProductType = {
  label: 'สกินแคร์',
  keywords: 'skincare skin care beauty cosmetic สกินแคร์ บำรุงผิว ความงาม',
  test: /./,
}

/** ลำดับ chip ที่แสดง */
export const TYPE_ORDER = [DEFAULT.label, ...RULES.map((r) => r.label)]

function ruleFor(label: string): ProductType | undefined {
  return [...RULES, DEFAULT].find((r) => r.label === label)
}

/** หมวดสินค้า: ใช้คอลัมน์ type ใน Sheet ถ้ามี ไม่งั้นเดาจากชื่อ/แบรนด์ */
export function productType(p: Product): string {
  if (p.type?.trim()) return p.type.trim()
  const text = `${p.name} ${p.brand ?? ''}`.toLowerCase()
  return (RULES.find((r) => r.test.test(text)) ?? DEFAULT).label
}

export function typeKeywords(label: string): string {
  return ruleFor(label)?.keywords ?? label
}

/** หมวดที่มีสินค้าอยู่จริง เรียงตาม TYPE_ORDER (หมวดที่ตั้งเองใน Sheet ต่อท้าย) */
export function typesIn(products: Product[]): string[] {
  const present = new Set(products.map(productType))
  const known = TYPE_ORDER.filter((t) => present.has(t))
  const custom = [...present].filter((t) => !TYPE_ORDER.includes(t)).sort()
  return [...known, ...custom]
}
