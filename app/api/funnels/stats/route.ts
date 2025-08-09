import { NextResponse } from "next/server"
import { funnelsStore } from "../data"

export async function GET() {
  const totalRevenue = funnelsStore.reduce((s, f) => s + f.revenue, 0)
  const avgConversion =
    funnelsStore.length ? funnelsStore.reduce((s, f) => s + f.conversion, 0) / funnelsStore.length : 0
  const active = funnelsStore.filter((f) => f.status === "active").length
  const aiOptimizations = 24
  return NextResponse.json({
    revenueTotal: totalRevenue,
    avgConversion: Number(avgConversion.toFixed(2)),
    activeFunnels: active,
    aiOptimizations,
  })
}
