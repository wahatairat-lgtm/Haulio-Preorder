import { QRCodeCanvas } from 'qrcode.react'
import { useEffect, useRef, useState } from 'react'
import { baht } from '../lib/format'
import { Button, Card } from '../ui'

const FONT = "'IBM Plex Sans Thai', 'IBM Plex Mono', sans-serif"

/** วาด QR + ยอด + ชื่อบัญชี ลงรูปเดียว เพื่อให้เซฟเก็บไว้สแกนจากแกลเลอรีได้ */
function compose(qr: HTMLCanvasElement, amount: number, name: string): string {
  const w = 720
  const h = 960
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')!
  g.fillStyle = '#ffffff'
  g.fillRect(0, 0, w, h)
  g.textAlign = 'center'

  g.fillStyle = '#550017'
  g.font = `700 44px ${FONT}`
  g.fillText('HAULIO Pre-order', w / 2, 90)
  g.fillStyle = '#524344'
  g.font = `500 30px ${FONT}`
  g.fillText('สแกนจ่ายผ่านพร้อมเพย์', w / 2, 142)

  g.drawImage(qr, 80, 190, 560, 560)

  g.fillStyle = '#550017'
  g.font = `700 76px ${FONT}`
  g.fillText(baht(amount), w / 2, 850)
  g.fillStyle = '#524344'
  g.font = `500 28px ${FONT}`
  g.fillText(name, w / 2, 905)
  return c.toDataURL('image/png')
}

export default function PromptPayQr({ payload, amount, accountName }: { payload: string; amount: number; accountName: string }) {
  const qrRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await document.fonts.load(`700 44px 'IBM Plex Sans Thai'`, 'สแกน')
        await document.fonts.load(`500 28px 'IBM Plex Sans Thai'`, 'สแกน')
      } catch {
        // ใช้ฟอนต์สำรอง
      }
      if (!cancelled && qrRef.current) setImage(compose(qrRef.current, amount, accountName))
    })()
    return () => {
      cancelled = true
    }
  }, [payload, amount, accountName])

  async function save() {
    const blob = await (await fetch(image)).blob()
    const file = new File([blob], `haulio-promptpay-${amount}.png`, { type: 'image/png' })
    // มือถือ: เปิดแผ่นแชร์ให้เลือก "บันทึกรูปภาพ" ได้เลย
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'QR พร้อมเพย์ Haulio' })
        return
      } catch (e) {
        if ((e as DOMException).name === 'AbortError') return
      }
    }
    const a = document.createElement('a')
    a.href = image
    a.download = file.name
    a.click()
  }

  return (
    <Card className="flex flex-col items-center gap-3 p-4">
      <QRCodeCanvas ref={qrRef} value={payload} size={560} level="M" marginSize={0} style={{ display: 'none' }} />
      {image ? (
        <img src={image} alt={`QR พร้อมเพย์ ${baht(amount)}`} className="w-full max-w-64 rounded-md border border-outline-variant" />
      ) : (
        <div className="aspect-3/4 w-full max-w-64 animate-pulse rounded-md bg-surface-container-high" />
      )}
      <Button variant="tonal" icon="download" full disabled={!image} onClick={save}>
        บันทึก QR
      </Button>
      <p className="text-center text-xs text-on-surface-variant">
        ยอดถูกใส่ใน QR แล้ว กดค้างที่รูปก็บันทึกได้ ตรวจชื่อผู้รับให้ตรงกับ {accountName} ก่อนยืนยันโอน
      </p>
    </Card>
  )
}
