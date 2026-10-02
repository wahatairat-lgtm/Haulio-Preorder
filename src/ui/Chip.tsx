import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from './cx'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  children: ReactNode
}

/** Filter chip (M3) — ใช้กรองแบรนด์ / เลือกตัวเลือกสินค้า */
export default function Chip({ selected, className, children, type = 'button', ...rest }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cx(
        'inline-flex h-8 flex-none items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors',
        selected
          ? 'border-on-surface bg-on-surface text-surface'
          : 'border-outline-variant text-on-surface-variant active:bg-on-surface/10',
        className,
      )}
      {...rest}
    >
            {children}
    </button>
  )
}
