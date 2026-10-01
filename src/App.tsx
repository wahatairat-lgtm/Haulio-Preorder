import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'
import AdminSettings from './pages/admin/AdminSettings'
import CartPage from './pages/CartPage'
import CatalogPage from './pages/CatalogPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import TrackOrderPage from './pages/TrackOrderPage'

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:orderId" element={<OrderSuccessPage />} />
        <Route path="/track" element={<TrackOrderPage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/orders" replace />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      {!isAdmin && <BottomNav />}
    </>
  )
}
