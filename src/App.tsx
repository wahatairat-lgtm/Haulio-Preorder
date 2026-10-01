import { Route, Routes } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import CartPage from './pages/CartPage'
import CatalogPage from './pages/CatalogPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import TrackOrderPage from './pages/TrackOrderPage'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:orderId" element={<OrderSuccessPage />} />
        <Route path="/track" element={<TrackOrderPage />} />
      </Routes>
      <BottomNav />
    </>
  )
}
