"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Heavy Recharts component – import only on the client.
 * `ssr: false` is allowed here because this wrapper is a client component.
 */
const RevenueChartClient = dynamic(() => import("./revenue-chart.client"), {
  ssr: false,
  loading: () => <div className="p-4 text-sm text-muted-foreground">Carregando gráfico…</div>,
})

export default function RevenueChartClientWrapper() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Geral da Receita</CardTitle>
        <CardDescription>Acompanhe a receita gerada ao longo do tempo.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <Suspense fallback={<p className="text-sm">Carregando…</p>}>
          <RevenueChartClient />
        </Suspense>
      </CardContent>
    </Card>
  )
}
