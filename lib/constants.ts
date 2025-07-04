import type { Product } from "./types"

export const PRODUCT_CATEGORIES = [
  { value: "course", label: "Curso Online" },
  { value: "ebook", label: "E-book" },
  { value: "masterclass", label: "Masterclass" },
  { value: "template", label: "Template" },
  { value: "mentorship", label: "Mentoria" },
]

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_001",
    name: "Curso Completo de Next.js 14",
    category: "course",
    price: 297.0,
    status: "active",
    imageUrl: "/nextjs-course.png",
    revenue: 12500,
    sales: 42,
    createdAt: new Date("2023-10-15"),
  },
  {
    id: "prod_002",
    name: "E-book: Dominando Tailwind CSS",
    category: "ebook",
    price: 49.9,
    status: "active",
    imageUrl: "/tailwind-css-ebook.png",
    revenue: 2500,
    sales: 50,
    createdAt: new Date("2023-09-01"),
  },
  {
    id: "prod_003",
    name: "Masterclass de Vendas Online",
    category: "masterclass",
    price: 497.0,
    status: "draft",
    imageUrl: "/sales-masterclass.png",
    revenue: 0,
    sales: 0,
    createdAt: new Date("2023-11-01"),
  },
  {
    id: "prod_004",
    name: "Mentoria de Carreira em Tech",
    category: "mentorship",
    price: 997.0,
    status: "archived",
    imageUrl: "/placeholder-taond.png",
    revenue: 15000,
    sales: 15,
    createdAt: new Date("2023-05-20"),
  },
]
