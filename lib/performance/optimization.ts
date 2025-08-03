/**
 * Performance Optimization System
 * Includes caching, lazy loading, and monitoring
 */

export interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum cache size
  strategy?: 'lru' | 'fifo' | 'lfu'
}

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer
  private cache: Map<string, { data: any; timestamp: number; hits: number }> = new Map()
  private cacheOptions: Required<CacheOptions>
  private metrics: {
    cacheHits: number
    cacheMisses: number
    totalRequests: number
    averageResponseTime: number
  } = {
    cacheHits: 0,
    cacheMisses: 0,
    totalRequests: 0,
    averageResponseTime: 0
  }

  constructor(options: CacheOptions = {}) {
    this.cacheOptions = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes
      maxSize: options.maxSize || 1000,
      strategy: options.strategy || 'lru'
    }
  }

  static getInstance(options?: CacheOptions): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer(options)
    }
    return PerformanceOptimizer.instance
  }

  /**
   * Cache with automatic expiration
   */
  setCache(key: string, data: any, customTtl?: number): void {
    const ttl = customTtl || this.cacheOptions.ttl
    
    // Check cache size and evict if necessary
    if (this.cache.size >= this.cacheOptions.maxSize) {
      this.evictCache()
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0
    })

    // Auto-expire
    setTimeout(() => {
      this.cache.delete(key)
    }, ttl)
  }

  /**
   * Get from cache with hit tracking
   */
  getCache(key: string): any | null {
    const cached = this.cache.get(key)
    
    if (!cached) {
      this.metrics.cacheMisses++
      return null
    }

    // Check if expired
    if (Date.now() - cached.timestamp > this.cacheOptions.ttl) {
      this.cache.delete(key)
      this.metrics.cacheMisses++
      return null
    }

    // Update hit count
    cached.hits++
    this.metrics.cacheHits++
    
    return cached.data
  }

  /**
   * Cache eviction based on strategy
   */
  private evictCache(): void {
    const entries = Array.from(this.cache.entries())
    
    switch (this.cacheOptions.strategy) {
      case 'lru': // Least Recently Used
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
        break
      case 'lfu': // Least Frequently Used
        entries.sort((a, b) => a[1].hits - b[1].hits)
        break
      case 'fifo': // First In, First Out
        // Already in insertion order
        break
    }

    // Remove oldest 10% of entries
    const toRemove = Math.ceil(entries.length * 0.1)
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0])
    }
  }

  /**
   * Memoization decorator for expensive functions
   */
  memoize<T extends (...args: any[]) => any>(
    fn: T,
    keyGenerator?: (...args: Parameters<T>) => string
  ): T {
    const cache = new Map()
    
    return ((...args: Parameters<T>) => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)
      
      if (cache.has(key)) {
        return cache.get(key)
      }
      
      const result = fn(...args)
      cache.set(key, result)
      
      return result
    }) as T
  }

  /**
   * Debounce function for performance
   */
  debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
    }
  }

  /**
   * Throttle function for performance
   */
  throttle<T extends (...args: any[]) => any>(
    fn: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        fn(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  /**
   * Lazy loading utility
   */
  createLazyLoader<T>(
    loadFn: () => Promise<T>,
    placeholder?: T
  ): () => Promise<T> {
    let loaded = false
    let loading = false
    let data: T | undefined = placeholder

    return async (): Promise<T> => {
      if (loaded && data !== undefined) {
        return data
      }

      if (loading) {
        // Wait for current loading to complete
        while (loading) {
          await new Promise(resolve => setTimeout(resolve, 10))
        }
        return data as T
      }

      loading = true
      try {
        data = await loadFn()
        loaded = true
        return data
      } finally {
        loading = false
      }
    }
  }

  /**
   * Performance monitoring
   */
  measurePerformance<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const startTime = performance.now()
      this.metrics.totalRequests++

      try {
        const result = await fn()
        const duration = performance.now() - startTime
        
        // Update average response time
        this.metrics.averageResponseTime = 
          (this.metrics.averageResponseTime + duration) / 2

        console.log(`⚡ ${name} completed in ${duration.toFixed(2)}ms`)
        resolve(result)
      } catch (error) {
        const duration = performance.now() - startTime
        console.error(`❌ ${name} failed after ${duration.toFixed(2)}ms:`, error)
        reject(error)
      }
    })
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    const cacheSize = this.cache.size
    const hitRate = this.metrics.totalRequests > 0 
      ? (this.metrics.cacheHits / this.metrics.totalRequests) * 100 
      : 0

    return {
      cache: {
        size: cacheSize,
        maxSize: this.cacheOptions.maxSize,
        hitRate: hitRate.toFixed(2) + '%',
        hits: this.metrics.cacheHits,
        misses: this.metrics.cacheMisses
      },
      performance: {
        totalRequests: this.metrics.totalRequests,
        averageResponseTime: this.metrics.averageResponseTime.toFixed(2) + 'ms'
      }
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
    console.log('🧹 Cache cleared')
  }

  /**
   * Preload critical resources
   */
  async preloadCriticalResources(): Promise<void> {
    const criticalResources = [
      '/api/user/profile',
      '/api/dashboard/metrics',
      '/api/webhooks/config'
    ]

    const preloadPromises = criticalResources.map(async (resource) => {
      try {
        const response = await fetch(resource)
        const data = await response.json()
        this.setCache(resource, data, 10 * 60 * 1000) // 10 minutes
      } catch (error) {
        console.warn(`Failed to preload ${resource}:`, error)
      }
    })

    await Promise.allSettled(preloadPromises)
    console.log('🚀 Critical resources preloaded')
  }
}

// Export singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance()

// Image optimization utilities
export const imageOptimizer = {
  /**
   * Lazy load images with intersection observer
   */
  setupLazyLoading(): void {
    if (typeof window === 'undefined') return

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const src = img.dataset.src
          
          if (src) {
            img.src = src
            img.classList.remove('lazy')
            imageObserver.unobserve(img)
          }
        }
      })
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    })

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img)
    })
  },

  /**
   * Generate responsive image srcset
   */
  generateSrcSet(baseUrl: string, sizes: number[]): string {
    return sizes
      .map(size => `${baseUrl}?w=${size} ${size}w`)
      .join(', ')
  },

  /**
   * Optimize image loading
   */
  optimizeImage(src: string, options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'jpg' | 'png'
  } = {}): string {
    const params = new URLSearchParams()
    
    if (options.width) params.set('w', options.width.toString())
    if (options.height) params.set('h', options.height.toString())
    if (options.quality) params.set('q', options.quality.toString())
    if (options.format) params.set('f', options.format)

    return `${src}?${params.toString()}`
  }
}

// Script loading utilities
export const scriptLoader = {
  /**
   * Load script dynamically with promise
   */
  loadScript(src: string, attributes: Record<string, string> = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof document === 'undefined') {
        reject(new Error('Document not available'))
        return
      }

      // Check if script already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = src
      script.async = true

      // Add custom attributes
      Object.entries(attributes).forEach(([key, value]) => {
        script.setAttribute(key, value)
      })

      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`))

      document.head.appendChild(script)
    })
  },

  /**
   * Load multiple scripts in sequence
   */
  async loadScriptsSequentially(scripts: Array<{ src: string; attributes?: Record<string, string> }>): Promise<void> {
    for (const script of scripts) {
      await this.loadScript(script.src, script.attributes)
    }
  },

  /**
   * Load scripts in parallel
   */
  async loadScriptsParallel(scripts: Array<{ src: string; attributes?: Record<string, string> }>): Promise<void> {
    const promises = scripts.map(script => 
      this.loadScript(script.src, script.attributes)
    )
    await Promise.all(promises)
  }
}