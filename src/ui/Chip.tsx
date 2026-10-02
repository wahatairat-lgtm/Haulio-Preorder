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
        'inline-flex h-8 flex-none items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors',
        selected
          ? 'border-primary bg-primary text-on-primary'
          : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant active:bg-surface-container',
        className,
      )}
      {...rest}
    >
            {children}
    </button>
  )
}
