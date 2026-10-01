import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useEffect, useState, type FormEvent } from 'react'
import { db } from '../../firebase'
import type { BankInfo } from '../../types'

export default function AdminSettings() {
  const [form, setForm] = useState<BankInfo>({ bankName: '', accountName: '', accountNumber: '', promptpay: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getDoc(doc(db, 'settings', 'bank')).then((snap) => {
      if (snap.exists()) setForm(snap.data() as BankInfo)
    })
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await setDoc(doc(db, 'settings', 'bank'), form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-gray-500">ข้อมูลบัญชีนี้จะแสดงให้ลูกค้าเห็นตอนชำระเงิน</p>
      <input
        required
        placeholder="ชื่อธนาคาร"
        value={form.bankName}
        onChange={(e) => setForm({ ...form, bankName: e.target.value })}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
      />
      <input
        required
        placeholder="ชื่อบัญชี"
        value={form.accountName}
        onChange={(e) => setForm({ ...form, accountName: e.target.value })}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
      />
      <input
        required
        placeholder="เลขบัญชี"
        value={form.accountNumber}
        onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
      />
      <input
        placeholder="พร้อมเพย์ (ถ้ามี)"
        value={form.promptpay}
        onChange={(e) => setForm({ ...form, promptpay: e.target.value })}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
      />
      <button type="submit" className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white">
        {saved ? 'บันทึกแล้ว ✓' : 'บันทึก'}
      </button>
    </form>
  )
}
