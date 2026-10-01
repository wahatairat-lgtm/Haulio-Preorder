import { useState } from 'react'
import { cx } from './cx'
import Icon from './Icon'

/** รูปสินค้า — ถ้าไม่มี/โหลดไม่ได้ แสดงช่องสี tonal พร้อมไอคอนแทน */
export default function ProductImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(src) && !failed
  return (
    <div className={cx('overflow-hidden bg-primary-container', className)}>
      {showImage ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-on-primary-container/40">
          <Icon name="image" size={32} />
        </div>
      )}
    </div>
  )
}
