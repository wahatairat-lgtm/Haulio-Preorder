import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from './cx'
import Icon from './Icon'

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
        'inline-flex h-8 flex-none items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors',
        selected
          ? 'border-transparent bg-secondary-container text-on-secondary-container'
          : 'border-outline-variant text-on-surface-variant active:bg-on-surface/10',
        className,
      )}
      {...rest}
    >
      {selected && <Icon name="check" size={16} />}
      {children}
    </button>
  )
}
