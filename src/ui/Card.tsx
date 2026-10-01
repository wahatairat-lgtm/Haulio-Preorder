import type { HTMLAttributes } from 'react'
import { cx } from './cx'

export type CardVariant = 'filled' | 'tonal' | 'elevated' | 'outlined'

const VARIANT: Record<CardVariant, string> = {
  filled: 'bg-surface-container-highest',
  tonal: 'bg-primary-container text-on-primary-container',
  elevated: 'bg-surface-container-low shadow-e1',
  outlined: 'bg-surface-container-lowest border border-outline-variant',
}

export default function Card({ variant = 'outlined', className, ...rest }: HTMLAttributes<HTMLDivElement> & { variant?: CardVariant }) {
  return <div className={cx('rounded-lg', VARIANT[variant], className)} {...rest} />
}
