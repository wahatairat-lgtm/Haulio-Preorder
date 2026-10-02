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
/** เมนูล่างแบบแคปซูลลอย */
export default function NavigationBar({ items }: { items: NavItem[] }) {
  return (
    <nav className="pointer-events-none sticky bottom-0 z-20 bg-linear-to-t from-surface via-surface/85 to-transparent px-4 pb-3 pt-8">
      <div className="pointer-events-auto flex h-16 items-center gap-1 rounded-full border border-outline-variant bg-surface-container-lowest p-1.5 shadow-e2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cx(
                'relative flex h-full flex-1 flex-col items-center justify-center gap-0.5 rounded-full transition-colors',
                isActive ? 'bg-primary text-on-primary' : 'text-on-surface-variant',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative">
                  <Icon name={item.icon} size={22} weight={isActive ? 'fill' : 'regular'} />
                  {item.badge ? <Badge count={item.badge} className="absolute -right-3 -top-1.5" /> : null}
                </span>
                <span className="text-[11px] font-medium leading-none">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
