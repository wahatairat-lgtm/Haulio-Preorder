// สร้าง src/ui/tokens.css — โทเคนสีของ Haulio
// พาเลต: กระดาษขาวนวล + คราฟท์ (สีลังพัสดุ) + หมึกมารูนเข้ม และมารูนโลโก้ (#550017) เป็นสีเน้นเดียว
// ชื่อ role ตามมาตรฐาน M3 เพื่อให้คอมโพเนนต์ใช้ซ้ำได้ มีโหมดมืด (ตาม prefers-color-scheme) โทนอุ่นเข้าชุดกัน
// usage: node scripts/gen-tokens.mjs  (หรือ npm run tokens)
import { writeFileSync } from 'node:fs'

const light = {
  primary: '#550017',
  'on-primary': '#fff9f4',
  'primary-container': '#ecd8cf',
  'on-primary-container': '#3d0010',
  secondary: '#7a6247',
  'on-secondary': '#fffaf2',
  'secondary-container': '#eadcc4',
  'on-secondary-container': '#3a2c19',
  tertiary: '#8a6a3e',
  'tertiary-container': '#d8c19a', // คราฟท์เต็มสี: หัวหน้า, ช่องรูปที่ยังไม่มีภาพ
  'on-tertiary-container': '#3b2a10',
  error: '#b3261e',
  'on-error': '#ffffff',
  'error-container': '#f6dcd7',
  'on-error-container': '#5c130d',
  surface: '#fbf8f2',
  'surface-container-lowest': '#fffdf9',
  'surface-container-low': '#f6f1e8',
  'surface-container': '#f0e9dc',
  'surface-container-high': '#e9e0d0',
  'surface-container-highest': '#e1d6c3',
  'on-surface': '#2a1a1d',
  'on-surface-variant': '#6a5a58',
  outline: '#9c8d80',
  'outline-variant': '#dcd0bd',
  'inverse-primary': '#ffb2b9',
  scrim: '#000000',
}

const dark = {
  primary: '#e5668a',
  'on-primary': '#1c0008',
  'primary-container': '#3a1220',
  'on-primary-container': '#ffd9e1',
  secondary: '#c9b08a',
  'on-secondary': '#2a1d0c',
  'secondary-container': '#3a2f24',
  'on-secondary-container': '#ecdcc0',
  tertiary: '#c9b08a',
  'tertiary-container': '#4a3d2a',
  'on-tertiary-container': '#ecdcc0',
  error: '#f2b8b5',
  'on-error': '#601410',
  'error-container': '#8c1d18',
  'on-error-container': '#ffdad6',
  surface: '#161110',
  'surface-container-lowest': '#100c0b',
  'surface-container-low': '#1d1716',
  'surface-container': '#241d1c',
  'surface-container-high': '#2e2625',
  'surface-container-highest': '#3a302f',
  'on-surface': '#f1e9e4',
  'on-surface-variant': '#b3a49f',
  outline: '#7a6a65',
  'outline-variant': '#3d3331',
  'inverse-primary': '#550017',
  scrim: '#000000',
}

const vars = (o, pad) => Object.entries(o).map(([k, v]) => `${pad}--color-${k}: ${v};`).join('\n')

const css = `/* สร้างโดย scripts/gen-tokens.mjs อย่าแก้ตรงนี้ */
@theme static {
${vars(light, '  ')}

  /* รูปทรงมนแบบกล่อง/สติกเกอร์ */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  --shadow-e1: 0 1px 0 rgb(42 26 29 / 0.06);
  --shadow-e2: 0 2px 10px rgb(42 26 29 / 0.12);
  --shadow-e3: 0 -8px 32px rgb(42 26 29 / 0.18);

  --font-sans: 'Prompt', system-ui, sans-serif;
  --font-mono: 'Prompt', system-ui, sans-serif;
}

@media (prefers-color-scheme: dark) {
  :root {
${vars(dark, '    ')}
  }
}
`
writeFileSync(new URL('../src/ui/tokens.css', import.meta.url), css)
console.log('tokens.css written')
