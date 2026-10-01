import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const TABS = [
  { to: '/', label: 'หน้าแรก', icon: '🏠' },
  { to: '/cart', label: 'ตะกร้า', icon: '🛒' },
  { to: '/track', label: 'เช็คสถานะ', icon: '📦' },
]

export default function BottomNav() {
  const { count } = useCart()
  return (
    <nav className="sticky bottom-0 z-10 flex border-t border-gray-100 bg-white/95 backdrop-blur">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
              isActive ? 'text-rose-500' : 'text-gray-400'
            }`
          }
        >
          <span className="text-lg leading-none">{tab.icon}</span>
          {tab.label}
          {tab.to === '/cart' && count > 0 && (
            <span className="absolute right-6 top-1 rounded-full bg-rose-500 px-1.5 text-[10px] font-medium text-white">
              {count}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
