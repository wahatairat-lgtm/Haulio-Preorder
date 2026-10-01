import { cx } from './cx'

export default function Badge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null
  return (
    <span
      className={cx(
        'inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[11px] font-medium leading-none text-on-error',
        className,
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}
