import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const FunnelChartClient = dynamic(() => import("./funnel-chart.client"), {
  ssr: false,
  loading: () => (
    <div className="p-4">
      <Skeleton className="h-[350px] w-full" />
    </div>
  ),
})

export function FunnelChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho do Funil</CardTitle>
        <CardDescription>Visualização da conversão em cada etapa.</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[350px] w-full">
          <FunnelChartClient />
        </div>
      </CardContent>
    </Card>
  )
}
