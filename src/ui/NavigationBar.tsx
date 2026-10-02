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
    <nav className="sticky bottom-0 z-20 flex h-[68px] border-t border-outline-variant bg-surface">
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className="relative flex flex-1 flex-col items-center justify-center gap-0.5">
          {({ isActive }) => (
            <>
              {isActive && <span className="absolute inset-x-6 -top-px h-0.5 bg-primary" />}
              <span className={cx('relative', isActive ? 'text-primary' : 'text-on-surface-variant')}>
                <Icon name={item.icon} size={24} weight={isActive ? 'fill' : 'regular'} />
                {item.badge ? <Badge count={item.badge} className="absolute -right-3 -top-1.5" /> : null}
              </span>
              <span className={cx('text-[11px]', isActive ? 'font-semibold text-on-surface' : 'font-medium text-on-surface-variant')}>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
