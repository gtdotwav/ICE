import { NextResponse } from "next/server"
import { funnelsStore, type Funnel } from "./data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") || "").toLowerCase()
  const data = funnelsStore
    .filter((f) => f.name.toLowerCase().includes(q))
    .sort((a, b) => b.revenue - a.revenue)
  return NextResponse.json({ items: data, total: data.length })
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Funnel>
  if (!body.name) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })
  const item: Funnel = {
    id: `FNL-${Math.random().toString().slice(2, 6)}`,
    name: body.name!,
    status: body.status || "draft",
    revenue: body.revenue ?? 0,
    conversion: body.conversion ?? 0,
    trend: body.trend ?? 0,
    createdAt: new Date().toISOString(),
  }
  funnelsStore.unshift(item)
  return NextResponse.json(item, { status: 201 })
}
