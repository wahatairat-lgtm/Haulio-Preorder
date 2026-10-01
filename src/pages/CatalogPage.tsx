import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { db } from '../firebase'
import type { Category, Product } from '../types'

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Category>('kr')
  const { addItem } = useCart()

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product))
      setLoading(false)
    })
  }, [])

  const filtered = products.filter((p) => p.category === tab)

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 bg-white px-4 pb-2 pt-4">
        <h1 className="text-lg font-semibold text-gray-900">พรีออเดอร์เกาหลี · ญี่ปุ่น</h1>
        <div className="mt-3 flex rounded-xl bg-gray-100 p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setTab('kr')}
            className={`flex-1 rounded-lg py-1.5 ${tab === 'kr' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-500'}`}
          >
            🇰🇷 เกาหลี
          </button>
          <button
            type="button"
            onClick={() => setTab('jp')}
            className={`flex-1 rounded-lg py-1.5 ${tab === 'jp' ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-500'}`}
          >
            🇯🇵 ญี่ปุ่น
          </button>
        </div>
      </header>

      <main className="flex-1 space-y-2 px-4 pb-4">
        {loading && <p className="pt-8 text-center text-sm text-gray-400">กำลังโหลด...</p>}
        {!loading && filtered.length === 0 && (
          <p className="pt-8 text-center text-sm text-gray-400">ยังไม่มีสินค้าในหมวดนี้</p>
        )}
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={addItem} />
        ))}
      </main>
    </div>
  )
}
