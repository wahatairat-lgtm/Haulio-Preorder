// สร้าง src/ui/tokens.css (Material 3 color roles) จากสีหลักของโลโก้ Haulio
// usage: node scripts/gen-tokens.mjs
import { writeFileSync } from 'node:fs'
import {
  argbFromHex,
  hexFromArgb,
  Hct,
  MaterialDynamicColors as M,
  SchemeTonalSpot,
} from '@material/material-color-utilities'

const SEED = '#550017' // สีโลโก้ Haulio

const scheme = new SchemeTonalSpot(Hct.fromInt(argbFromHex(SEED)), false, 0)
const role = (name) => hexFromArgb(M[name].getArgb(scheme))

const roles = {
  // primary = สีโลโก้ตรงๆ (M3 ปกติใช้ tone 40 ซึ่งอ่อนกว่าโลโก้)
  primary: SEED,
  'on-primary': '#ffffff',
  'primary-container': role('primaryContainer'),
  'on-primary-container': role('onPrimaryContainer'),
  secondary: role('secondary'),
  'on-secondary': role('onSecondary'),
  'secondary-container': role('secondaryContainer'),
  'on-secondary-container': role('onSecondaryContainer'),
  tertiary: role('tertiary'),
  'tertiary-container': role('tertiaryContainer'),
  'on-tertiary-container': role('onTertiaryContainer'),
  error: role('error'),
  'on-error': role('onError'),
  'error-container': role('errorContainer'),
  'on-error-container': role('onErrorContainer'),
  surface: role('surface'),
  'on-surface': role('onSurface'),
  'on-surface-variant': role('onSurfaceVariant'),
  'surface-container-lowest': role('surfaceContainerLowest'),
  'surface-container-low': role('surfaceContainerLow'),
  'surface-container': role('surfaceContainer'),
  'surface-container-high': role('surfaceContainerHigh'),
  'surface-container-highest': role('surfaceContainerHighest'),
  outline: role('outline'),
  'outline-variant': role('outlineVariant'),
  'inverse-primary': role('inversePrimary'),
  scrim: '#000000',
}

const lines = Object.entries(roles).map(([k, v]) => `  --color-${k}: ${v};`)
const css = `/* สร้างโดย scripts/gen-tokens.mjs จากสี ${SEED} — อย่าแก้ตรงนี้ */
@theme static {
${lines.join('\n')}

  /* M3 shape scale */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 28px;

  /* M3 elevation */
  --shadow-e1: 0 1px 2px rgb(0 0 0 / 0.3), 0 1px 3px 1px rgb(0 0 0 / 0.15);
  --shadow-e2: 0 1px 2px rgb(0 0 0 / 0.3), 0 2px 6px 2px rgb(0 0 0 / 0.15);
  --shadow-e3: 0 4px 8px 3px rgb(0 0 0 / 0.15), 0 1px 3px rgb(0 0 0 / 0.3);

  --font-sans: 'Poppins', 'Noto Sans Thai', system-ui, sans-serif;
}
`
writeFileSync(new URL('../src/ui/tokens.css', import.meta.url), css)
console.log(css)
