import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { db, storage } from '../firebase'
import type { BankInfo } from '../types'

const DEFAULT_BANK: BankInfo = {
  bankName: 'ยังไม่ได้ตั้งค่าบัญชีธนาคาร',
  accountName: '-',
  accountNumber: '-',
}

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const navigate = useNavigate()
  const [bank, setBank] = useState<BankInfo>(DEFAULT_BANK)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [slip, setSlip] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getDoc(doc(db, 'settings', 'bank')).then((snap) => {
      if (snap.exists()) setBank(snap.data() as BankInfo)
    })
  }, [])

  function handleFile(file: File | null) {
    setSlip(file)
    setPreview(file ? URL.createObjectURL(file) : '')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!slip) {
      setError('กรุณาแนบรูปสลิปโอนเงิน')
      return
    }
    setSubmitting(true)
    try {
      const slipRef = ref(storage, `slips/${Date.now()}_${slip.name}`)
      await uploadBytes(slipRef, slip)
      const slipUrl = await getDownloadURL(slipRef)

      const orderDoc = await addDoc(collection(db, 'orders'), {
        items,
        total,
        customerName: name,
        customerPhone: phone,
        address,
        note,
        slipUrl,
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        createdAtServer: serverTimestamp(),
      })

      clear()
      navigate(`/order/${orderDoc.id}`, { replace: true })
    } catch {
      setError('ส่งคำสั่งซื้อไม่สำเร็จ ลองใหม่อีกครั้ง')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return <p className="flex-1 pt-10 text-center text-sm text-gray-400">ไม่มีสินค้าในตะกร้า</p>
  }

  return (
    <div className="flex flex-1 flex-col px-4 pb-6 pt-4">
      <h1 className="mb-3 text-lg font-semibold text-gray-900">ชำระเงิน</h1>

      <section className="mb-4 rounded-xl bg-gray-50 p-3 text-sm">
        <p className="mb-1 font-medium text-gray-900">โอนเงินเข้าบัญชี</p>
        <p className="text-gray-600">{bank.bankName}</p>
        <p className="text-gray-600">ชื่อบัญชี: {bank.accountName}</p>
        <p className="text-gray-600">เลขบัญชี: {bank.accountNumber}</p>
        {bank.promptpay && <p className="text-gray-600">พร้อมเพย์: {bank.promptpay}</p>}
        <p className="mt-2 text-base font-semibold text-rose-500">ยอดที่ต้องโอน ฿{total.toLocaleString()}</p>
      </section>

      <form className="flex flex-1 flex-col gap-3" onSubmit={handleSubmit}>
        <input
          required
          placeholder="ชื่อ-นามสกุล"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="เบอร์โทรศัพท์"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <textarea
          required
          placeholder="ที่อยู่จัดส่ง"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <input
          placeholder="หมายเหตุ (ถ้ามี)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />

        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
          {preview ? (
            <img src={preview} alt="สลิปโอนเงิน" className="max-h-48 rounded-lg object-contain" />
          ) : (
            <span>แตะเพื่อแนบรูปสลิปโอนเงิน</span>
          )}
          <input
            required
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-auto w-full rounded-xl bg-rose-500 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? 'กำลังส่งคำสั่งซื้อ...' : 'ยืนยันการสั่งซื้อ'}
        </button>
      </form>
    </div>
  )
}
