import type { ReactNode } from 'react'
import { cx } from './cx'

/** ราคาเป็นสติกเกอร์กลมแปะมุมรูปสินค้า (ลายเซ็นของหน้าร้าน) */
export default function PriceSticker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'num inline-flex h-11 min-w-[3.75rem] -rotate-6 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-primary px-3.5 text-base font-bold leading-none text-on-primary shadow-e2',
        className,
      )}
    >
      {children}
    </span>
  )
}
