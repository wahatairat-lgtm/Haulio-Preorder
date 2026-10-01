import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const TABS = [
  { to: '/admin/orders', label: 'ออเดอร์' },
  { to: '/admin/products', label: 'สินค้า' },
  { to: '/admin/settings', label: 'บัญชีธนาคาร' },
]

export default function AdminLayout() {
  const { user, loading, logout } = useAuth()
  const location = useLocation()

  if (loading) {
    return <p className="flex-1 pt-10 text-center text-sm text-gray-400">กำลังตรวจสอบสิทธิ์...</p>
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-4 pb-2 pt-4">
        <h1 className="text-lg font-semibold text-gray-900">Admin</h1>
        <button type="button" onClick={() => logout()} className="text-xs text-gray-400">
          ออกจากระบบ
        </button>
      </header>
      <nav className="flex gap-1 px-4 pb-2 text-sm font-medium">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `rounded-full px-3 py-1.5 ${isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <main className="flex-1 overflow-y-auto px-4 pb-4">
        <Outlet />
      </main>
    </div>
  )
}
