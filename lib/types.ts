export type ProductStatus = "active" | "draft" | "archived"

export interface Product {
  id: string
  name: string
  category: string
  price: number
  status: ProductStatus
  imageUrl?: string
  revenue: number
  sales: number
  createdAt: Date
  description?: string
  promoPrice?: number
  tags?: string[]
}
