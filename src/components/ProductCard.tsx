import type { Product } from '../types'

export default function ProductCard({
  product,
  onAdd,
}: {
  product: Product
  onAdd: (product: Product) => void
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-20 w-20 flex-none rounded-lg object-cover bg-gray-100"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <p className="truncate text-sm font-medium text-gray-900">{product.name}</p>
          {product.description && (
            <p className="line-clamp-2 text-xs text-gray-500">{product.description}</p>
          )}
          {product.deadline && (
            <p className="mt-0.5 text-[11px] text-rose-500">ปิดรับออเดอร์ {product.deadline}</p>
          )}
        </div>
        <div className="flex items-end justify-between">
          <span className="text-sm font-semibold text-gray-900">฿{product.price.toLocaleString()}</span>
          <button
            type="button"
            disabled={!product.available}
            onClick={() => onAdd(product)}
            className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white active:scale-95 disabled:bg-gray-300"
          >
            {product.available ? '+ เพิ่ม' : 'หมด'}
          </button>
        </div>
      </div>
    </div>
  )
}
