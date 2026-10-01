import { useState } from 'react'
import { baht } from '../lib/format'
import { productImage } from '../lib/image'
import type { Product } from '../types'
import { BottomSheet, Button, Chip, IconButton, ProductImage, QuantityStepper } from '../ui'

export default function ProductSheet({
  product,
  onClose,
  onAdd,
}: {
  product: Product | null
  onClose: () => void
  onAdd: (product: Product, variant: string | undefined, qty: number) => void
}) {
  return (
    <BottomSheet open={Boolean(product)} onClose={onClose}>
      {product && <SheetBody key={product.id} product={product} onClose={onClose} onAdd={onAdd} />}
    </BottomSheet>
  )
}

function SheetBody({
  product,
  onClose,
  onAdd,
}: {
  product: Product
  onClose: () => void
  onAdd: (product: Product, variant: string | undefined, qty: number) => void
}) {
  const [variant, setVariant] = useState(product.variants?.[0])
  const [qty, setQty] = useState(1)

  return (
    <div className="px-4 pb-6 pt-2">
      <div className="relative">
        <ProductImage src={productImage(product)} alt={product.name} className="aspect-square w-full rounded-xl" />
        <IconButton icon="close" label="ปิด" variant="tonal" className="absolute right-2 top-2" onClick={onClose} />
      </div>

      <div className="mt-4">
        {product.brand && <p className="text-xs font-medium text-on-surface-variant">{product.brand}</p>}
        <h2 className="text-lg font-semibold leading-snug text-on-surface">{product.name}</h2>
        <p className="mt-1 text-xl font-bold text-primary">{baht(product.price)}</p>
        {product.deadline && <p className="mt-1 text-xs text-on-surface-variant">ปิดรับออเดอร์ {product.deadline}</p>}
        {product.description && <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{product.description}</p>}
      </div>

      {product.variants && product.variants.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-on-surface">ตัวเลือก</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <Chip key={v} selected={v === variant} onClick={() => setVariant(v)}>
                {v}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <QuantityStepper value={qty} onChange={(n) => setQty(Math.max(1, n))} />
        <Button full icon="bag" disabled={!product.available} onClick={() => onAdd(product, variant, qty)}>
          {product.available ? `เพิ่มลงตะกร้า ${baht(product.price * qty)}` : 'สินค้าหมด'}
        </Button>
      </div>
    </div>
  )
}
