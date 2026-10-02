import type { InputHTMLAttributes } from 'react'
import Icon from './Icon'

/** Search bar (M3) */
export default function SearchBar(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex h-11 items-center gap-3 rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 text-on-surface-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
      <Icon name="search" size={20} />
      <input type="search" className="min-w-0 flex-1 bg-transparent text-base text-on-surface outline-none placeholder:text-on-surface-variant" {...props} />
    </label>
  )
}
