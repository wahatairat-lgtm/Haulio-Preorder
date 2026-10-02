import { Link, useParams } from 'react-router-dom'
import { Button } from '../ui'

export default function OrderSuccessPage() {
  const { orderId } = useParams()

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="-rotate-3 border-[3px] border-primary px-5 py-2 font-mono text-lg font-semibold uppercase tracking-[0.2em] text-primary">
        Order received
      </div>
      <div>
        <h1 className="text-xl font-semibold text-on-surface">ได้รับออเดอร์แล้ว</h1>
        <p className="mt-1 text-sm text-on-surface-variant">ร้านจะตรวจสลิปและอัปเดตสถานะให้ เก็บรหัสนี้ไว้เช็คได้ที่หน้า “เช็คสถานะ”</p>
      </div>
      <div className="w-full max-w-xs border border-dashed border-outline px-4 py-3">
        <p className="text-xs font-medium text-on-surface-variant">รหัสออเดอร์</p>
        <p className="mt-1 font-mono text-2xl font-semibold tracking-wider text-on-surface">{orderId}</p>
      </div>
      <div className="flex w-full gap-2">
        <Link to={`/track?order=${orderId}`} className="flex-1">
          <Button variant="outlined" full>
            เช็คสถานะ
          </Button>
        </Link>
        <Link to="/" className="flex-1">
          <Button full>กลับหน้าแรก</Button>
        </Link>
      </div>
    </div>
  )
}
