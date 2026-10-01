import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useEffect, useState, type FormEvent } from 'react'
import { db } from '../../firebase'
import type { BankInfo, Schedule } from '../../types'

const DEFAULT_SCHEDULE: Schedule = {
  kr: { openRange: '13-17 ต.ค. 69', shipDate: '19 ต.ค. 69' },
  jp: { openRange: '25 ธ.ค. 69 - 3 ม.ค. 70', shipDate: '5 ม.ค. 70' },
}

export default function AdminSettings() {
  const [bankForm, setBankForm] = useState<BankInfo>({
    bankName: '',
    accountName: '',
    accountNumber: '',
    promptpay: '',
  })
  const [bankSaved, setBankSaved] = useState(false)

  const [schedule, setSchedule] = useState<Schedule>(DEFAULT_SCHEDULE)
  const [scheduleSaved, setScheduleSaved] = useState(false)

  useEffect(() => {
    getDoc(doc(db, 'settings', 'bank')).then((snap) => {
      if (snap.exists()) setBankForm(snap.data() as BankInfo)
    })
    getDoc(doc(db, 'settings', 'schedule')).then((snap) => {
      if (snap.exists()) setSchedule(snap.data() as Schedule)
    })
  }, [])

  async function handleBankSubmit(e: FormEvent) {
    e.preventDefault()
    await setDoc(doc(db, 'settings', 'bank'), bankForm)
    setBankSaved(true)
    setTimeout(() => setBankSaved(false), 2000)
  }

  async function handleScheduleSubmit(e: FormEvent) {
    e.preventDefault()
    await setDoc(doc(db, 'settings', 'schedule'), schedule)
    setScheduleSaved(true)
    setTimeout(() => setScheduleSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleBankSubmit} className="space-y-3">
        <p className="text-sm text-gray-500">ข้อมูลบัญชีนี้จะแสดงให้ลูกค้าเห็นตอนชำระเงิน</p>
        <input
          required
          placeholder="ชื่อธนาคาร"
          value={bankForm.bankName}
          onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="ชื่อบัญชี"
          value={bankForm.accountName}
          onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="เลขบัญชี"
          value={bankForm.accountNumber}
          onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <input
          placeholder="พร้อมเพย์ (ถ้ามี)"
          value={bankForm.promptpay}
          onChange={(e) => setBankForm({ ...bankForm, promptpay: e.target.value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <button type="submit" className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white">
          {bankSaved ? 'บันทึกแล้ว ✓' : 'บันทึกบัญชีธนาคาร'}
        </button>
      </form>

      <form onSubmit={handleScheduleSubmit} className="space-y-3 border-t border-gray-100 pt-5">
        <p className="text-sm text-gray-500">รอบพรีออเดอร์ที่แสดงให้ลูกค้าเห็นแต่ละหมวด</p>

        <div className="space-y-2 rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-medium text-gray-700">🇰🇷 เกาหลี</p>
          <input
            placeholder="ช่วงเปิดรับออเดอร์ เช่น 13-17 ต.ค. 69"
            value={schedule.kr.openRange}
            onChange={(e) => setSchedule({ ...schedule, kr: { ...schedule.kr, openRange: e.target.value } })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            placeholder="วันที่จัดส่ง เช่น 19 ต.ค. 69"
            value={schedule.kr.shipDate}
            onChange={(e) => setSchedule({ ...schedule, kr: { ...schedule.kr, shipDate: e.target.value } })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2 rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-medium text-gray-700">🇯🇵 ญี่ปุ่น</p>
          <input
            placeholder="ช่วงเปิดรับออเดอร์"
            value={schedule.jp.openRange}
            onChange={(e) => setSchedule({ ...schedule, jp: { ...schedule.jp, openRange: e.target.value } })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            placeholder="วันที่จัดส่ง"
            value={schedule.jp.shipDate}
            onChange={(e) => setSchedule({ ...schedule, jp: { ...schedule.jp, shipDate: e.target.value } })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <button type="submit" className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white">
          {scheduleSaved ? 'บันทึกแล้ว ✓' : 'บันทึกรอบพรีออเดอร์'}
        </button>
      </form>
    </div>
  )
}
