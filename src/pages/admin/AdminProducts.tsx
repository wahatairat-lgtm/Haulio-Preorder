import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { useEffect, useState, type FormEvent } from 'react'
import { db } from '../../firebase'
import { uploadImage } from '../../lib/upload'
import type { Category, Product } from '../../types'

const EMPTY_FORM = {
  name: '',
  category: 'kr' as Category,
  price: '',
  description: '',
  deadline: '',
  variants: '',
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [image, setImage] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product))
    })
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!image) return
    setSubmitting(true)
    try {
      const imageUrl = await uploadImage(image)

      const variants = form.variants
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)

      await addDoc(collection(db, 'products'), {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        description: form.description,
        deadline: form.deadline,
        ...(variants.length > 0 && { variants }),
        imageUrl,
        available: true,
        createdAt: Date.now(),
      })

      setForm(EMPTY_FORM)
      setImage(null)
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleAvailable(p: Product) {
    await updateDoc(doc(db, 'products', p.id), { available: !p.available })
  }

  async function remove(p: Product) {
    if (!confirm(`ลบ "${p.name}" ใช่ไหม?`)) return
    await deleteDoc(doc(db, 'products', p.id))
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setShowForm((v) => !v)}
        className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white"
      >
        {showForm ? 'ปิดฟอร์ม' : '+ เพิ่มสินค้า'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-2 rounded-xl border border-gray-100 p-3">
          <input
            required
            placeholder="ชื่อสินค้า"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="kr">🇰🇷 เกาหลี</option>
              <option value="jp">🇯🇵 ญี่ปุ่น</option>
            </select>
            <input
              required
              type="number"
              min="0"
              placeholder="ราคา"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
          <textarea
            placeholder="รายละเอียดสินค้า"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            placeholder="ปิดรับออเดอร์ (เช่น 10 ต.ค. 69)"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            placeholder="ตัวเลือกรส คั่นด้วยจุลภาค เช่น ช็อกโกแลต, มัทฉะ, สตรอว์เบอร์รี"
            value={form.variants}
            onChange={(e) => setForm({ ...form, variants: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            required
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="w-full text-sm"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-rose-500 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting ? 'กำลังบันทึก...' : 'บันทึกสินค้า'}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-2">
            <img src={p.imageUrl} alt={p.name} className="h-12 w-12 flex-none rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {p.category === 'kr' ? '🇰🇷' : '🇯🇵'} {p.name}
              </p>
              <p className="text-xs text-gray-500">฿{p.price.toLocaleString()}</p>
              {p.variants && p.variants.length > 0 && (
                <p className="truncate text-[11px] text-gray-400">{p.variants.length} รส: {p.variants.join(', ')}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => toggleAvailable(p)}
              className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                p.available ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {p.available ? 'พร้อมขาย' : 'ปิดขาย'}
            </button>
            <button type="button" onClick={() => remove(p)} className="text-xs text-red-400">
              ลบ
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
