import type { OrderStatus } from '../types'

const LABELS: Record<OrderStatus, { text: string; cls: string }> = {
  pending: { text: 'รอตรวจสลิป', cls: 'bg-tertiary-container text-on-tertiary-container' },
  paid: { text: 'ยืนยันการชำระเงินแล้ว', cls: 'bg-secondary-container text-on-secondary-container' },
  rejected: { text: 'สลิปไม่ถูกต้อง', cls: 'bg-error-container text-on-error-container' },
  shipped: { text: 'จัดส่งแล้ว', cls: 'bg-primary-container text-on-primary-container' },
  done: { text: 'สำเร็จ', cls: 'bg-surface-container-highest text-on-surface' },
}

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const { text, cls } = LABELS[status]
  return <span className={`inline-flex h-8 items-center rounded-full px-3 text-sm font-medium ${cls}`}>{text}</span>
}
