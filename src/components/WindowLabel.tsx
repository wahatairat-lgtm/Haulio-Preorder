import { formatDay, parseWindow, roundStatus } from '../lib/window'
import { cx, Icon } from '../ui'

const STAMP = {
  open: 'เปิดรับ',
  upcoming: 'เร็วๆ นี้',
  closed: 'ปิดรับแล้ว',
} as const

/** ป้ายรอบพรีออเดอร์ — หน้าตาเป็นใบปะหน้าพัสดุ บอกว่ารอบนี้ปิดเมื่อไหร่ เหลืออีกกี่วัน จัดส่งวันไหน */
export default function WindowLabel({ country, openRange, shipDate }: { country: string; openRange: string; shipDate: string }) {
  const win = parseWindow(openRange, shipDate)
  const status = win ? roundStatus(win) : null

  return (
    <section className="relative -rotate-[0.6deg] rounded-lg border border-outline-variant bg-surface-container-lowest shadow-e2" aria-label={`รอบพรีออเดอร์${country}`}>
      <span className="absolute -top-2.5 left-6 h-5 w-14 -rotate-3 rounded-sm bg-secondary-container/90" aria-hidden="true" />
      <span className="absolute -top-2.5 right-6 h-5 w-14 rotate-3 rounded-sm bg-secondary-container/90" aria-hidden="true" />
      <div className="flex items-start justify-between gap-3 px-4 pt-3">
        <p className="text-xs font-medium text-on-surface-variant">รอบพรีออเดอร์ · {country}</p>
        {status && (
          <span
            className={cx(
              '-rotate-3 rounded-md border-2 px-2 py-0.5 text-xs font-bold leading-tight',
              status.state === 'closed' ? 'border-outline text-outline' : 'border-primary text-primary',
            )}
          >
            {STAMP[status.state]}
          </span>
        )}
      </div>

      {win && status ? (
        <div className="px-4 pb-3 pt-1">
          <p className="text-[28px] font-semibold leading-tight text-on-surface">
            {status.state === 'open' &&
              (status.daysLeft === 0 ? (
                <>ปิดรับวันนี้</>
              ) : status.daysLeft === 1 ? (
                <>ปิดรับพรุ่งนี้</>
              ) : (
                <>
                  ปิดรับในอีก <span className="num">{status.daysLeft}</span> วัน
                </>
              ))}
            {status.state === 'upcoming' && <>เปิดรับวันที่ {formatDay(win.start)}</>}
            {status.state === 'closed' && <>ปิดรับแล้ว รอรอบถัดไป</>}
          </p>

          <div className="num mt-3 flex items-center gap-2 text-xs text-on-surface-variant">
            <span>{formatDay(win.start)}</span>
            <div className="relative h-1 flex-1 bg-outline-variant" role="img" aria-label={`ผ่านไป ${Math.round(status.progress * 100)}% ของรอบ`}>
              <div className="absolute inset-y-0 left-0 bg-primary" style={{ width: `${status.progress * 100}%` }} />
              <span
                className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 border-2 border-primary bg-surface-container-lowest"
                style={{ left: `${status.progress * 100}%` }}
              />
            </div>
            <span className="font-semibold text-on-surface">ปิดรับ {formatDay(win.end)}</span>
          </div>
        </div>
      ) : (
        <p className="px-4 pb-3 pt-1 text-xl font-semibold text-on-surface">เปิดรับ {openRange || '-'}</p>
      )}

      {/* รอยปรุแบบตั๋ว */}
      <div className="relative border-t border-dashed border-outline-variant">
        <span className="absolute -left-2 -top-2 size-4 rounded-full border border-outline-variant bg-surface" aria-hidden="true" />
        <span className="absolute -right-2 -top-2 size-4 rounded-full border border-outline-variant bg-surface" aria-hidden="true" />
      </div>
      <div className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface-variant">
        <Icon name="truck" size={18} className="text-primary" />
        <span>จัดส่ง</span>
        <span className="num font-semibold text-on-surface">{shipDate || '-'}</span>
      </div>
    </section>
  )
}
