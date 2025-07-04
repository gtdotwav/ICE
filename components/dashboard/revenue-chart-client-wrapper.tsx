"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

/**
 * Dynamically import the chart component with SSR enabled.
 * This allows the component to be rendered on the server.
 */
const RevenueChartClient = dynamic(() => import("./revenue-chart.client"), {
  ssr: true,
  loading: () => <p className="text-sm text-muted-foreground">Loading chart…</p>,
})

export default function RevenueChartClientWrapper() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">Monthly Revenue</CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading chart…</p>}>
          <RevenueChartClient />
        </Suspense>
      </CardContent>
    </Card>
  )
}
