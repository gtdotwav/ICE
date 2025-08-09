import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const range = searchParams.get("range") || "30d"

  const metrics = {
    range,
    revenueTotal: 45231,
    conversions: 2350,
    visitors: 12234,
    conversionRate: 3.24,
    change: {
      revenue: 12.5,
      conversions: 15.3,
      visitors: -2.4,
      conversionRate: 0.8,
    },
    revenueSeries: [
      { month: "Jan", value: 2200 },
      { month: "Fev", value: 3100 },
      { month: "Mar", value: 2800 },
      { month: "Abr", value: 3600 },
      { month: "Mai", value: 4200 },
      { month: "Jun", value: 3900 },
      { month: "Jul", value: 4800 },
      { month: "Ago", value: 5100 },
      { month: "Set", value: 4700 },
      { month: "Out", value: 5200 },
      { month: "Nov", value: 6100 },
      { month: "Dez", value: 5700 },
    ],
    funnel: [
      { step: "Visitantes", value: 12000 },
      { step: "Leads", value: 3600 },
      { step: "Prospects", value: 1200 },
      { step: "Clientes", value: 350 },
    ],
  }

  return NextResponse.json(metrics)
}
