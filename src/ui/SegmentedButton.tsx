import { cx } from './cx'
import Icon from './Icon'

export interface Segment<T extends string> {
  value: T
  label: string
}

/** Segmented button (M3, single select) */
export default function SegmentedButton<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Segment<T>[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div role="group" className="flex h-10 overflow-hidden rounded-full border border-outline">
      {options.map((o, i) => {
        const selected = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(o.value)}
            className={cx(
              'flex flex-1 items-center justify-center gap-1.5 text-sm font-medium transition-colors',
              i > 0 && 'border-l border-outline',
              selected ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface active:bg-on-surface/10',
            )}
          >
            {selected && <Icon name="check" size={18} />}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
