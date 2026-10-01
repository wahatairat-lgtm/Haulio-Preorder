import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import StatusBadge from '../../components/StatusBadge'
import { db } from '../../firebase'
import type { Order, OrderStatus } from '../../types'

const FILTERS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'pending', label: 'รอตรวจ' },
  { value: 'paid', label: 'ยืนยันแล้ว' },
  { value: 'rejected', label: 'ไม่ถูกต้อง' },
  { value: 'shipped', label: 'จัดส่งแล้ว' },
]

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<OrderStatus | 'all'>('pending')
  const [zoomUrl, setZoomUrl] = useState<string>('')

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order))
    })
  }, [])

  async function setStatus(orderId: string, status: OrderStatus) {
    await updateDoc(doc(db, 'orders', orderId), { status, updatedAt: Date.now() })
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-medium">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`flex-none rounded-full px-3 py-1.5 ${
              filter === f.value ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="pt-8 text-center text-sm text-gray-400">ไม่มีออเดอร์</p>}

      {filtered.map((order) => (
        <div key={order.id} className="rounded-xl border border-gray-100 p-3 text-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs text-gray-400">{order.id}</span>
            <StatusBadge status={order.status} />
          </div>
          <p className="font-medium text-gray-900">{order.customerName} · {order.customerPhone}</p>
          <p className="text-xs text-gray-500">{order.address}</p>
          <div className="my-2 space-y-1">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between text-xs text-gray-600">
                <span>{item.name} x{item.qty}</span>
                <span>฿{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => setZoomUrl(order.slipUrl)}>
              <img src={order.slipUrl} alt="สลิป" className="h-14 w-14 rounded-lg border border-gray-200 object-cover" />
            </button>
            <span className="font-semibold text-gray-900">฿{order.total.toLocaleString()}</span>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setStatus(order.id, 'paid')}
              className="flex-1 rounded-lg bg-emerald-500 py-1.5 text-xs font-medium text-white"
            >
              ยืนยันสลิป
            </button>
            <button
              type="button"
              onClick={() => setStatus(order.id, 'rejected')}
              className="flex-1 rounded-lg bg-red-500 py-1.5 text-xs font-medium text-white"
            >
              ปฏิเสธ
            </button>
            <button
              type="button"
              onClick={() => setStatus(order.id, 'shipped')}
              className="flex-1 rounded-lg bg-blue-500 py-1.5 text-xs font-medium text-white"
            >
              จัดส่งแล้ว
            </button>
          </div>
        </div>
      ))}

      {zoomUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setZoomUrl('')}
        >
          <img src={zoomUrl} alt="สลิปโอนเงิน" className="max-h-full max-w-full rounded-lg" />
        </div>
      )}
    </div>
  )
}
