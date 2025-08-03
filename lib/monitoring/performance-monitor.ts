/**
 * Performance Monitoring System
 * Real-time performance tracking and optimization
 */

export interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  timeToInteractive: number
}

export interface ResourceMetrics {
  totalResources: number
  totalSize: number
  loadTime: number
  cacheHitRate: number
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetrics = {
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
    timeToInteractive: 0
  }
  private observers: PerformanceObserver[] = []

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
    if (typeof window === 'undefined') return

    this.setupPerformanceObservers()
    this.trackCoreWebVitals()
    this.monitorResourceLoading()
    this.trackUserInteractions()

    console.log('📊 Performance monitoring initialized')
  }

  /**
   * Setup performance observers
   */
  private setupPerformanceObservers(): void {
    // Navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            this.metrics.pageLoadTime = navEntry.loadEventEnd - navEntry.loadEventStart
            this.reportMetrics('navigation', this.metrics)
          }
        })
      })

      navObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(navObserver)
    }

    // Paint timing
    const paintObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime
        }
      })
    })

    paintObserver.observe({ entryTypes: ['paint'] })
    this.observers.push(paintObserver)

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.metrics.largestContentfulPaint = lastEntry.startTime
    })

    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    this.observers.push(lcpObserver)

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.metrics.firstInputDelay = entry.processingStart - entry.startTime
      })
    })

    fidObserver.observe({ entryTypes: ['first-input'] })
    this.observers.push(fidObserver)

    // Cumulative Layout Shift
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          this.metrics.cumulativeLayoutShift = clsValue
        }
      })
    })

    clsObserver.observe({ entryTypes: ['layout-shift'] })
    this.observers.push(clsObserver)
  }

  /**
   * Track Core Web Vitals
   */
  private trackCoreWebVitals(): void {
    // Use web-vitals library if available
    if (typeof window !== 'undefined' && 'webVitals' in window) {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = (window as any).webVitals

      getCLS((metric: any) => {
        this.metrics.cumulativeLayoutShift = metric.value
        this.reportWebVital('CLS', metric)
      })

      getFID((metric: any) => {
        this.metrics.firstInputDelay = metric.value
        this.reportWebVital('FID', metric)
      })

      getFCP((metric: any) => {
        this.metrics.firstContentfulPaint = metric.value
        this.reportWebVital('FCP', metric)
      })

      getLCP((metric: any) => {
        this.metrics.largestContentfulPaint = metric.value
        this.reportWebVital('LCP', metric)
      })

      getTTFB((metric: any) => {
        this.reportWebVital('TTFB', metric)
      })
    }
  }

  /**
   * Monitor resource loading
   */
  private monitorResourceLoading(): void {
    const resourceObserver = new PerformanceObserver((list) => {
      const resources = list.getEntries()
      const resourceMetrics: ResourceMetrics = {
        totalResources: resources.length,
        totalSize: resources.reduce((total, resource) => {
          return total + (resource.transferSize || 0)
        }, 0),
        loadTime: resources.reduce((max, resource) => {
          return Math.max(max, resource.responseEnd - resource.startTime)
        }, 0),
        cacheHitRate: this.calculateCacheHitRate(resources)
      }

      this.reportMetrics('resources', resourceMetrics)
    })

    resourceObserver.observe({ entryTypes: ['resource'] })
    this.observers.push(resourceObserver)
  }

  /**
   * Track user interactions
   */
  private trackUserInteractions(): void {
    let interactionCount = 0
    let totalInteractionTime = 0

    const trackInteraction = (event: Event) => {
      const startTime = performance.now()
      
      requestIdleCallback(() => {
        const duration = performance.now() - startTime
        interactionCount++
        totalInteractionTime += duration

        if (interactionCount % 10 === 0) { // Report every 10 interactions
          this.reportMetrics('interactions', {
            count: interactionCount,
            averageTime: totalInteractionTime / interactionCount,
            type: event.type
          })
        }
      })
    }

    ['click', 'keydown', 'scroll', 'touchstart'].forEach(eventType => {
      document.addEventListener(eventType, trackInteraction, { passive: true })
    })
  }

  /**
   * Calculate cache hit rate
   */
  private calculateCacheHitRate(resources: PerformanceEntry[]): number {
    const cachedResources = resources.filter(resource => {
      return (resource as PerformanceResourceTiming).transferSize === 0
    })

    return resources.length > 0 ? (cachedResources.length / resources.length) * 100 : 0
  }

  /**
   * Report web vital metric
   */
  private reportWebVital(name: string, metric: any): void {
    console.log(`📊 ${name}:`, metric.value)

    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, {
        value: Math.round(metric.value),
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta
      })
    }

    // Send to custom analytics
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        value: metric.value,
        id: metric.id,
        delta: metric.delta,
        url: window.location.href,
        timestamp: Date.now()
      })
    }).catch(console.error)
  }

  /**
   * Report general metrics
   */
  private reportMetrics(type: string, metrics: any): void {
    console.log(`📊 ${type} metrics:`, metrics)

    // Send to monitoring service
    fetch('/api/monitoring/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        metrics,
        url: window.location.href,
        timestamp: Date.now()
      })
    }).catch(console.error)
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Get performance score (0-100)
   */
  getPerformanceScore(): number {
    const weights = {
      fcp: 0.15,
      lcp: 0.25,
      fid: 0.25,
      cls: 0.25,
      ttfb: 0.10
    }

    const scores = {
      fcp: this.scoreMetric(this.metrics.firstContentfulPaint, [1800, 3000]),
      lcp: this.scoreMetric(this.metrics.largestContentfulPaint, [2500, 4000]),
      fid: this.scoreMetric(this.metrics.firstInputDelay, [100, 300]),
      cls: this.scoreMetric(this.metrics.cumulativeLayoutShift, [0.1, 0.25]),
      ttfb: this.scoreMetric(this.metrics.pageLoadTime, [800, 1800])
    }

    return Math.round(
      Object.entries(weights).reduce((total, [key, weight]) => {
        return total + (scores[key as keyof typeof scores] * weight)
      }, 0)
    )
  }

  /**
   * Score individual metric (0-100)
   */
  private scoreMetric(value: number, thresholds: [number, number]): number {
    const [good, poor] = thresholds
    
    if (value <= good) return 100
    if (value >= poor) return 0
    
    return Math.round(100 - ((value - good) / (poor - good)) * 100)
  }

  /**
   * Cleanup observers
   */
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance()

// Auto-initialize on client
if (typeof window !== 'undefined') {
  performanceMonitor.initialize()
}