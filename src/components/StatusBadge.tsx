import type { OrderStatus } from '../types'

const LABELS: Record<OrderStatus, { text: string; cls: string }> = {
  pending: { text: 'รอตรวจสลิป', cls: 'bg-amber-100 text-amber-700' },
  paid: { text: 'ยืนยันแล้ว', cls: 'bg-emerald-100 text-emerald-700' },
  rejected: { text: 'สลิปไม่ถูกต้อง', cls: 'bg-red-100 text-red-700' },
  shipped: { text: 'จัดส่งแล้ว', cls: 'bg-blue-100 text-blue-700' },
  done: { text: 'สำเร็จ', cls: 'bg-gray-200 text-gray-700' },
}

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const { text, cls } = LABELS[status]
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      {text}
    </span>
  )
}
