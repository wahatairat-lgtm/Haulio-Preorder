import type { ButtonHTMLAttributes } from 'react'
import { cx } from './cx'
import Icon, { type IconName } from './Icon'

export type IconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined'

const VARIANT: Record<IconButtonVariant, string> = {
  standard: 'text-on-surface-variant active:bg-on-surface/10',
  filled: 'bg-primary text-on-primary active:bg-primary/90',
  tonal: 'bg-secondary-container text-on-secondary-container active:bg-secondary-container/80',
  outlined: 'border border-outline text-on-surface-variant active:bg-on-surface/10',
}

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName
  label: string
  variant?: IconButtonVariant
  size?: 'sm' | 'md'
}

export default function IconButton({ icon, label, variant = 'standard', size = 'md', className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cx(
        'inline-flex flex-none items-center justify-center rounded-full transition-colors disabled:opacity-40',
        size === 'md' ? 'h-10 w-10' : 'h-8 w-8',
        VARIANT[variant],
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={size === 'md' ? 24 : 18} />
    </button>
  )
}
