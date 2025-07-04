"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Dynamically load the actual chart implementation on the client.
 * - `ssr: false` prevents the recharts bundle from executing during the server build.
 * - We keep the skeleton loader for a smooth UX.
 */
const RevenueChartClient = dynamic(() => import("./revenue-chart.client"), {
  ssr: false,
  loading: () => (
    <div className="p-4">
      <Skeleton className="h-[350px] w-full" />
    </div>
  ),
})

/** Expose a simple wrapper so server components can render the chart. */
export function RevenueChartWrapper() {
  return <RevenueChartClient />
}
