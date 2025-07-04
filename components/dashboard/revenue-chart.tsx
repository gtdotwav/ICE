import RevenueChartClientWrapper from "./revenue-chart-client-wrapper"

/**
 * Server Component – streams the client-only chart.
 * We export BOTH named and default to satisfy every import style.
 */
export function RevenueChart() {
  return <RevenueChartClientWrapper />
}

export default RevenueChart
