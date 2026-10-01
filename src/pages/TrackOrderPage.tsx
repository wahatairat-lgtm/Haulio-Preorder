import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { fetchOrder } from '../lib/api'
import { baht } from '../lib/format'
import type { Order, OrderStatus } from '../types'
import { Button, Card, cx, ProductImage, SearchBar, TopAppBar } from '../ui'

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'pending', label: 'รับออเดอร์' },
  { status: 'paid', label: 'ยืนยันชำระเงิน' },
  { status: 'shipped', label: 'จัดส่ง' },
  { status: 'done', label: 'สำเร็จ' },
]

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams()
  const [orderId, setOrderId] = useState(searchParams.get('order') ?? '')
  const [order, setOrder] = useState<Order | null | undefined>(undefined)

  async function lookup(id: string) {
    if (!id.trim()) return
    setOrder(undefined)
    setOrder(await fetchOrder(id.trim()))
  }

  useEffect(() => {
    if (orderId) lookup(orderId)
  }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    lookup(orderId)
  }

  const stepIndex = order ? STEPS.findIndex((s) => s.status === order.status) : -1

  return (
    <div className="flex flex-1 flex-col">
      <TopAppBar title="เช็คสถานะออเดอร์" />
      <div className="flex flex-1 flex-col gap-4 px-4 pb-6 pt-2">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="min-w-0 flex-1">
            <SearchBar value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="วางรหัสออเดอร์" aria-label="รหัสออเดอร์" />
          </div>
          <Button type="submit" className="px-5">
            ค้นหา
          </Button>
        </form>

        {order === null && <p className="text-sm text-on-surface-variant">ไม่พบออเดอร์นี้</p>}

        {order && (
          <>
            <Card className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold tracking-wide text-on-surface">{order.id}</span>
                <StatusBadge status={order.status} />
              </div>
              {order.status !== 'rejected' && stepIndex >= 0 && (
                <ol className="flex items-start pt-1">
                  {STEPS.map((s, i) => (
                    <li key={s.status} className="relative flex flex-1 flex-col items-center gap-1 text-center">
                      {i > 0 && (
                        <span className={cx('absolute right-1/2 top-2 h-0.5 w-full', i <= stepIndex ? 'bg-primary' : 'bg-outline-variant')} />
                      )}
                      <span
                        className={cx(
                          'relative z-10 h-4 w-4 rounded-full border-2',
                          i <= stepIndex ? 'border-primary bg-primary' : 'border-outline-variant bg-surface-container-lowest',
                        )}
                      />
                      <span className={cx('text-[11px] leading-tight', i <= stepIndex ? 'font-medium text-on-surface' : 'text-on-surface-variant')}>
                        {s.label}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </Card>

            <Card className="divide-y divide-outline-variant">
              {order.items.map((item) => (
                <div key={item.productId + (item.variant ?? '')} className="flex items-center gap-3 p-3 text-sm">
                  <ProductImage src={item.imageUrl} alt={item.name} className="h-14 w-12 flex-none rounded-sm" />
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-on-surface">{item.name}</span>
                    {item.variant && <span className="block truncate text-xs text-on-surface-variant">{item.variant}</span>}
                  </span>
                  <span className="text-on-surface-variant">x{item.qty}</span>
                </div>
              ))}
              <div className="flex items-baseline justify-between p-3">
                <span className="text-sm text-on-surface-variant">ยอดรวม</span>
                <span className="text-lg font-bold text-primary">{baht(order.total)}</span>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
