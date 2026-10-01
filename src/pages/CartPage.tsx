import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { items, setQty, removeItem, total } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm text-gray-400">ตะกร้ายังว่างอยู่</p>
        <Link to="/" className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white">
          ไปเลือกสินค้า
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="px-4 pb-2 pt-4">
        <h1 className="text-lg font-semibold text-gray-900">ตะกร้าของฉัน</h1>
      </header>

      <main className="flex-1 space-y-2 px-4 pb-4">
        {items.map((item) => (
          <div
            key={item.productId + (item.variant ?? '')}
            className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
          >
            <img src={item.imageUrl} alt={item.name} className="h-16 w-16 flex-none rounded-lg object-cover bg-gray-100" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
              {item.variant && <p className="truncate text-xs text-gray-400">รส: {item.variant}</p>}
              <p className="text-xs text-gray-500">฿{item.price.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQty(item.productId, item.qty - 1, item.variant)}
                className="h-7 w-7 rounded-full border border-gray-200 text-gray-600"
              >
                −
              </button>
              <span className="w-5 text-center text-sm">{item.qty}</span>
              <button
                type="button"
                onClick={() => setQty(item.productId, item.qty + 1, item.variant)}
                className="h-7 w-7 rounded-full border border-gray-200 text-gray-600"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.productId, item.variant)}
              className="ml-1 text-xs text-gray-400"
            >
              ลบ
            </button>
          </div>
        ))}
      </main>

      <footer className="sticky bottom-0 border-t border-gray-100 bg-white p-4">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-gray-500">ยอดรวม</span>
          <span className="text-lg font-semibold text-gray-900">฿{total.toLocaleString()}</span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="w-full rounded-xl bg-rose-500 py-3 text-sm font-semibold text-white active:scale-[0.98]"
        >
          ไปชำระเงิน
        </button>
      </footer>
    </div>
  )
}
