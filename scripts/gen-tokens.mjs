// สร้าง src/ui/tokens.css — โทเคนสีของ Haulio
// พาเลต: ครีมอมชมพู (ชุด M3 แรก จากสีโลโก้ #550017) มารูนโลโก้เป็นสีเน้น
// ชื่อ role ตามมาตรฐาน M3 เพื่อให้คอมโพเนนต์ใช้ซ้ำได้ ล็อกโหมดสว่างเสมอ (ไม่ตามค่า dark mode ของเครื่อง)
// usage: node scripts/gen-tokens.mjs  (หรือ npm run tokens)
import { writeFileSync } from 'node:fs'

const light = {
  primary: '#550017',
  'on-primary': '#ffffff',
  'primary-container': '#ffdadb',
  'on-primary-container': '#72333b',
  secondary: '#765659',
  'on-secondary': '#ffffff',
  'secondary-container': '#ffdadb',
  'on-secondary-container': '#5c3f41',
  tertiary: '#775930',
  'tertiary-container': '#ffddb5',
  'on-tertiary-container': '#5d411b',
  error: '#ba1a1a',
  'on-error': '#ffffff',
  'error-container': '#ffdad6',
  'on-error-container': '#93000a',
  surface: '#fff8f7',
  'surface-container-lowest': '#ffffff',
  'surface-container-low': '#fff0f0',
  'surface-container': '#fceaea',
  'surface-container-high': '#f6e4e4',
  'surface-container-highest': '#f0dedf',
  'on-surface': '#22191a',
  'on-surface-variant': '#524344',
  outline: '#857374',
  'outline-variant': '#d7c1c2',
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

`
writeFileSync(new URL('../src/ui/tokens.css', import.meta.url), css)
console.log('tokens.css written')
