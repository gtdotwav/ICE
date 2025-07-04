"use client"

import * as React from "react"
import { ProductFormSidebar } from "@/components/dashboard/products/product-form-sidebar"
import { ProductsGrid } from "@/components/dashboard/products/products-grid"
import { ProductsHeader } from "@/components/dashboard/products/products-header"
import { ProductsToolbar } from "@/components/dashboard/products/products-toolbar"
import { StatsCards } from "@/components/dashboard/products/stats-cards"
import type { Product } from "@/lib/types"

export default function ProductsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)

  const handleNewProduct = () => {
    setSelectedProduct(null)
    setIsSidebarOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsSidebarOpen(true)
  }

  return (
    <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
      <ProductsHeader onNewProduct={handleNewProduct} />
      <StatsCards />
      <div className="space-y-6">
        <ProductsToolbar />
        <ProductsGrid onEditProduct={handleEditProduct} />
      </div>
      <ProductFormSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} product={selectedProduct} />
    </div>
  )
}
