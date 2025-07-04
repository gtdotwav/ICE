"use client"

import * as React from "react"
import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"

interface ProductsGridProps {
  onEditProduct: (product: Product) => void
}

/**
 * Demo data.
 * In a real app you will load these from your backend.
 */
const DEMO_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Curso Avançado de Next.js 15",
    category: "Cursos",
    price: 297,
    status: "active",
    imageUrl: "/nextjs-course.png",
    revenue: 12000,
    sales: 50,
    createdAt: new Date(),
    description: "Domine o App Router, Server Components e IA Edge.",
  },
  {
    id: "2",
    name: "E-book Tailwind CSS",
    category: "E-books",
    price: 97,
    status: "active",
    imageUrl: "/tailwind-css-ebook.png",
    revenue: 7400,
    sales: 76,
    createdAt: new Date(),
    description: "Do zero ao design responsivo sem sair do HTML.",
  },
  {
    id: "3",
    name: "Sales Masterclass",
    category: "Webinar",
    price: 497,
    status: "draft",
    imageUrl: "/sales-masterclass.png",
    revenue: 0,
    sales: 0,
    createdAt: new Date(),
    description: "Escale funis de alta conversão usando IA generativa.",
  },
]

export function ProductsGrid({ onEditProduct }: ProductsGridProps) {
  // Replace the next line with your data-fetching hook when ready
  const [products] = React.useState<Product[]>(DEMO_PRODUCTS)

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onEdit={onEditProduct} />
      ))}
    </section>
  )
}
