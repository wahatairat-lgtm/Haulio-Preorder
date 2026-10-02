import { cx } from './cx'

export interface TabOption<T extends string> {
  value: T
  label: string
  count?: number
}

/** แท็บขีดเส้นใต้ — ใช้เลือกประเทศ */
export default function Tabs<T extends string>({ options, value, onChange }: { options: TabOption<T>[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="tablist" className="flex border-b border-outline-variant">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cx(
              'relative flex h-11 items-baseline justify-center gap-1.5 px-5 pt-2.5 text-base font-semibold transition-colors',
              active ? 'text-on-surface' : 'text-on-surface-variant',
            )}
          >
            {o.label}
            {o.count !== undefined && <span className="num text-xs font-medium text-on-surface-variant">{o.count}</span>}
            {active && <span className="absolute inset-x-3 -bottom-px h-0.5 bg-primary" />}
          </button>
        )
      })}
    </div>
  )
}
