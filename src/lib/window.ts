// แปลงข้อความช่วงเปิดรับจาก Settings (เช่น "1 – 17 ต.ค.", "1 ต.ค. – 3 ม.ค.") เป็นวันที่จริง
// เพื่อคำนวณว่าวันนี้อยู่ตรงไหนของรอบ — อ่านไม่ออกจะคืน null แล้วหน้าเว็บแสดงข้อความดิบแทน

const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
const DAY_MS = 86_400_000

interface Part {
  day: number
  month: number | null
}

function parsePart(text: string): Part | null {
  const m = text.trim().match(/^(\d{1,2})\s*(\S+)?$/)
  if (!m) return null
  const day = Number(m[1])
  if (day < 1 || day > 31) return null
  if (!m[2]) return { day, month: null }
  const month = MONTHS.indexOf(m[2])
  return month === -1 ? null : { day, month }
}

export interface RoundWindow {
  start: Date
  end: Date
  ship: Date | null
}

export function parseWindow(openRange: string, shipDate: string, today = new Date()): RoundWindow | null {
  const [a, b, ...extra] = openRange.split(/[–—-]/).map((s) => s.trim())
  if (!a || !b || extra.length) return null
  const from = parsePart(a)
  const to = parsePart(b)
  if (!from || !to || to.month === null) return null
  const startMonth = from.month ?? to.month

  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  let start = new Date()
  let end = new Date()
  // ปีแรกที่รอบนี้ "ยังไม่จบ" ณ วันนี้ (ไม่มีปีในข้อความ)
  for (let y = today.getFullYear() - 1; y <= today.getFullYear() + 1; y++) {
    start = new Date(y, startMonth, from.day)
    end = new Date(y + (to.month < startMonth ? 1 : 0), to.month, to.day)
    if (end >= startOfToday) break
  }

  let ship: Date | null = null
  const s = parsePart(shipDate)
  if (s && s.month !== null) {
    ship = new Date(end.getFullYear(), s.month, s.day)
    if (ship < end) ship = new Date(end.getFullYear() + 1, s.month, s.day)
  }
  return { start, end, ship }
}

export type RoundState = 'upcoming' | 'open' | 'closed'

export function roundStatus(w: RoundWindow, today = new Date()) {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const state: RoundState = t < w.start.getTime() ? 'upcoming' : t > w.end.getTime() ? 'closed' : 'open'
  const daysLeft = Math.round((w.end.getTime() - t) / DAY_MS)
  const total = Math.max(1, Math.round((w.end.getTime() - w.start.getTime()) / DAY_MS))
  const progress = Math.min(1, Math.max(0, (t - w.start.getTime()) / DAY_MS / total))
  return { state, daysLeft, progress }
}

export function formatDay(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}
