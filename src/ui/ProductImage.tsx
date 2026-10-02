import { useState } from 'react'
import { cx } from './cx'

/**
 * รูปสินค้า — ถ้าไม่มีรูป/โหลดไม่ได้ แสดงป้ายกล่องคราฟท์ (ชื่อแบรนด์ + รหัสสินค้า)
 * ดีกว่าไอคอนรูปภาพเปล่าๆ: ลูกค้ายังรู้ว่าเป็นสินค้าอะไร และอ้างรหัสทักไลน์ได้
 */
export default function ProductImage({ src, alt, brand, code, className }: { src?: string; alt: string; brand?: string; code?: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(src) && !failed
  return (
    <div className={cx('relative overflow-hidden bg-tertiary-container', className)}>
      {showImage ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-2 flex flex-col items-center justify-center border border-on-tertiary-container/25 p-2 text-center text-on-tertiary-container">
          <span className="line-clamp-3 text-[11px] font-semibold uppercase leading-snug tracking-[0.16em] opacity-80">{brand || alt}</span>
          {code && <span className="num absolute bottom-1.5 left-2 font-mono text-[10px] opacity-60">{code}</span>}
        </div>
      )}
    </div>
  )
}
