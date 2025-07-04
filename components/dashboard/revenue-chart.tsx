import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const RevenueChartClient = dynamic(() => import("./revenue-chart.client"), {
  ssr: false,
  loading: () => (
    <div className="p-4">
      <Skeleton className="h-[350px] w-full" />
    </div>
  ),
})

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Geral da Receita</CardTitle>
        <CardDescription>Acompanhe a receita gerada ao longo do tempo.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <RevenueChartClient />
      </CardContent>
    </Card>
  )
}
