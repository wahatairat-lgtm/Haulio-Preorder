import { useEffect } from 'react'
import Button from './Button'

/** Snackbar (M3) — หายเองใน 3 วินาที */
export default function Snackbar({
  message,
  actionLabel,
  onAction,
  onClose,
}: {
  message: string
  actionLabel?: string
  onAction?: () => void
  onClose: () => void
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [message, onClose])

  return (
    <div role="status" className="fixed inset-x-4 bottom-28 z-50 mx-auto flex max-w-112 items-center gap-2 rounded-sm bg-on-surface py-1 pl-4 pr-2 text-sm text-surface shadow-e3">
      <span className="flex-1 py-3">{message}</span>
      {actionLabel && (
        <Button variant="text" className="h-10 px-3 text-inverse-primary!" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
