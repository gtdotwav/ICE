/**
 * Performance Optimization System
 * Handles resource preloading, lazy loading, and performance optimizations
 */

export interface OptimizationConfig {
  preloadCriticalResources: boolean
  enableLazyLoading: boolean
  enableResourceHints: boolean
  enableServiceWorker: boolean
}

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer
  private config: OptimizationConfig = {
    preloadCriticalResources: true,
    enableLazyLoading: true,
    enableResourceHints: true,
    enableServiceWorker: false,
  }

  constructor(config?: Partial<OptimizationConfig>) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
  }

  static getInstance(config?: Partial<OptimizationConfig>): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer(config)
    }
    return PerformanceOptimizer.instance
  }

  /**
   * Preload critical resources
   */
  async preloadCriticalResources(): Promise<void> {
    if (!this.config.preloadCriticalResources || typeof window === "undefined") return

    try {
      // Preload critical CSS
      const criticalCSS = ["/styles/globals.css"]

      criticalCSS.forEach((href) => {
        const link = document.createElement("link")
        link.rel = "preload"
        link.as = "style"
        link.href = href
        document.head.appendChild(link)
      })

      // Preload critical fonts
      const criticalFonts = ["https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"]

      criticalFonts.forEach((href) => {
        const link = document.createElement("link")
        link.rel = "preload"
        link.as = "style"
        link.href = href
        document.head.appendChild(link)
      })

      // Preload critical images
      const criticalImages = ["/ice-logo.png", "/placeholder.svg"]

      criticalImages.forEach((src) => {
        const link = document.createElement("link")
        link.rel = "preload"
        link.as = "image"
        link.href = src
        document.head.appendChild(link)
      })

      console.log("✅ Critical resources preloaded")
    } catch (error) {
      console.error("Failed to preload critical resources:", error)
    }
  }

  /**
   * Add resource hints
   */
  addResourceHints(): void {
    if (!this.config.enableResourceHints || typeof window === "undefined") return

    try {
      // DNS prefetch for external domains
      const externalDomains = ["fonts.googleapis.com", "fonts.gstatic.com", "www.googletagmanager.com"]

      externalDomains.forEach((domain) => {
        const link = document.createElement("link")
        link.rel = "dns-prefetch"
        link.href = `//${domain}`
        document.head.appendChild(link)
      })

      // Preconnect to critical origins
      const criticalOrigins = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"]

      criticalOrigins.forEach((origin) => {
        const link = document.createElement("link")
        link.rel = "preconnect"
        link.href = origin
        link.crossOrigin = "anonymous"
        document.head.appendChild(link)
      })

      console.log("✅ Resource hints added")
    } catch (error) {
      console.error("Failed to add resource hints:", error)
    }
  }

  /**
   * Throttle function calls
   */
  throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
    let inThrottle: boolean
    return function (this: any, ...args: Parameters<T>) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  /**
   * Debounce function calls
   */
  debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout
    return function (this: any, ...args: Parameters<T>) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(this, args), delay)
    }
  }

  /**
   * Optimize images
   */
  optimizeImage(
    src: string,
    options: {
      width?: number
      height?: number
      quality?: number
      format?: "webp" | "avif" | "jpg" | "png"
    } = {},
  ): string {
    // In a real implementation, this would integrate with an image optimization service
    // For now, return the original src
    return src
  }

  /**
   * Lazy load resources
   */
  lazyLoad(selector: string, callback?: (element: Element) => void): void {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return

    const elements = document.querySelectorAll(selector)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target

            // Load image
            if (element.tagName === "IMG") {
              const img = element as HTMLImageElement
              const src = img.dataset.src
              if (src) {
                img.src = src
                img.removeAttribute("data-src")
              }
            }

            // Execute callback
            if (callback) {
              callback(element)
            }

            observer.unobserve(element)
          }
        })
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.01,
      },
    )

    elements.forEach((element) => observer.observe(element))
  }

  /**
   * Prefetch route
   */
  prefetchRoute(href: string): void {
    if (typeof window === "undefined") return

    const link = document.createElement("link")
    link.rel = "prefetch"
    link.href = href
    document.head.appendChild(link)
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): Record<string, number> {
    if (typeof window === "undefined" || !("performance" in window)) {
      return {}
    }

    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming

    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: navigation.responseEnd - navigation.requestStart,
      timeToInteractive: navigation.domInteractive - navigation.navigationStart,
    }
  }
}

export class ImageOptimizer {
  private static instance: ImageOptimizer

  static getInstance(): ImageOptimizer {
    if (!ImageOptimizer.instance) {
      ImageOptimizer.instance = new ImageOptimizer()
    }
    return ImageOptimizer.instance
  }

  /**
   * Setup lazy loading for images
   */
  setupLazyLoading(): void {
    if (typeof window === "undefined") return

    // Setup intersection observer for lazy loading
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              const src = img.dataset.src

              if (src) {
                img.src = src
                img.removeAttribute("data-src")
                img.classList.remove("lazy")
                imageObserver.unobserve(img)
              }
            }
          })
        },
        {
          rootMargin: "50px 0px",
          threshold: 0.01,
        },
      )

      // Observe all lazy images
      const lazyImages = document.querySelectorAll("img[data-src]")
      lazyImages.forEach((img) => imageObserver.observe(img))

      // Setup mutation observer to watch for new lazy images
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              const lazyImages = element.querySelectorAll("img[data-src]")
              lazyImages.forEach((img) => imageObserver.observe(img))
            }
          })
        })
      })

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      })

      console.log("✅ Image lazy loading setup complete")
    }
  }

  /**
   * Preload critical images
   */
  preloadImages(urls: string[]): Promise<void[]> {
    const promises = urls.map((url) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = reject
        img.src = url
      })
    })

    return Promise.all(promises)
  }

  /**
   * Convert image to WebP if supported
   */
  getOptimizedImageUrl(
    src: string,
    options: {
      width?: number
      height?: number
      quality?: number
    } = {},
  ): string {
    // In a real implementation, this would check WebP support and convert
    // For now, return the original src
    return src
  }
}

// Export singleton instances
export const performanceOptimizer = PerformanceOptimizer.getInstance()
export const imageOptimizer = ImageOptimizer.getInstance()
