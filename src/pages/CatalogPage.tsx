import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.jpg'
import ProductCard from '../components/ProductCard'
import ProductSheet from '../components/ProductSheet'
import { useCart } from '../context/CartContext'
import { fetchProducts, fetchSettings } from '../lib/api'
import { productType, typesIn } from '../lib/categorize'
import { searchProducts } from '../lib/search'
import type { Category, Product, Schedule } from '../types'
import { Chip, Icon, SearchBar, SegmentedButton, Snackbar } from '../ui'

const COUNTRIES = [
  { value: 'kr' as const, label: 'เกาหลี' },
  { value: 'jp' as const, label: 'ญี่ปุ่น' },
]

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [tab, setTab] = useState<Category>('jp')
  const [type, setType] = useState('')
  const [query, setQuery] = useState('')
  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [selected, setSelected] = useState<Product | null>(null)
  const [toast, setToast] = useState('')
  const { addItem } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
    fetchSettings()
      .then((s) => setSchedule(s.schedule))
      .catch(() => {})
  }, [])

  const inTab = useMemo(() => products.filter((p) => p.category === tab), [products, tab])
  const types = useMemo(() => typesIn(inTab), [inTab])
  // พิมพ์ค้นหา = ค้นทั้งแท็บ (ไม่ติดตัวกรองหมวด) / ไม่ค้น = กรองตาม chip
  const visible = useMemo(
    () => (query.trim() ? searchProducts(inTab, query) : inTab.filter((p) => !type || productType(p) === type)),
    [inTab, type, query],
  )

  function changeTab(next: Category) {
    setTab(next)
    setType('')
  }

  function add(product: Product, variant: string | undefined, qty: number) {
    for (let i = 0; i < qty; i++) addItem(product, variant)
    setSelected(null)
    setToast(`เพิ่ม ${product.name} ลงตะกร้าแล้ว`)
  }

  const range = schedule?.[tab]

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex flex-col gap-3 px-4 pb-2 pt-4">
        <img src={logo} alt="Haulio Pre-order" className="h-10 w-auto self-start" />
        <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหา เช่น กันแดด, matcha, Elixir" aria-label="ค้นหาสินค้า" />
      </header>

      <section className="px-4 pt-2">
        <div className="relative overflow-hidden rounded-xl bg-primary p-5 text-on-primary">
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-primary-container/15" aria-hidden="true" />
          <div className="absolute -bottom-12 right-10 h-28 w-28 rounded-full bg-primary-container/10" aria-hidden="true" />
          <p className="relative text-xs font-medium text-primary-container">
            Pre-order {tab === 'kr' ? 'เกาหลี' : 'ญี่ปุ่น'}
          </p>
          <p className="relative mt-1 text-2xl font-semibold leading-tight">
            {range ? `เปิดรับ ${range.openRange}` : 'พรีออเดอร์สินค้านำเข้า'}
          </p>
          {range && (
            <span className="relative mt-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-primary-container px-3 text-sm font-medium text-on-primary-container">
              <Icon name="truck" size={18} />
              จัดส่ง {range.shipDate}
            </span>
          )}
        </div>
      </section>

      <div className="px-4 pt-4">
        <SegmentedButton options={COUNTRIES} value={tab} onChange={changeTab} />
      </div>

      {types.length > 1 && !query.trim() && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pt-3">
          <Chip selected={!type} onClick={() => setType('')}>
            ทั้งหมด
          </Chip>
          {types.map((t) => (
            <Chip key={t} selected={type === t} onClick={() => setType(t)}>
              {t}
            </Chip>
          ))}
        </div>
      )}

      <div className="flex items-baseline justify-between px-4 pb-2 pt-5">
        <h2 className="text-lg font-semibold text-on-surface">สินค้า</h2>
        {!loading && <span className="text-sm text-on-surface-variant">{visible.length} รายการ</span>}
      </div>

      <main className="flex-1 px-4 pb-6">
        {loading && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-4/5 animate-pulse rounded-xl bg-surface-container-high" />
                <div className="h-3 w-3/4 animate-pulse rounded-full bg-surface-container-high" />
                <div className="h-4 w-1/3 animate-pulse rounded-full bg-surface-container-high" />
              </div>
            ))}
          </div>
        )}
        {failed && <p className="pt-8 text-center text-sm text-error">โหลดสินค้าไม่สำเร็จ ลองรีเฟรชหน้าอีกครั้ง</p>}
        {!loading && !failed && visible.length === 0 && (
          <p className="pt-8 text-center text-sm text-on-surface-variant">
            {inTab.length === 0 ? 'ยังไม่มีสินค้าในหมวดนี้' : 'ไม่พบสินค้าที่ค้นหา'}
          </p>
        )}
        <div className="grid grid-cols-2 gap-x-3 gap-y-5">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={setSelected} />
          ))}
        </div>
      </main>

      <ProductSheet product={selected} onClose={() => setSelected(null)} onAdd={add} />
      {toast && (
        <Snackbar message={toast} actionLabel="ดูตะกร้า" onAction={() => navigate('/cart')} onClose={() => setToast('')} />
      )}
    </div>
  )
}
