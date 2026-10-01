import { useEffect, type ReactNode } from 'react'

/** Modal bottom sheet (M3) */
export default function BottomSheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex justify-center">
      <div className="absolute inset-0 bg-scrim/32" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        className="absolute bottom-0 flex max-h-[90svh] w-full max-w-120 flex-col rounded-t-xl bg-surface-container-low shadow-e3"
      >
        <div className="mx-auto mt-3 mb-1 h-1 w-8 flex-none rounded-full bg-on-surface-variant/40" />
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
