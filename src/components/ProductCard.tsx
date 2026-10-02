import { baht } from '../lib/format'
import { productImage } from '../lib/image'
import type { Product } from '../types'
import { cx, Icon, PriceSticker, ProductImage } from '../ui'

export default function ProductCard({ product, onOpen, index = 0 }: { product: Product; onOpen: (product: Product) => void; index?: number }) {
  const options = product.variants?.length ?? 0
  return (
    <article className="rise flex flex-col" style={{ ['--i' as string]: index % 8 }}>
      <button type="button" onClick={() => onOpen(product)} className="relative block w-full text-left" aria-label={product.name}>
        <ProductImage
          src={productImage(product)}
          alt={product.name}
          brand={product.brand}
          code={product.id}
          className={cx('aspect-4/5 w-full rounded-xl', !product.available && 'opacity-45 grayscale')}
        />
        {product.available ? (
          <PriceSticker className="absolute -bottom-3 right-2.5">{baht(product.price)}</PriceSticker>
        ) : (
          <span className="absolute -bottom-3 right-2.5 -rotate-6 rounded-full border-2 border-on-surface bg-surface px-3.5 py-2 text-sm font-bold text-on-surface">
            หมด
          </span>
        )}
      </button>

      <div className="mt-5 flex min-h-[3.25rem] flex-col gap-0.5 px-1">
        {product.brand && <p className="truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">{product.brand}</p>}
        <button type="button" onClick={() => onOpen(product)} className="text-left">
          <span className="line-clamp-2 text-sm leading-snug text-on-surface">{product.name}</span>
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 px-1">
        <span className="text-xs text-on-surface-variant">{options > 1 ? `${options} ตัวเลือก` : <span className="num">{product.id}</span>}</span>
        {product.available && (
          <button
            type="button"
            onClick={() => onOpen(product)}
            aria-label={`ดูรายละเอียดและเพิ่ม ${product.name}`}
            className="flex size-9 flex-none items-center justify-center rounded-full bg-secondary-container text-on-secondary-container transition-colors active:bg-primary active:text-on-primary"
          >
            <Icon name="add" size={20} weight="bold" />
          </button>
        )}
      </div>
    </article>
  )
}
