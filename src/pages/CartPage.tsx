import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { baht } from '../lib/format'
import { Button, Card, Icon, IconButton, ProductImage, QuantityStepper, TopAppBar } from '../ui'

export default function CartPage() {
  const { items, setQty, removeItem, total, count } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <TopAppBar title="ตะกร้าของฉัน" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="flex size-16 items-center justify-center border border-dashed border-outline text-on-surface-variant">
            <Icon name="bag" size={30} />
          </span>
          <p className="text-sm text-on-surface-variant">ตะกร้ายังว่างอยู่<br />เลือกสินค้าที่ชอบ แล้วกลับมาชำระเงินที่นี่</p>
          <Link to="/">
            <Button>ไปเลือกสินค้า</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopAppBar title="ตะกร้าของฉัน" />

      <main className="flex-1 space-y-3 px-4 pb-4 pt-2">
        {items.map((item) => (
          <Card key={item.productId + (item.variant ?? '')} className="flex gap-3 p-3">
            <ProductImage src={item.imageUrl} alt={item.name} code={item.productId} className="h-24 w-20 flex-none rounded-md border border-outline-variant" />
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div className="flex items-start gap-1">
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium leading-snug text-on-surface">{item.name}</p>
                  {item.variant && <p className="mt-0.5 truncate text-xs text-on-surface-variant">ตัวเลือก: {item.variant}</p>}
                </div>
                <IconButton
                  size="sm"
                  icon="delete"
                  label={`ลบ ${item.name}`}
                  className="text-error"
                  onClick={() => removeItem(item.productId, item.variant)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="num text-base font-semibold text-on-surface">{baht(item.price)}</span>
                <QuantityStepper value={item.qty} onChange={(n) => setQty(item.productId, n, item.variant)} />
              </div>
            </div>
          </Card>
        ))}

        <Card variant="filled" className="space-y-2 p-4 text-sm">
          <div className="flex justify-between text-on-surface-variant">
            <span>จำนวนสินค้า</span>
            <span>{count} ชิ้น</span>
          </div>
          <div className="flex items-baseline justify-between border-t border-outline-variant pt-2">
            <span className="font-medium text-on-surface">ยอดรวม</span>
            <span className="num text-xl font-semibold text-on-surface">{baht(total)}</span>
          </div>
        </Card>
      </main>

      <footer className="sticky bottom-[88px] z-10 bg-surface px-4 pb-3 pt-2">
        <Button full onClick={() => navigate('/checkout')}>
          ไปชำระเงิน
        </Button>
      </footer>
    </div>
  )
}
