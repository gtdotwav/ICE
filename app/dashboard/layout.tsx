import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { AnimatedGradient } from "@/components/background/animated-gradient"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <AnimatedGradient />
      </div>

      {/* Dashboard content */}
      <div className="relative z-10 flex h-screen">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">
            <div className="section-padding content-spacing min-h-full">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
