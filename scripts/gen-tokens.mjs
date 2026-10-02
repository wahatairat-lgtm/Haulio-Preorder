// สร้าง src/ui/tokens.css — โทเคนสีของ Haulio
// หลักการ: เทากลาง (zinc) เป็นพื้น, มารูนโลโก้ (#550017) เป็นสีเน้นเดียว, ไม่ใช้ครีม/คราฟท์
// ชื่อ role ตามมาตรฐาน M3 เพื่อให้คอมโพเนนต์ใช้ซ้ำได้ มีทั้งโหมดสว่างและมืด (ตาม prefers-color-scheme)
// usage: node scripts/gen-tokens.mjs  (หรือ npm run tokens)
import { writeFileSync } from 'node:fs'

const light = {
  primary: '#550017',
  'on-primary': '#fafafa',
  'primary-container': '#f3e8eb', // จางจากมารูนเดียวกัน ใช้กับปุ่ม tonal และการ์ดบัญชี
  'on-primary-container': '#3d0010',
  secondary: '#52525b',
  'on-secondary': '#fafafa',
  'secondary-container': '#e4e4e7',
  'on-secondary-container': '#18181b',
  tertiary: '#71717a',
  'tertiary-container': '#e4e4e7', // ช่องรูปที่ยังไม่มีภาพ
  'on-tertiary-container': '#3f3f46',
  error: '#b3261e',
  'on-error': '#ffffff',
  'error-container': '#f6dcd7',
  'on-error-container': '#5c130d',
  surface: '#fafafa',
  'surface-container-lowest': '#fdfdfd',
  'surface-container-low': '#f4f4f5',
  'surface-container': '#efeff1',
  'surface-container-high': '#e8e8ea',
  'surface-container-highest': '#e0e0e3',
  'on-surface': '#18181b',
  'on-surface-variant': '#52525b',
  outline: '#a1a1aa',
  'outline-variant': '#dcdce0',
  'inverse-primary': '#ffb2c4',
  scrim: '#000000',
}

// โหมดมืด: มารูนเข้มอ่านบนพื้นดำยาก จึงใช้เฉดสว่างขึ้นของสีเดียวกันสำหรับปุ่ม/ตัวอักษรเน้น
const dark = {
  primary: '#e5668a',
  'on-primary': '#1c0008',
  'primary-container': '#3a1220',
  'on-primary-container': '#ffd9e1',
  secondary: '#a1a1aa',
  'on-secondary': '#18181b',
  'secondary-container': '#2d2c31',
  'on-secondary-container': '#ececee',
  tertiary: '#a1a1aa',
  'tertiary-container': '#2d2c31',
  'on-tertiary-container': '#d4d4d8',
  error: '#f2b8b5',
  'on-error': '#601410',
  'error-container': '#8c1d18',
  'on-error-container': '#ffdad6',
  surface: '#0e0d0f',
  'surface-container-lowest': '#0a090b',
  'surface-container-low': '#151417',
  'surface-container': '#1a191c',
  'surface-container-high': '#232226',
  'surface-container-highest': '#2d2c31',
  'on-surface': '#ececee',
  'on-surface-variant': '#a1a1aa',
  outline: '#71717a',
  'outline-variant': '#2f2e33',
  'inverse-primary': '#550017',
  scrim: '#000000',
}

const vars = (o) => Object.entries(o).map(([k, v]) => `  --color-${k}: ${v};`).join('\n')

const css = `/* สร้างโดย scripts/gen-tokens.mjs อย่าแก้ตรงนี้ */
@theme static {
${vars(light)}

  --radius-xs: 3px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 10px;
  --radius-xl: 16px;

  /* ความลึก = เส้นขอบบางเป็นหลัก เงามีเฉพาะชั้นที่ลอยจริง (bottom sheet / snackbar) */
  --shadow-e1: none;
  --shadow-e2: 0 1px 2px rgb(24 24 27 / 0.12);
  --shadow-e3: 0 -8px 32px rgb(24 24 27 / 0.16);

  --font-sans: 'Prompt', system-ui, sans-serif;
  --font-mono: 'Prompt', system-ui, sans-serif;
}

@media (prefers-color-scheme: dark) {
  :root {
${Object.entries(dark).map(([k, v]) => `    --color-${k}: ${v};`).join('\n')}
  }
}
`
writeFileSync(new URL('../src/ui/tokens.css', import.meta.url), css)
console.log('tokens.css written')
