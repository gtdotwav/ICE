/**
 * Performance Monitoring System
 * Tracks application performance metrics and sends to analytics
 */

import { analytics } from "@/lib/analytics/tracking"

export interface PerformanceMetrics {
  loadTime: number
  domContentLoaded: number
  firstPaint: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  timeToInteractive: number
}

export interface ResourceTiming {
  name: string
  duration: number
  size: number
  type: string
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private isInitialized = false
  private metrics: Partial<PerformanceMetrics> = {}

  constructor() {
    if (typeof window !== "undefined") {
      this.initialize()
    }
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  /**
   * Initialize performance monitoring
   */
  initialize(): void {
    if (this.isInitialized || typeof window === "undefined") return

    try {
      // Monitor Core Web Vitals
      this.monitorCoreWebVitals()

      // Monitor resource loading
      this.monitorResourceTiming()

      // Monitor navigation timing
      this.monitorNavigationTiming()

      // Monitor long tasks
      this.monitorLongTasks()

      this.isInitialized = true
      console.log("📊 Performance monitoring initialized")
    } catch (error) {
      console.error("Performance monitoring initialization failed:", error)
    }
  }

  /**
   * Monitor Core Web Vitals
   */
  private monitorCoreWebVitals(): void {
    if (!("PerformanceObserver" in window)) return

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as any

      this.metrics.largestContentfulPaint = lastEntry.startTime

      analytics.trackEvent("core_web_vital", {
        metric: "LCP",
        value: lastEntry.startTime,
        rating: this.getRating("LCP", lastEntry.startTime),
      })
    })

    try {
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] })
    } catch (e) {
      // LCP not supported
    }

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        this.metrics.firstInputDelay = entry.processingStart - entry.startTime

        analytics.trackEvent("core_web_vital", {
          metric: "FID",
          value: entry.processingStart - entry.startTime,
          rating: this.getRating("FID", entry.processingStart - entry.startTime),
        })
      })
    })

    try {
      fidObserver.observe({ entryTypes: ["first-input"] })
    } catch (e) {
      // FID not supported
    }

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })

      this.metrics.cumulativeLayoutShift = clsValue

      analytics.trackEvent("core_web_vital", {
        metric: "CLS",
        value: clsValue,
        rating: this.getRating("CLS", clsValue),
      })
    })

    try {
      clsObserver.observe({ entryTypes: ["layout-shift"] })
    } catch (e) {
      // CLS not supported
    }
  }

  /**
   * Monitor resource loading performance
   */
  private monitorResourceTiming(): void {
    if (!("PerformanceObserver" in window)) return

    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()

      entries.forEach((entry: any) => {
        const resource: ResourceTiming = {
          name: entry.name,
          duration: entry.duration,
          size: entry.transferSize || 0,
          type: this.getResourceType(entry.name),
        }

        // Track slow resources
        if (entry.duration > 1000) {
          analytics.trackEvent("slow_resource", resource)
        }

        // Track large resources
        if (entry.transferSize > 1000000) {
          // > 1MB
          analytics.trackEvent("large_resource", resource)
        }
      })
    })

    try {
      resourceObserver.observe({ entryTypes: ["resource"] })
    } catch (e) {
      // Resource timing not supported
    }
  }

  /**
   * Monitor navigation timing
   */
  private monitorNavigationTiming(): void {
    if (!("PerformanceObserver" in window)) return

    const navigationObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()

      entries.forEach((entry: any) => {
        const metrics = {
          loadTime: entry.loadEventEnd - entry.loadEventStart,
          domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
          firstPaint: entry.responseEnd - entry.requestStart,
          timeToInteractive: entry.domInteractive - entry.navigationStart,
        }

        this.metrics = { ...this.metrics, ...metrics }

        analytics.trackEvent("navigation_timing", {
          ...metrics,
          url: entry.name,
        })
      })
    })

    try {
      navigationObserver.observe({ entryTypes: ["navigation"] })
    } catch (e) {
      // Navigation timing not supported
    }
  }

  /**
   * Monitor long tasks that block the main thread
   */
  private monitorLongTasks(): void {
    if (!("PerformanceObserver" in window)) return

    const longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()

      entries.forEach((entry: any) => {
        analytics.trackEvent("long_task", {
          duration: entry.duration,
          startTime: entry.startTime,
          attribution: entry.attribution?.[0]?.name || "unknown",
        })
      })
    })

    try {
      longTaskObserver.observe({ entryTypes: ["longtask"] })
    } catch (e) {
      // Long tasks not supported
    }
  }

  /**
   * Get performance rating based on thresholds
   */
  private getRating(metric: string, value: number): "good" | "needs-improvement" | "poor" {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
    }

    const threshold = thresholds[metric as keyof typeof thresholds]
    if (!threshold) return "good"

    if (value <= threshold.good) return "good"
    if (value <= threshold.poor) return "needs-improvement"
    return "poor"
  }

  /**
   * Get resource type from URL
   */
  private getResourceType(url: string): string {
    if (url.includes(".js")) return "script"
    if (url.includes(".css")) return "stylesheet"
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return "image"
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) return "font"
    return "other"
  }

  /**
   * Get current metrics
   */
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics }
  }

  /**
   * Track custom performance mark
   */
  mark(name: string): void {
    if ("performance" in window && "mark" in performance) {
      performance.mark(name)
    }
  }

  /**
   * Measure time between two marks
   */
  measure(name: string, startMark: string, endMark?: string): number {
    if ("performance" in window && "measure" in performance) {
      try {
        performance.measure(name, startMark, endMark)
        const measure = performance.getEntriesByName(name, "measure")[0]

        analytics.trackEvent("custom_timing", {
          name,
          duration: measure.duration,
          startTime: measure.startTime,
        })

        return measure.duration
      } catch (e) {
        console.warn("Performance measure failed:", e)
        return 0
      }
    }
    return 0
  }

  /**
   * Send performance report
   */
  sendReport(): void {
    analytics.trackEvent("performance_report", {
      metrics: this.getMetrics(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    })
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance()

// Initialize performance monitoring function for compatibility
export const initializePerformanceMonitoring = () => {
  performanceMonitor.initialize()
}
