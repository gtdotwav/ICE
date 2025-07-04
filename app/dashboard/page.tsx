import { OverviewCards } from "@/components/dashboard/overview-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { FunnelChart } from "@/components/dashboard/funnel-chart"
import { AiWidget } from "@/components/dashboard/ai-widget"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">Visão geral do seu desempenho e métricas principais.</p>
      </div>

      {/* Overview Cards */}
      <OverviewCards />

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueChart />
        </div>
        <div className="lg:col-span-3">
          <FunnelChart />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <AiWidget />
        </div>
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
