import { Link, useParams } from 'react-router-dom'

export default function OrderSuccessPage() {
  const { orderId } = useParams()

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-5xl">✅</div>
      <h1 className="text-lg font-semibold text-gray-900">ส่งคำสั่งซื้อสำเร็จ</h1>
      <p className="text-sm text-gray-500">
        รหัสออเดอร์ของคุณคือ
        <br />
        <span className="font-mono text-base font-semibold text-gray-900">{orderId}</span>
      </p>
      <p className="text-xs text-gray-400">เก็บรหัสนี้ไว้เช็คสถานะการตรวจสลิป</p>
      <div className="mt-2 flex w-full gap-2">
        <Link
          to={`/track?order=${orderId}`}
          className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700"
        >
          เช็คสถานะ
        </Link>
        <Link
          to="/"
          className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-medium text-white"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  )
}
