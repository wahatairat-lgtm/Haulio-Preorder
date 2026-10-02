import { cx } from './cx'

export interface StampOption<T extends string> {
  value: T
  label: string
  count?: number
}

/** แท็บเลือกประเทศแบบตราประทับ 2 ช่อง ช่องที่เลือกเป็นมารูนทึบ */
export default function StampTabs<T extends string>({ options, value, onChange }: { options: StampOption<T>[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="tablist" className="grid grid-cols-2 gap-3">
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
              'flex h-14 items-center justify-center gap-2 rounded-xl border-2 text-lg font-semibold transition-colors motion-safe:active:scale-[0.98]',
              active
                ? 'border-primary bg-primary text-on-primary shadow-e2'
                : 'border-outline-variant bg-surface-container-lowest text-on-surface active:bg-surface-container',
            )}
          >
            {o.label}
            {o.count !== undefined && (
              <span className={cx('num rounded-full px-2 py-0.5 text-xs font-medium', active ? 'bg-on-primary/20' : 'bg-surface-container-high text-on-surface-variant')}>
                {o.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
