import { NavLink } from 'react-router-dom'
import Badge from './Badge'
import { cx } from './cx'
import Icon, { type IconName } from './Icon'

export interface NavItem {
  to: string
  label: string
  icon: IconName
  badge?: number
  end?: boolean
}

/** Navigation bar (M3) — active indicator เป็นแคปซูลสี secondary-container */
export default function NavigationBar({ items }: { items: NavItem[] }) {
  return (
    <nav className="sticky bottom-0 z-20 flex h-20 items-start border-t border-outline-variant/60 bg-surface-container-lowest px-2 pt-3">
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className="flex flex-1 flex-col items-center gap-1">
          {({ isActive }) => (
            <>
              <span
                className={cx(
                  'relative flex h-8 w-16 items-center justify-center rounded-full transition-colors',
                  isActive ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant',
                )}
              >
                <Icon name={item.icon} />
                {item.badge ? <Badge count={item.badge} className="absolute right-3 top-0" /> : null}
              </span>
              <span className={cx('text-xs', isActive ? 'font-semibold text-on-surface' : 'font-medium text-on-surface-variant')}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
