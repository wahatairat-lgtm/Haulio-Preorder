import { Link, useParams } from 'react-router-dom'
import { Button, Icon } from '../ui'

export default function OrderSuccessPage() {
  const { orderId } = useParams()

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-container text-primary">
        <Icon name="checkCircle" size={56} />
      </span>
      <h1 className="text-xl font-semibold text-on-surface">ส่งคำสั่งซื้อสำเร็จ</h1>
      <div>
        <p className="text-sm text-on-surface-variant">รหัสออเดอร์ของคุณคือ</p>
        <p className="mt-1 text-xl font-bold tracking-wider text-primary">{orderId}</p>
      </div>
      <p className="text-xs text-on-surface-variant">เก็บรหัสนี้ไว้เช็คสถานะการตรวจสลิป</p>
      <div className="mt-2 flex w-full gap-2">
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
