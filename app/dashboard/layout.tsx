import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { AnimatedGradient } from "@/components/background/animated-gradient"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      <AnimatedGradient />
      <div className="relative z-10 flex h-screen bg-transparent">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
