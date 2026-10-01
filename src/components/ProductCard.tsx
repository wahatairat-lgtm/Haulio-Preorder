import { baht } from '../lib/format'
import type { Product } from '../types'
import { cx, IconButton, ProductImage } from '../ui'

export default function ProductCard({
  product,
  onOpen,
  onQuickAdd,
}: {
  product: Product
  onOpen: (product: Product) => void
  onQuickAdd: (product: Product) => void
}) {
  return (
    <article className="flex flex-col gap-2">
      <div className="relative">
        <button type="button" onClick={() => onOpen(product)} className="block w-full text-left" aria-label={product.name}>
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            className={cx('aspect-4/5 w-full rounded-xl', !product.available && 'opacity-50 grayscale')}
          />
        </button>
        {product.available ? (
          <IconButton
            icon="add"
            label={`เพิ่ม ${product.name} ลงตะกร้า`}
            variant="filled"
            className="absolute bottom-2 right-2 shadow-e2"
            onClick={() => onQuickAdd(product)}
          />
        ) : (
          <span className="absolute bottom-2 right-2 rounded-full bg-surface-container-lowest px-3 py-1 text-xs font-medium text-on-surface-variant">
            หมด
          </span>
        )}
      </div>
      <button type="button" onClick={() => onOpen(product)} className="px-1 text-left">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-on-surface">{product.name}</p>
        {product.brand && <p className="mt-0.5 truncate text-xs text-on-surface-variant">{product.brand}</p>}
        <p className="mt-1 text-base font-semibold text-primary">{baht(product.price)}</p>
      </button>
    </article>
  )
}
