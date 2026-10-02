import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from './cx'
import Icon, { type IconName } from './Icon'

export type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text'

const VARIANT: Record<ButtonVariant, string> = {
  filled: 'bg-primary text-on-primary active:bg-primary/90 disabled:bg-on-surface/12 disabled:text-on-surface/38',
  tonal:
    'bg-secondary-container text-on-secondary-container active:bg-secondary-container/80 disabled:bg-on-surface/12 disabled:text-on-surface/38',
  outlined:
    'border border-on-surface/40 text-on-surface active:bg-on-surface/10 disabled:border-on-surface/12 disabled:text-on-surface/38',
  text: 'text-primary active:bg-primary/10 disabled:text-on-surface/38',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  icon?: IconName
  full?: boolean
  children: ReactNode
}

export default function Button({ variant = 'filled', icon, full, className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-sm font-semibold tracking-wide transition-colors',
        VARIANT[variant],
        full && 'w-full',
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  )
}
