"use client"

import { useEffect } from "react"
import { analytics } from "@/lib/analytics/tracking"
import { performanceMonitor } from "@/lib/monitoring/performance-monitor"
import { performanceOptimizer, imageOptimizer } from "@/lib/performance/optimization"

/**
 * Client-side initialization component
 * Handles all client-side setup and optimization
 */
export function ClientInitializer() {
  useEffect(() => {
    const initializeClient = async () => {
      try {
        // Setup performance optimizations
        await performanceOptimizer.preloadCriticalResources()

        // Setup lazy loading for images
        imageOptimizer.setupLazyLoading()

        // Initialize analytics and performance monitoring
        if (typeof window !== "undefined") {
          // Track initial page view
          analytics.trackPageView()

          // Initialize performance monitoring
          performanceMonitor.initialize()
        }

        // Setup error tracking
        window.addEventListener("error", (event) => {
          analytics.trackEvent("javascript_error", {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack,
          })
        })

        // Setup unhandled promise rejection tracking
        window.addEventListener("unhandledrejection", (event) => {
          analytics.trackEvent("unhandled_promise_rejection", {
            reason: event.reason?.toString(),
            stack: event.reason?.stack,
          })
        })

        // Setup performance monitoring
        if ("PerformanceObserver" in window) {
          const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              if (entry.entryType === "navigation") {
                analytics.trackEvent("page_performance", {
                  loadTime: entry.loadEventEnd - entry.loadEventStart,
                  domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
                  firstPaint: entry.responseEnd - entry.requestStart,
                })
              }
            })
          })

          observer.observe({ entryTypes: ["navigation"] })
        }

        console.log("✅ Client initialization complete")
      } catch (error) {
        console.error("❌ Client initialization failed:", error)
        // Don't throw the error to prevent breaking the app
      }
    }

    initializeClient()

    // Cleanup function
    return () => {
      // Cleanup any listeners or resources if needed
    }
  }, [])

  // Track route changes
  useEffect(() => {
    const handleRouteChange = () => {
      analytics.trackPageView()
    }

    // Listen for popstate (back/forward navigation)
    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  return null // This component doesn't render anything
}
