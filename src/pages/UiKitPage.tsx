import { useState } from 'react'
import { Badge, Button, Card, Chip, Icon, IconButton, ProductImage, QuantityStepper, SearchBar, SegmentedButton, TextField, TopAppBar } from '../ui'

const COLORS = [
  'primary',
  'primary-container',
  'secondary',
  'secondary-container',
  'tertiary-container',
  'error',
  'error-container',
  'surface-container-lowest',
  'surface-container-low',
  'surface-container-high',
  'on-surface',
  'on-surface-variant',
  'outline',
  'outline-variant',
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 px-4 py-4">
      <h2 className="text-sm font-semibold text-on-surface-variant">{title}</h2>
      {children}
    </section>
  )
}

/** หน้า /#/ui — คู่มือคอมโพเนนต์ (living style guide) */
export default function UiKitPage() {
  const [seg, setSeg] = useState<'a' | 'b'>('a')
  const [chip, setChip] = useState(true)
  const [qty, setQty] = useState(1)

  return (
    <div className="flex-1 divide-y divide-outline-variant/50 pb-6">
      <TopAppBar title="Haulio UI" />

      <Section title="Color roles (Material 3 จากสีโลโก้ #550017)">
        <div className="grid grid-cols-3 gap-2">
          {COLORS.map((c) => (
            <div key={c} className="space-y-1">
              <div className="h-12 rounded-md border border-outline-variant" style={{ background: `var(--color-${c})` }} />
              <p className="text-[11px] leading-tight text-on-surface-variant">{c}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-2">
          <Button>Filled</Button>
          <Button variant="tonal">Tonal</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="text">Text</Button>
          <Button icon="bag">With icon</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex gap-2">
          <IconButton icon="add" label="add" variant="filled" />
          <IconButton icon="add" label="add" variant="tonal" />
          <IconButton icon="add" label="add" variant="outlined" />
          <IconButton icon="add" label="add" />
        </div>
      </Section>

      <Section title="Chips / Segmented / Stepper / Badge">
        <div className="flex gap-2">
          <Chip selected={chip} onClick={() => setChip(!chip)}>
            Selected
          </Chip>
          <Chip>Unselected</Chip>
        </div>
        <SegmentedButton
          options={[
            { value: 'a' as const, label: 'เกาหลี' },
            { value: 'b' as const, label: 'ญี่ปุ่น' },
          ]}
          value={seg}
          onChange={setSeg}
        />
        <div className="flex items-center gap-6">
          <QuantityStepper value={qty} onChange={(n) => setQty(Math.max(1, n))} />
          <span className="relative inline-flex">
            <Icon name="bag" size={28} />
            <Badge count={3} className="absolute -right-2 -top-1" />
          </span>
        </div>
      </Section>

      <Section title="Inputs">
        <SearchBar placeholder="ค้นหา" />
        <TextField label="ชื่อ-นามสกุล" />
      </Section>

      <Section title="Cards">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Card variant="filled" className="p-3">Filled</Card>
          <Card variant="tonal" className="p-3">Tonal</Card>
          <Card variant="elevated" className="p-3">Elevated</Card>
          <Card variant="outlined" className="p-3">Outlined</Card>
        </div>
        <ProductImage alt="placeholder" className="aspect-4/5 w-32 rounded-xl" />
      </Section>
    </div>
  )
}
