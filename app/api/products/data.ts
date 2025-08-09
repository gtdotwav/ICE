export type Product = {
  id: string
  name: string
  category: string
  price: number
  status: "active" | "draft" | "archived"
  imageUrl?: string
  createdAt: string
}

export const productsStore: Product[] = [
  { id: "PRD-001", name: "Plano Starter", category: "Plano", price: 29, status: "active", imageUrl: "/product-starter.png", createdAt: new Date().toISOString() },
  { id: "PRD-002", name: "Plano Pro", category: "Plano", price: 99, status: "active", imageUrl: "/product-pro.png", createdAt: new Date().toISOString() },
  { id: "PRD-003", name: "Consultoria", category: "Serviço", price: 249, status: "draft", imageUrl: "/consulting-meeting.png", createdAt: new Date().toISOString() },
]
