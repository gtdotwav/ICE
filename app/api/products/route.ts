import { NextResponse } from "next/server"
import { productsStore, type Product } from "./data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") || "").toLowerCase()
  const status = searchParams.get("status")
  let items = productsStore
  if (q) items = items.filter((p) => p.name.toLowerCase().includes(q))
  if (status && ["active", "draft", "archived"].includes(status)) {
    items = items.filter((p) => p.status === status)
  }
  return NextResponse.json({ items, total: items.length })
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Product>
  if (!body.name || typeof body.price !== "number") {
    return NextResponse.json({ error: "Nome e preço são obrigatórios" }, { status: 400 })
  }
  const item: Product = {
    id: `PRD-${Math.random().toString().slice(2, 6)}`,
    name: body.name!,
    category: body.category || "Geral",
    price: body.price!,
    status: (body.status as any) || "draft",
    imageUrl: body.imageUrl,
    createdAt: new Date().toISOString(),
  }
  productsStore.unshift(item)
  return NextResponse.json(item, { status: 201 })
}
