// สร้าง src/ui/tokens.css — โทเคนสีของ Haulio
// ที่มาของสี: มารูนจากโลโก้ (#550017) เป็นสีเน้นเดียว, พื้นเป็นกระดาษขาวนวล, หมึกเป็นมารูนเข้มเกือบดำ,
// คราฟท์ = สีลังพัสดุ ใช้กับป้าย/ช่องรูปที่ยังไม่มีภาพ  (ชื่อ role ยังใช้ตามมาตรฐาน M3 เพื่อให้คอมโพเนนต์ใช้ซ้ำได้)
// usage: node scripts/gen-tokens.mjs  (หรือ npm run tokens)
import { writeFileSync } from 'node:fs'

const palette = {
  // เน้น
  primary: '#550017', // โลโก้
  'on-primary': '#fff9f4',
  'primary-container': '#ecd8cf', // คราฟท์อ่อนอมแดง — ปุ่ม tonal, การ์ดบัญชีธนาคาร
  'on-primary-container': '#3d0010',
  // คราฟท์ (secondary = สถานะที่เลือก/ใช้งานอยู่)
  secondary: '#7a6247',
  'on-secondary': '#fffaf2',
  'secondary-container': '#eadcc4',
  'on-secondary-container': '#3a2c19',
  // กล่องคราฟท์เต็มสี — ป้าย/ช่องรูปว่าง
  tertiary: '#8a6a3e',
  'tertiary-container': '#d8c19a',
  'on-tertiary-container': '#3b2a10',
  // ตรายาง/สถานะผิดพลาด
  error: '#b3261e',
  'on-error': '#ffffff',
  'error-container': '#f6dcd7',
  'on-error-container': '#5c130d',
  // กระดาษ (ไล่ระดับเบามาก)
  surface: '#fbf8f2',
  'surface-container-lowest': '#fffdf9',
  'surface-container-low': '#f6f1e8',
  'surface-container': '#f0e9dc',
  'surface-container-high': '#e9e0d0',
  'surface-container-highest': '#e1d6c3',
  // หมึก
  'on-surface': '#2a1a1d',
  'on-surface-variant': '#6a5a58',
  outline: '#9c8d80',
  'outline-variant': '#dcd0bd',
  'inverse-primary': '#ffb2b9',
  scrim: '#000000',
}

const lines = Object.entries(palette).map(([k, v]) => `  --color-${k}: ${v};`)
const css = `/* สร้างโดย scripts/gen-tokens.mjs — อย่าแก้ตรงนี้ */
@theme static {
${lines.join('\n')}

  /* รูปทรง: ป้าย/กล่อง ไม่ใช่ก้อนลอย */
  --radius-xs: 3px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 10px;
  --radius-xl: 16px;

  /* ความลึก = เส้นขอบบางเป็นหลัก เงามีเฉพาะชั้นที่ลอยจริง (bottom sheet / snackbar) */
  --shadow-e1: none;
  --shadow-e2: 0 1px 2px rgb(42 26 29 / 0.12);
  --shadow-e3: 0 -8px 32px rgb(42 26 29 / 0.16);

  --font-sans: 'IBM Plex Sans Thai', 'IBM Plex Sans', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
}
`
writeFileSync(new URL('../src/ui/tokens.css', import.meta.url), css)
console.log('tokens.css written')
