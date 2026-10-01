import type { InputHTMLAttributes } from 'react'
import Icon from './Icon'

/** Search bar (M3) */
export default function SearchBar(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex h-12 items-center gap-3 rounded-full bg-surface-container-high px-4 text-on-surface-variant focus-within:ring-2 focus-within:ring-primary">
      <Icon name="search" />
      <input type="search" className="min-w-0 flex-1 bg-transparent text-base text-on-surface outline-none placeholder:text-on-surface-variant" {...props} />
    </label>
  )
}
