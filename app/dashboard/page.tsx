import { DashboardHeader } from "@/components/dashboard/header"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { FunnelChart } from "@/components/dashboard/funnel-chart"
import { AiWidget } from "@/components/dashboard/ai-widget"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div className="content-spacing">
      <DashboardHeader title="Dashboard" description="Visão geral completa dos seus funis e performance" />

      {/* Overview Cards */}
      <OverviewCards />

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <FunnelChart />
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="lg:col-span-1">
          <AiWidget />
        </div>
      </div>
    </div>
  )
}
