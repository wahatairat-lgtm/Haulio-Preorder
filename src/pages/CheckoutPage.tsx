import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { cachedSettings, compressImage, fetchSettings, fileToBase64, submitOrder } from '../lib/api'
import { baht } from '../lib/format'
import { promptPayPayload } from '../lib/promptpay'
import type { BankInfo } from '../types'
import PromptPayQr from '../components/PromptPayQr'
import { Button, Card, Icon, TextArea, TextField, TopAppBar } from '../ui'

const DEFAULT_BANK: BankInfo = {
  bankName: 'กำลังโหลดข้อมูลบัญชี...',
  accountName: '-',
  accountNumber: '-',
}

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const navigate = useNavigate()
  const [bank, setBank] = useState<BankInfo>(() => cachedSettings()?.bank ?? DEFAULT_BANK)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [lineId, setLineId] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [slip, setSlip] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const qrPayload = useMemo(() => (bank.promptpay ? promptPayPayload(bank.promptpay, total) : null), [bank.promptpay, total])

  useEffect(() => {
    fetchSettings()
      .then((s) => setBank(s.bank))
      .catch(() => {})
  }, [])

  function handleFile(file: File | null) {
    setSlip(file)
    setPreview(file ? URL.createObjectURL(file) : '')
  }

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(bank.accountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard ใช้ไม่ได้ในบางเบราว์เซอร์ — ผู้ใช้ยังคัดลอกเองได้
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (![name, phone, lineId, address].every((v) => v.trim())) {
      setError('กรอกข้อมูลช่องที่มี * ให้ครบก่อนยืนยัน')
      return
    }
    if (phone.replace(/\D/g, '').length < 9) {
      setError('เบอร์โทรศัพท์ต้องมีอย่างน้อย 9 หลัก')
      return
    }
    if (!slip) {
      setError('แนบรูปสลิปโอนเงินก่อนยืนยัน')
      return
    }
    setSubmitting(true)
    try {
      setProgress('กำลังเตรียมรูปสลิป...')
      const slipBase64 = await fileToBase64(await compressImage(slip))
      setProgress('กำลังส่งออเดอร์...')

      const orderId = await submitOrder({
        items,
        total,
        customerName: name,
        customerPhone: phone,
        lineId: lineId.trim(),
        address,
        note,
        slipBase64,
        slipFileName: slip.name.replace(/\.[^.]+$/, '') + '.jpg',
      })

      clear()
      navigate(`/order/${orderId}`, { replace: true })
    } catch {
      setError('ส่งออเดอร์ไม่สำเร็จ ข้อมูลที่กรอกยังอยู่ ลองกดยืนยันอีกครั้ง')
    } finally {
      setSubmitting(false)
      setProgress('')
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <TopAppBar title="ชำระเงิน" onBack={() => navigate('/cart')} />
        <div className="flex flex-col items-center gap-3 pt-12 text-center text-sm text-on-surface-variant">
          <p>ตะกร้ายังว่างอยู่</p>
          <Button variant="outlined" className="h-10" onClick={() => navigate('/')}>
            ไปเลือกสินค้า
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopAppBar title="ชำระเงิน" onBack={() => navigate('/cart')} />

      <form className="flex flex-1 flex-col gap-4 px-4 pb-6 pt-2" onSubmit={handleSubmit}>
        <Card variant="tonal" className="space-y-1 p-4 text-sm">
          <p className="text-xs font-medium opacity-80">โอนเงินเข้าบัญชี</p>
          <p className="text-base font-semibold">{bank.bankName}</p>
          <p>ชื่อบัญชี: {bank.accountName}</p>
          <div className="flex items-center justify-between gap-2">
            <p>เลขบัญชี: <span className="font-semibold tabular-nums">{bank.accountNumber}</span></p>
            <Button variant="text" className="h-8 px-3 text-on-primary-container" onClick={copyAccount}>
              {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
            </Button>
          </div>
          {bank.promptpay && (
            <p>
              พร้อมเพย์: <span className="font-semibold tabular-nums">{bank.promptpay}</span>
            </p>
          )}
          <p className="pt-2 text-xl font-bold">ยอดที่ต้องโอน {baht(total)}</p>
        </Card>

        {qrPayload && <PromptPayQr payload={qrPayload} amount={total} accountName={bank.accountName} />}

        <TextField required autoComplete="name" label="ชื่อ-นามสกุล" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField required type="tel" inputMode="tel" autoComplete="tel" label="เบอร์โทรศัพท์" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <TextField required label="LINE ID" supporting="ใช้ติดต่อเรื่องออเดอร์และการจัดส่ง" autoCapitalize="none" autoCorrect="off" value={lineId} onChange={(e) => setLineId(e.target.value)} />
        <TextArea required label="ที่อยู่จัดส่ง" value={address} onChange={(e) => setAddress(e.target.value)} />
        <TextField label="หมายเหตุ (ไม่บังคับ)" value={note} onChange={(e) => setNote(e.target.value)} />

        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-outline p-5 text-sm text-on-surface-variant active:bg-on-surface/5">
          {preview ? (
            <img src={preview} alt="สลิปโอนเงิน" className="max-h-56 rounded-md object-contain" />
          ) : (
            <>
              <Icon name="upload" size={28} className="text-primary" />
              <span>แตะเพื่อแนบรูปสลิปโอนเงิน *</span>
            </>
          )}
          <input required type="file" accept="image/*" className="sr-only" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
        </label>

        {error && <p className="text-sm text-error">{error}</p>}

        <Button type="submit" full disabled={submitting} className="mt-auto">
          {submitting ? progress || 'กำลังส่งออเดอร์...' : `ยืนยันสั่งซื้อ ${baht(total)}`}
        </Button>
      </form>
    </div>
  )
}
