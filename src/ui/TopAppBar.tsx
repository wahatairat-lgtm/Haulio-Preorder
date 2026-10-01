import type { ReactNode } from 'react'
import IconButton from './IconButton'

/** Center-aligned top app bar (M3) */
export default function TopAppBar({ title, onBack, trailing }: { title: string; onBack?: () => void; trailing?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 grid h-16 grid-cols-[3rem_1fr_3rem] items-center bg-surface-container-lowest px-2">
      <div>{onBack && <IconButton icon="back" label="ย้อนกลับ" variant="outlined" onClick={onBack} />}</div>
      <h1 className="text-center text-base font-semibold text-on-surface">{title}</h1>
      <div className="flex justify-end">{trailing}</div>
    </header>
  )
}
