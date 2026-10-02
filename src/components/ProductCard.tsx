import { baht } from '../lib/format'
import { productImage } from '../lib/image'
import type { Product } from '../types'
import { cx, Icon, ProductImage } from '../ui'

export default function ProductCard({ product, onOpen, index = 0 }: { product: Product; onOpen: (product: Product) => void; index?: number }) {
  const options = product.variants?.length ?? 0
  return (
    <article className="rise flex flex-col gap-2.5" style={{ ['--i' as string]: index % 8 }}>
      <button type="button" onClick={() => onOpen(product)} className="relative block w-full text-left" aria-label={product.name}>
        <ProductImage
          src={productImage(product)}
          alt={product.name}
          brand={product.brand}
          code={product.id}
          className={cx('aspect-4/5 w-full rounded-md border border-outline-variant', !product.available && 'opacity-45 grayscale')}
        />
        {!product.available && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-6 border-2 border-on-surface bg-surface px-2.5 py-0.5 text-sm font-bold text-on-surface">
            หมด
          </span>
        )}
      </button>

      <div className="flex min-h-[2.75rem] flex-col gap-0.5 px-0.5">
        {product.brand && <p className="truncate text-[11px] font-medium uppercase tracking-[0.1em] text-on-surface-variant">{product.brand}</p>}
        <button type="button" onClick={() => onOpen(product)} className="text-left">
          <span className="line-clamp-2 text-sm leading-snug text-on-surface">{product.name}</span>
        </button>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 px-0.5">
        <div className="min-w-0">
          <p className="num text-base font-semibold text-on-surface">{baht(product.price)}</p>
          {options > 1 && <p className="text-[11px] text-on-surface-variant">{options} ตัวเลือก</p>}
        </div>
        {product.available && (
          <button
            type="button"
            onClick={() => onOpen(product)}
            aria-label={`ดูรายละเอียดและเพิ่ม ${product.name}`}
            className="flex size-9 flex-none items-center justify-center rounded-md border border-on-surface/40 text-on-surface transition-colors active:bg-primary active:text-on-primary"
          >
            <Icon name="add" size={20} />
          </button>
        )}
      </div>
    </article>
  )
}
