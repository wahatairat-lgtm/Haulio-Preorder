import { Route, Routes } from 'react-router-dom'
import { useCart } from './context/CartContext'
import CartPage from './pages/CartPage'
import CatalogPage from './pages/CatalogPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import TrackOrderPage from './pages/TrackOrderPage'
import UiKitPage from './pages/UiKitPage'
import { NavigationBar } from './ui'

export default function App() {
  const { count } = useCart()
  return (
    <>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:orderId" element={<OrderSuccessPage />} />
        <Route path="/track" element={<TrackOrderPage />} />
        <Route path="/ui" element={<UiKitPage />} />
      </Routes>
      <NavigationBar
        items={[
          { to: '/', label: 'หน้าแรก', icon: 'home', end: true },
          { to: '/cart', label: 'ตะกร้า', icon: 'bag', badge: count },
          { to: '/track', label: 'เช็คสถานะ', icon: 'truck' },
        ]}
      />
    </>
  )
}
