import IconButton from './IconButton'

export default function QuantityStepper({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <IconButton size="sm" variant="outlined" icon="remove" label="ลดจำนวน" onClick={() => onChange(value - 1)} />
      <span className="w-6 text-center text-sm font-medium tabular-nums text-on-surface">{String(value).padStart(2, '0')}</span>
      <IconButton size="sm" variant="filled" icon="add" label="เพิ่มจำนวน" onClick={() => onChange(value + 1)} />
    </div>
  )
}
