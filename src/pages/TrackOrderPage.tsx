import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { db } from '../firebase'
import type { Order } from '../types'

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams()
  const [orderId, setOrderId] = useState(searchParams.get('order') ?? '')
  const [order, setOrder] = useState<Order | null | undefined>(undefined)

  async function lookup(id: string) {
    if (!id.trim()) return
    setOrder(undefined)
    const snap = await getDoc(doc(db, 'orders', id.trim()))
    setOrder(snap.exists() ? ({ id: snap.id, ...snap.data() } as Order) : null)
  }

  useEffect(() => {
    if (orderId) lookup(orderId)
  }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    lookup(orderId)
  }

  return (
    <div className="flex flex-1 flex-col px-4 pb-6 pt-4">
      <h1 className="mb-3 text-lg font-semibold text-gray-900">เช็คสถานะออเดอร์</h1>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="วางรหัสออเดอร์"
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-lg bg-rose-500 px-4 text-sm font-medium text-white">
          ค้นหา
        </button>
      </form>

      {order === null && <p className="text-sm text-gray-400">ไม่พบออเดอร์นี้</p>}

      {order && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-gray-500">{order.id}</span>
            <StatusBadge status={order.status} />
          </div>
          <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
            {order.items.map((item) => (
              <div key={item.productId + (item.variant ?? '')} className="flex items-center gap-2 p-2 text-sm">
                <img src={item.imageUrl} alt={item.name} className="h-10 w-10 rounded object-cover" />
                <span className="flex-1 truncate">
                  {item.name}
                  {item.variant && ` (${item.variant})`}
                </span>
                <span className="text-gray-500">x{item.qty}</span>
              </div>
            ))}
          </div>
          <p className="text-right text-sm font-semibold text-gray-900">
            รวม ฿{order.total.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  )
}
