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
  // สินค้าที่มีหลายรส/ตัวเลือก: ไม่เลือกให้อัตโนมัติ กันสั่งผิดรส
  const [variant, setVariant] = useState<string | undefined>(product.variants?.length === 1 ? product.variants[0] : undefined)
  const needsChoice = Boolean(product.variants?.length) && !variant
  const [qty, setQty] = useState(1)

  return (
    <div className="px-4 pb-6 pt-2">
      <div className="relative">
        <ProductImage src={productImage(product)} alt={product.name} brand={product.brand} code={product.id} className="aspect-square w-full rounded-md border border-outline-variant" />
        <IconButton icon="close" label="ปิด" variant="tonal" className="absolute right-2 top-2" onClick={onClose} />
      </div>

      <div className="mt-4">
        <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-on-surface-variant">
          <span className="num font-mono">{product.id}</span>
          {product.brand && <span>· {product.brand}</span>}
        </p>
        <h2 className="text-lg font-semibold leading-snug text-on-surface">{product.name}</h2>
        <p className="num mt-1 text-2xl font-semibold text-on-surface">{baht(product.price)}</p>
        {product.deadline && <p className="mt-1 text-xs text-on-surface-variant">ปิดรับออเดอร์ {product.deadline}</p>}
        {product.description && <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{product.description}</p>}
      </div>

      {product.variants && product.variants.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-on-surface">
            ตัวเลือก <span className="text-error">*</span>
          </p>
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
        <Button full icon="bag" disabled={!product.available || needsChoice} onClick={() => onAdd(product, variant, qty)}>
          {!product.available ? 'สินค้าหมด' : needsChoice ? 'เลือกตัวเลือกก่อน' : `เพิ่มลงตะกร้า ${baht(product.price * qty)}`}
        </Button>
      </div>
    </div>
  )
}
