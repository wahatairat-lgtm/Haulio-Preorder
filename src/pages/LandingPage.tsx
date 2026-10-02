import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpg'
import WindowLabel from '../components/WindowLabel'
import { cachedProducts, cachedSettings, fetchProducts, fetchSettings } from '../lib/api'
import { baht } from '../lib/format'
import { productImage } from '../lib/image'
import type { Product, Schedule } from '../types'
import { Button, Icon, ProductImage, Reveal, type IconName } from '../ui'

const STEPS: { icon: IconName; title: string; body: string }[] = [
  { icon: 'search', title: 'เลือกสินค้า', body: 'ดูสินค้าของรอบที่เปิดอยู่ เลือกรสชาติหรือตัวเลือก แล้วใส่ตะกร้าก่อนปิดรับ' },
  { icon: 'qr', title: 'โอนเงินและแนบสลิป', body: 'โอนเข้าบัญชีหรือสแกน QR พร้อมเพย์ที่ใส่ยอดให้แล้ว จากนั้นแนบรูปสลิป' },
  { icon: 'truck', title: 'รอรับของ', body: 'เมื่อปิดรับ ร้านสั่งซื้อและจัดส่งตามวันที่ระบุในแต่ละรอบ เช็คสถานะได้ด้วยรหัสออเดอร์' },
]

const FAQ = [
  {
    q: 'รอบพรีออเดอร์คืออะไร',
    a: 'ร้านเปิดรับออเดอร์เป็นช่วงเวลา เช่น 1 - 17 ต.ค. เมื่อปิดรับแล้วจึงสั่งซื้อสินค้าจากเกาหลีหรือญี่ปุ่น และจัดส่งตามวันที่ระบุไว้ในแต่ละรอบ',
  },
  {
    q: 'จ่ายเงินอย่างไร',
    a: 'โอนเข้าบัญชีธนาคารหรือสแกน QR พร้อมเพย์ ระบบใส่ยอดให้ในหน้าชำระเงิน แล้วแนบรูปสลิปก่อนกดยืนยันสั่งซื้อ',
  },
  {
    q: 'คืนเงินได้ไหม',
    a: 'ร้านไม่คืนเงินทุกกรณี โปรดตรวจสอบสินค้า ตัวเลือก และจำนวนในตะกร้าให้ถูกต้องก่อนกดยืนยันสั่งซื้อ',
  },
  {
    q: 'เช็คสถานะออเดอร์ได้ที่ไหน',
    a: 'ใช้รหัสออเดอร์ที่ได้หลังสั่งซื้อ ที่หน้า “เช็คสถานะ” จะเห็นว่ารอตรวจสลิป ชำระเงินแล้ว หรือจัดส่งแล้ว',
  },
  {
    q: 'ถ้าสลิปมีปัญหาต้องทำอย่างไร',
    a: 'สถานะจะขึ้นว่า “สลิปมีปัญหา” และร้านจะติดต่อทาง LINE ที่คุณกรอกไว้ตอนสั่งซื้อ',
  },
]

const HERO_IDS = ['K02', 'K01', 'K03']
const PICK_IDS = ['K01', 'K02', 'K03', 'K04', 'K05', 'K06']

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>(() => cachedProducts() ?? [])
  const [schedule, setSchedule] = useState<Schedule | null>(() => cachedSettings()?.schedule ?? null)

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => {})
    fetchSettings().then((s) => setSchedule(s.schedule)).catch(() => {})
  }, [])

  // สินค้าแนะนำ: รายการที่มีรูปจริงก่อน ไม่งั้นใช้ 6 ชิ้นแรกของเกาหลี
  const picks = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]))
    const withPhoto = PICK_IDS.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p?.available))
    return withPhoto.length >= 3 ? withPhoto : products.filter((p) => p.category === 'kr' && p.available).slice(0, 6)
  }, [products])

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-tertiary-container px-4">
        <img src={logo} alt="Haulio Pre-order" className="logo-ink h-8 w-auto" />
        <Link to="/">
          <Button className="h-10 px-4">เข้าร้าน</Button>
        </Link>
      </header>

      <main className="flex-1">
        {/* Hero: ข้อความสั้น + รูปสินค้าจริง */}
        <section className="px-4 pb-10 pt-8">
          <h1 className="rise text-[34px] font-semibold leading-[1.2] tracking-tight text-on-surface">
            สั่งของเกาหลีและญี่ปุ่น
            <br />
            เป็นรอบ ส่งถึงบ้าน
          </h1>
          <p className="rise mt-4 max-w-[34ch] text-base leading-relaxed text-on-surface-variant" style={{ ['--i' as string]: 2 }}>
            เลือกสินค้า โอนเงิน แล้วรอรับของ ร้านเปิดรับเป็นรอบ ปิดรับแล้วเราสั่งซื้อและส่งให้ตามวันที่แจ้ง
          </p>
          <div className="rise mt-6" style={{ ['--i' as string]: 4 }}>
            <Link to="/">
              <Button className="h-12 px-7 text-base">
                เข้าร้าน
                <Icon name="arrowRight" size={20} weight="bold" />
              </Button>
            </Link>
          </div>

          <div className="rise relative mt-9 h-[300px]" style={{ ['--i' as string]: 6 }}>
            <div className="absolute left-0 top-0 h-[210px] w-[55%]">
              <ProductImage
                src={productImage({ id: HERO_IDS[0] })}
                alt="ครีมกันแดด Round Lab Birch Juice"
                brand="Round Lab"
                className="h-full w-full rounded-md border border-outline-variant"
              />
            </div>
            <div className="absolute right-0 top-8 h-[150px] w-[40%]">
              <ProductImage
                src={productImage({ id: HERO_IDS[1] })}
                alt="ครีมกันแดด Beauty of Joseon Relief Sun"
                brand="Beauty of Joseon"
                className="h-full w-full rounded-md border border-outline-variant"
              />
            </div>
            <div className="absolute bottom-0 right-[8%] h-[130px] w-[46%]">
              <ProductImage
                src={productImage({ id: HERO_IDS[2] })}
                alt="เอสเซนส์ COSRX Snail 96 Mucin"
                brand="COSRX"
                className="h-full w-full rounded-md border border-outline-variant"
              />
            </div>
          </div>
        </section>

        {/* รอบที่เปิดอยู่: ข้อมูลสดจาก Settings */}
        <section className="border-t border-outline-variant bg-surface-container-low px-4 py-10">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-on-surface">รอบที่เปิดอยู่</h2>
            <p className="mt-1 text-sm text-on-surface-variant">แต่ละประเทศมีวันปิดรับและวันจัดส่งของตัวเอง</p>
          </Reveal>
          <div className="mt-5 flex flex-col gap-4">
            {schedule ? (
              (['kr', 'jp'] as const).map((c, i) => (
                <Reveal key={c} index={i}>
                  <Link to={`/?tab=${c}`} className="block">
                    <WindowLabel country={c === 'kr' ? 'เกาหลี' : 'ญี่ปุ่น'} openRange={schedule[c].openRange} shipDate={schedule[c].shipDate} />
                  </Link>
                </Reveal>
              ))
            ) : (
              <div className="h-40 animate-pulse rounded-md bg-surface-container-high" />
            )}
          </div>
        </section>

        {/* วิธีสั่ง: timeline แนวตั้ง */}
        <section className="px-4 py-12">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-on-surface">สั่งอย่างไร</h2>
          </Reveal>
          <ol className="relative mt-6 flex flex-col gap-8 pl-14 before:absolute before:bottom-3 before:left-[19px] before:top-3 before:w-px before:bg-outline-variant">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} index={i} className="relative">
                <span className="absolute -left-14 top-0 flex size-10 items-center justify-center rounded-md border border-outline-variant bg-surface text-primary">
                  <Icon name={s.icon} size={22} />
                </span>
                <h3 className="text-lg font-semibold text-on-surface">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* สินค้าแนะนำ: เลื่อนข้าง */}
        {picks.length > 0 && (
          <section className="border-t border-outline-variant py-12">
            <Reveal className="flex items-baseline justify-between px-4">
              <h2 className="text-2xl font-semibold tracking-tight text-on-surface">สินค้าแนะนำ</h2>
              <Link to="/" className="text-sm font-medium text-primary underline underline-offset-4">
                ดูทั้งหมด
              </Link>
            </Reveal>
            <div className="no-scrollbar mt-5 flex snap-x snap-mandatory scroll-pl-4 gap-3 overflow-x-auto px-4">
              {picks.map((p) => (
                <Link key={p.id} to="/" className="w-[148px] flex-none snap-start">
                  <ProductImage src={productImage(p)} alt={p.name} brand={p.brand} code={p.id} className="aspect-4/5 w-full rounded-md border border-outline-variant" />
                  <p className="mt-2 truncate text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant">{p.brand}</p>
                  <p className="line-clamp-2 text-sm leading-snug text-on-surface">{p.name}</p>
                  <p className="num mt-1 text-base font-semibold text-on-surface">{baht(p.price)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* คำถามพบบ่อย */}
        <section className="border-t border-outline-variant bg-surface-container-low px-4 py-12">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-on-surface">คำถามที่พบบ่อย</h2>
          </Reveal>
          <div className="mt-5">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-b border-outline-variant py-4 first:border-t">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-on-surface [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Icon name="expand" size={20} className="flex-none text-on-surface-variant transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="px-4 py-14">
          <Reveal>
            <h2 className="text-[28px] font-semibold leading-tight tracking-tight text-on-surface">ดูสินค้าของรอบนี้</h2>
            <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-on-surface-variant">สินค้าเกาหลีและญี่ปุ่นพร้อมให้เลือกแล้ว สั่งได้จนถึงวันปิดรับของแต่ละรอบ</p>
            <Link to="/" className="mt-5 inline-block">
              <Button className="h-12 px-7 text-base">
                เข้าร้าน
                <Icon name="arrowRight" size={20} weight="bold" />
              </Button>
            </Link>
          </Reveal>
        </section>
      </main>

      <footer className="flex items-center justify-between border-t border-outline-variant px-4 py-5 text-sm text-on-surface-variant">
        <img src={logo} alt="Haulio Pre-order" className="logo-ink h-6 w-auto" />
        <Link to="/track" className="underline underline-offset-4">
          เช็คสถานะออเดอร์
        </Link>
      </footer>
    </div>
  )
}
