import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cx } from './cx'

/**
 * เผยเนื้อหาเมื่อเลื่อนมาถึง (IntersectionObserver ไม่ฟัง scroll event) ใช้เล่าเรื่องตามลำดับเท่านั้น
 * ผู้ใช้ที่ตั้ง reduce motion จะเห็นเนื้อหาทันที (CSS .reveal มีผลเฉพาะ no-preference)
 */
export default function Reveal({ children, index = 0, className, as: Tag = 'div' }: { children: ReactNode; index?: number; className?: string; as?: 'div' | 'li' | 'section' }) {
  const ref = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen])

  return (
    <Tag ref={ref as never} className={cx('reveal', className)} data-in={seen} style={{ ['--i' as string]: index }}>
      {children}
    </Tag>
  )
}
