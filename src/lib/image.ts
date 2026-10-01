const BASE = import.meta.env.BASE_URL

/**
 * รูปสินค้า: ใช้ imageUrl จาก Sheet ถ้ามี (ลิงก์เต็ม หรือ path เช่น products/C01.jpg)
 * ถ้าว่าง ใช้ public/products/<id>.jpg — ถ้าไม่มีไฟล์ ProductImage จะแสดงช่องแทน
 */
export function productImage(product: { id: string; imageUrl?: string }): string {
  const url = product.imageUrl?.trim()
  if (!url) return `${BASE}products/${product.id}.jpg`
  return /^(https?:|data:|\/)/.test(url) ? url : BASE + url
}
