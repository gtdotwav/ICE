"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"

/**
 * Dynamically import the client-only chart to avoid Recharts on the server.
 * ssr:false ensures Next.js never evaluates Recharts during prerender.
 */
const RevenueChartClient = dynamic(() => import("./revenue-chart.client").then((m) => m.RevenueChartClient), {
  ssr: false,
  loading: () => null,
})

export function RevenueChart() {
  return (
    <Card className="bg-background/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Receita nos Últimos 7 Dias</CardTitle>
        <CardDescription>Uma visão geral do crescimento da receita.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <RevenueChartClient />
        </div>
      </CardContent>
    </Card>
  )
}
