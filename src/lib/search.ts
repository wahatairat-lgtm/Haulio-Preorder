import type { Product } from '../types'
import { productType, typeKeywords } from './categorize'

// คำไทย → คำอังกฤษที่ปรากฏในชื่อสินค้า (ชื่อใน Sheet เป็นอังกฤษเป็นหลัก)
const SYNONYMS: Record<string, string[]> = {
  กันแดด: ['sunscreen', 'uv', 'spf'],
  ครีม: ['cream'],
  โลชั่น: ['lotion'],
  น้ำตบ: ['lotion'],
  เอสเซนส์: ['essence'],
  เอสเซ้นส์: ['essence'],
  เซรั่ม: ['serum', 'essence'],
  มาส์ก: ['mask'],
  มาสก์: ['mask'],
  มาส์ค: ['mask'],
  เจล: ['gel'],
  มิสต์: ['mist'],
  สเปรย์: ['mist'],
  ล้างหน้า: ['wash'],
  โฟม: ['wash', 'foam'],
  วิตามิน: ['vitamin', 'tablet', 'gummy'],
  อาหารเสริม: ['supplement', 'tablet', 'gummy'],
  กัมมี่: ['gummy'],
  เยลลี่: ['gummy'],
  ช็อกโกแลต: ['chocolate'],
  ช็อคโกแลต: ['chocolate'],
  ช็อก: ['chocolate'],
  ขนม: ['snack', 'chocolate'],
  มันฝรั่ง: ['potato'],
  คาราเมล: ['caramel'],
  มัทฉะ: ['matcha'],
  มัจฉะ: ['matcha'],
  ชาเขียว: ['matcha', 'tea', 'gyokuro'],
  เกียวคุโระ: ['gyokuro'],
  ชา: ['tea', 'matcha'],
  กาแฟ: ['coffee', 'espresso'],
  แก้ว: ['cup', 'tumblr', 'tumbler'],
  กระบอก: ['tumblr', 'tumbler', 'cup'],
  ถุงเท้า: ['sock'],
  เสื้อยืด: ['t-shirt', 'shirt'],
  เสื้อ: ['t-shirt', 'shirt'],
  หมวก: ['cap'],
  พวงกุญแจ: ['key ring'],
  โทนเนอร์: ['toner'],
  คุชชั่น: ['cushion'],
  ลิป: ['tint', 'lip'],
  ทินท์: ['tint'],
  รองพื้น: ['foundation', 'cushion'],
  สิวเสี้ยน: ['nose pack', 'pore'],
  หอยทาก: ['snail'],
  แผ่นมาส์ก: ['mask'],
  หวี: ['comb'],
  แปรง: ['brush'],
  ผู้ชาย: ['men'],
  เอลิกเซอร์: ['elixir'],
  อีลิกเซอร์: ['elixir'],
  เอลิคเซอร์: ['elixir'],
  บิโอเร: ['biore'],
  ไบโอเร: ['biore'],
  อเนสซ่า: ['anessa'],
  อเนสซา: ['anessa'],
  โคเซ่: ['kose'],
  โคเซ: ['kose'],
  โรแมนด์: ['romand'],
  อนัว: ['anua'],
  คอสอาร์เอ็กซ์: ['cosrx'],
  ทอริเดน: ['torriden'],
  บิวตี้ออฟโชซอน: ['beauty of joseon'],
  โชซอน: ['joseon'],
  เมดิฮีล: ['mediheal'],
  รอยซ์: ['royce'],
  ฮิวแมนเมด: ['human made'],
  รีฟา: ['refa'],
  บลูบอทเทิล: ['blue bottle'],
  ทรานซิโน: ['transino'],
  ยาคูลท์: ['yakult'],
  คินโตะ: ['kinto'],
}
// คำบอกรูปแบบสินค้า — เป็นแค่ตัวช่วยจัดอันดับเมื่อค้นร่วมกับคำอื่น (เช่น "ครีมกันแดด" ต้องเจอ Sunscreen ที่ไม่มีคำว่า cream)
const SOFT = new Set(['ครีม', 'โลชั่น', 'เจล', 'สเปรย์', 'โฟม', 'น้ำตบ'])
const SYN_KEYS = Object.keys(SYNONYMS).sort((a, b) => b.length - a.length)

function levenshtein(a: string, b: string) {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]
    prev[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j]
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1))
      diag = tmp
    }
  }
  return prev[b.length]
}

/** แตกคำค้นเป็น "เงื่อนไข" (AND) แต่ละเงื่อนไขมีหลายทางเลือก (OR) */
interface Term {
  alts: string[]
  soft: boolean
}

function toTerms(query: string): Term[] {
  const terms: Term[] = []
  for (const token of query.toLowerCase().split(/\s+/).filter(Boolean)) {
    let rest = token
    const found: Term[] = []
    for (const key of SYN_KEYS) {
      if (rest.includes(key)) {
        found.push({ alts: [key, ...SYNONYMS[key]], soft: SOFT.has(key) })
        rest = rest.split(key).join(' ')
      }
    }
    if (found.length) terms.push(...found)
    else terms.push({ alts: [token], soft: false })
  }
  return terms
}

interface Indexed {
  product: Product
  name: string
  haystack: string
  words: string[]
  nameWords: string[]
  typeText: string
}

function index(p: Product): Indexed {
  const type = productType(p)
  const name = p.name.toLowerCase()
  const typeText = `${type} ${typeKeywords(type)}`.toLowerCase()
  const haystack = `${p.name} ${p.brand ?? ''} ${typeText}`.toLowerCase()
  const split = (t: string) => t.split(/[^\p{L}\p{N}-]+/u).filter(Boolean)
  return { product: p, name, haystack, words: split(haystack), nameWords: split(name), typeText }
}

const isAscii = (t: string) => /^[a-z0-9\- ]+$/.test(t)

/** คืนคะแนน 0 = ไม่ตรง; ชื่อตรงสูงสุด, หมวด/แบรนด์รอง, พิมพ์ผิดเล็กน้อย (fuzzy) ต่ำสุด */
function scoreTerm(ix: Indexed, alts: string[]): number {
  let best = 0
  for (const alt of alts) {
    if (alt.length < 2) continue
    if (isAscii(alt)) {
      // อังกฤษ: จับที่ต้นคำ (กัน "men" ไปติดใน "supplement")
      const multi = alt.includes(' ') || alt.includes('-')
      const inName = multi ? ix.name.includes(alt) : ix.nameWords.some((w) => w.startsWith(alt))
      const inAny = multi ? ix.haystack.includes(alt) : ix.words.some((w) => w.startsWith(alt))
      if (inName) best = Math.max(best, ix.name.startsWith(alt) ? 4 : 3)
      else if (inAny) best = Math.max(best, 2)
      else if (/^[a-z0-9-]{4,}$/.test(alt)) {
        const max = alt.length >= 7 ? 2 : 1
        if (ix.words.some((w) => Math.abs(w.length - alt.length) <= max && levenshtein(w, alt) <= max)) best = Math.max(best, 1)
      }
    } else if (ix.name.includes(alt)) best = Math.max(best, 3)
    else if (ix.haystack.includes(alt)) best = Math.max(best, 2)
  }
  // คำที่ตรงชื่อ/คำของหมวดโดยตรง (เช่น ชาเขียว/matcha → หมวดชา) ให้ขึ้นก่อนสินค้าที่แค่มีคำนั้นในชื่อ
  const inType = alts.some((a) => a.length >= 2 && (isAscii(a) ? ix.typeText.split(' ').some((w) => w.startsWith(a)) : ix.typeText.includes(a)))
  if (best && inType) best += 3
  return best
}

export function searchProducts(products: Product[], query: string): Product[] {
  const terms = toTerms(query)
  if (!terms.length) return products
  return products
    .map((p) => {
      const ix = index(p)
      const hard = terms.some((t) => !t.soft) ? terms.filter((t) => !t.soft) : terms
      let total = 0
      for (const t of terms) {
        const s = scoreTerm(ix, t.alts)
        if (!s && hard.includes(t)) return { p, score: 0 }
        total += s
      }
      return { p, score: total }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p)
}
