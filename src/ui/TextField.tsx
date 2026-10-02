import { useId, type FormEvent, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cx } from './cx'

const BASE =
  'peer w-full rounded-sm border border-outline bg-transparent px-4 text-base text-on-surface outline-none transition-colors placeholder-transparent focus:border-2 focus:border-primary'
const LABEL =
  'pointer-events-none absolute left-3 origin-left bg-surface px-1 text-on-surface-variant transition-all ' +
  'peer-focus:-translate-y-[1.6rem] peer-focus:text-xs peer-focus:text-primary ' +
  'peer-[:not(:placeholder-shown)]:-translate-y-[1.6rem] peer-[:not(:placeholder-shown)]:text-xs'

type Common = { label: string; supporting?: string }

/** ข้อความเตือนช่องที่ยังไม่กรอกเป็นภาษาไทย (เบราว์เซอร์ใช้ภาษาเครื่อง) */
const requiredMessage = (label: string) => ({
  onInvalid: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    e.currentTarget.setCustomValidity(e.currentTarget.validity.valueMissing ? `กรอก${label}` : `${label}ไม่ถูกต้อง`),
  onInput: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => e.currentTarget.setCustomValidity(''),
})

/** Outlined text field (M3) พร้อม floating label */
export function TextField({ label, supporting, className, ...rest }: Common & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <div className={className}>
      <div className="relative flex items-center pt-2">
        <input id={id} placeholder=" " className={cx(BASE, 'h-14 py-0')} {...requiredMessage(label)} {...rest} />
        <label htmlFor={id} className={cx(LABEL, 'top-[1.65rem] text-base')}>
          {label}
          {rest.required && <span className="text-error"> *</span>}
        </label>
      </div>
      {supporting && <p className="mt-1 px-4 text-xs text-on-surface-variant">{supporting}</p>}
    </div>
  )
}

export function TextArea({ label, supporting, className, ...rest }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <div className={className}>
      <div className="relative flex items-start pt-2">
        <textarea id={id} placeholder=" " rows={3} className={cx(BASE, 'resize-none py-4')} {...requiredMessage(label)} {...rest} />
        <label htmlFor={id} className={cx(LABEL, 'top-[1.65rem] text-base')}>
          {label}
          {rest.required && <span className="text-error"> *</span>}
        </label>
      </div>
      {supporting && <p className="mt-1 px-4 text-xs text-on-surface-variant">{supporting}</p>}
    </div>
  )
}
