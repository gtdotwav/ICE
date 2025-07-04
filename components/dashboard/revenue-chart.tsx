import RevenueChartClientWrapper from "./revenue-chart-client-wrapper"

/**
 * Server Component that renders the client chart wrapper.
 * Exports both named and default exports for flexibility.
 */
export function RevenueChart() {
  return <RevenueChartClientWrapper />
}

export default RevenueChart
