import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.jpg'
import ProductCard from '../components/ProductCard'
import ProductSheet from '../components/ProductSheet'
import WindowLabel from '../components/WindowLabel'
import { useCart } from '../context/CartContext'
import { cachedProducts, cachedSettings, fetchProducts, fetchSettings } from '../lib/api'
import { productType, typesIn } from '../lib/categorize'
import { searchProducts } from '../lib/search'
import type { Category, Product, Schedule } from '../types'
import { Button, Chip, SearchBar, Snackbar, Tabs } from '../ui'


export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>(() => cachedProducts() ?? [])
  const [loading, setLoading] = useState(() => !cachedProducts())
  const [failed, setFailed] = useState(false)
  const [tab, setTab] = useState<Category>('kr')
  const [type, setType] = useState('')
  const [query, setQuery] = useState('')
  const [schedule, setSchedule] = useState<Schedule | null>(() => cachedSettings()?.schedule ?? null)
  const [selected, setSelected] = useState<Product | null>(null)
  const [toast, setToast] = useState('')
  const { addItem } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setFailed(!cachedProducts()))
      .finally(() => setLoading(false))
    fetchSettings()
      .then((s) => setSchedule(s.schedule))
      .catch(() => {})
  }, [])

  const inTab = useMemo(() => products.filter((p) => p.category === tab), [products, tab])
  const otherTab: Category = tab === 'kr' ? 'jp' : 'kr'
  const otherHits = useMemo(
    () => (query.trim() ? searchProducts(products.filter((p) => p.category === otherTab), query).length : 0),
    [products, otherTab, query],
  )
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
    setToast(`ใส่ตะกร้าแล้ว: ${product.name}`)
  }

  const range = schedule?.[tab]
  const counts = useMemo(() => ({ kr: products.filter((p) => p.category === 'kr').length, jp: products.filter((p) => p.category === 'jp').length }), [products])

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex flex-col gap-3 px-4 pb-3 pt-4">
        <img src={logo} alt="Haulio Pre-order" className="logo-ink h-9 w-auto self-start" />
        <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหา เช่น กันแดด, matcha, Elixir" aria-label="ค้นหาสินค้า" />
      </header>

      {range && (
        <div className="px-4 pb-4">
          <WindowLabel country={tab === 'kr' ? 'เกาหลี' : 'ญี่ปุ่น'} openRange={range.openRange} shipDate={range.shipDate} />
        </div>
      )}

      <div className="px-4">
        <Tabs
          options={[
            { value: 'kr' as const, label: 'เกาหลี', count: counts.kr },
            { value: 'jp' as const, label: 'ญี่ปุ่น', count: counts.jp },
          ]}
          value={tab}
          onChange={changeTab}
        />
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

      <div className="flex items-baseline justify-between px-4 pb-3 pt-5">
        <h2 className="text-lg font-semibold text-on-surface">{query.trim() ? `ผลการค้นหา` : type || 'สินค้าทั้งหมด'}</h2>
        {!loading && <span className="num text-sm text-on-surface-variant">{visible.length} รายการ</span>}
      </div>

      <main className="flex-1 px-4 pb-6">
        {loading && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-4/5 animate-pulse rounded-md bg-surface-container-high" />
                <div className="h-3 w-3/4 animate-pulse rounded-full bg-surface-container-high" />
                <div className="h-4 w-1/3 animate-pulse rounded-full bg-surface-container-high" />
              </div>
            ))}
          </div>
        )}
        {failed && (
          <div className="flex flex-col items-center gap-3 pt-8 text-center text-sm">
            <p className="text-error">โหลดสินค้าไม่สำเร็จ อินเทอร์เน็ตอาจสะดุด</p>
            <Button variant="outlined" className="h-10" onClick={() => window.location.reload()}>
              ลองอีกครั้ง
            </Button>
          </div>
        )}
        {!loading && !failed && visible.length === 0 && (
          <div className="flex flex-col items-center gap-3 pt-8 text-center text-sm text-on-surface-variant">
            <p>{inTab.length === 0 ? 'ยังไม่มีสินค้าในแท็บนี้' : `ไม่พบ “${query.trim()}” ลองคำอื่น เช่น ชื่อแบรนด์หรือประเภทสินค้า`}</p>
            {otherHits > 0 && (
              <Button variant="outlined" className="h-10" onClick={() => changeTab(otherTab)}>
                พบ {otherHits} รายการในแท็บ{otherTab === 'kr' ? 'เกาหลี' : 'ญี่ปุ่น'}
              </Button>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 gap-x-3 gap-y-6">
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
