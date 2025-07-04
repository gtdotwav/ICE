"use client"

import dynamic from "next/dynamic"

const RevenueChartClient = dynamic(() => import("./revenue-chart.client"), {
  ssr: true,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading chart...</div>
  ),
})

export function RevenueChartWrapper() {
  return (
    <div className="h-[300px]">
      <RevenueChartClient />
    </div>
  )
}
