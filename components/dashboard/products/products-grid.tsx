"use client"

import { MOCK_PRODUCTS } from "@/lib/constants"
import type { Product } from "@/lib/types"
import { ProductCard } from "./product-card"

interface ProductsGridProps {
  onEditProduct: (product: Product) => void
}

export function ProductsGrid({ onEditProduct }: ProductsGridProps) {
  const products = MOCK_PRODUCTS

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onEdit={onEditProduct} />
      ))}
    </div>
  )
}
