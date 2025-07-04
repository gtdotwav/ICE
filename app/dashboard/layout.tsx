"use client"

import type React from "react"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { AnimatedGradient } from "@/components/background/animated-gradient"
import { Toaster } from "@/components/ui/sonner"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <AnimatedGradient />
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-sm ring-1 ring-primary/30 animate-pulse">
            <div className="h-5 w-5 sm:h-6 sm:w-6 bg-primary rounded animate-pulse" />
          </div>
          <div className="text-center">
            <h2 className="text-base sm:text-lg font-semibold gradient-primary">Carregando Dashboard</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Preparando sua experiência...</p>
          </div>
          <div className="flex gap-1">
            <div
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatedGradient />

      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-shrink-0">
          <DashboardSidebar />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="fixed inset-y-0 left-0 w-64 animate-slide-up">
              <DashboardSidebar />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <DashboardHeader
            title="Dashboard"
            description="Visão geral das suas métricas e performance"
            breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
            action={{
              label: "Novo Funil",
              onClick: () => console.log("Criar novo funil"),
              variant: "default",
            }}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="h-full">
              <div
                className={cn(
                  "h-full transition-all duration-300 ease-in-out animate-fade-in",
                  "p-3 sm:p-4 lg:p-6 xl:p-8",
                )}
              >
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "glass-card border-white/10",
          duration: 4000,
        }}
      />
    </div>
  )
}
