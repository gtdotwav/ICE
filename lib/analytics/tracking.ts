/**
 * Analytics and Tracking System
 * GDPR compliant with consent management
 */

import { cookieManager } from '@/lib/cookie-manager'
import { performanceOptimizer } from '@/lib/performance/optimization'

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: string
  userId?: string
  sessionId?: string
}

export interface PageView {
  path: string
  title?: string
  referrer?: string
  timestamp?: string
  userId?: string
  sessionId?: string
}

export class AnalyticsManager {
  private static instance: AnalyticsManager
  private sessionId: string
  private userId?: string
  private queue: AnalyticsEvent[] = []
  private isInitialized = false

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeTracking()
  }

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager()
    }
    return AnalyticsManager.instance
  }

  /**
   * Initialize tracking systems
   */
  private async initializeTracking(): Promise<void> {
    if (typeof window === 'undefined') return

    // Wait for consent
    await this.waitForConsent()

    if (!cookieManager.hasConsent('analytics')) {
      console.log('📊 Analytics disabled - no consent')
      return
    }

    try {
      // Initialize Google Analytics
      await this.initializeGoogleAnalytics()
      
      // Initialize custom tracking
      this.setupCustomTracking()
      
      // Process queued events
      this.processQueue()
      
      this.isInitialized = true
      console.log('📊 Analytics initialized')
    } catch (error) {
      console.error('Analytics initialization failed:', error)
    }
  }

  /**
   * Wait for user consent
   */
  private async waitForConsent(): Promise<void> {
    return new Promise((resolve) => {
      const checkConsent = () => {
        const consent = cookieManager.getConsent()
        if (consent) {
          resolve()
        } else {
          setTimeout(checkConsent, 100)
        }
      }
      checkConsent()
    })
  }

  /**
   * Initialize Google Analytics
   */
  private async initializeGoogleAnalytics(): Promise<void> {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID
    if (!GA_ID) return

    // Load Google Analytics script
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    script.async = true
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }

    gtag('js', new Date())
    gtag('config', GA_ID, {
      page_title: document.title,
      page_location: window.location.href,
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    })

    // Make gtag available globally
    window.gtag = gtag
  }

  /**
   * Setup custom tracking
   */
  private setupCustomTracking(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('page_visibility_change', {
        visible: !document.hidden
      })
    })

    // Track scroll depth
    let maxScroll = 0
    const trackScroll = performanceOptimizer.throttle(() => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      )
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
        
        // Track milestones
        if ([25, 50, 75, 90].includes(scrollPercent)) {
          this.trackEvent('scroll_depth', {
            depth: scrollPercent,
            page: window.location.pathname
          })
        }
      }
    }, 1000)

    window.addEventListener('scroll', trackScroll, { passive: true })

    // Track clicks on important elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      
      // Track CTA clicks
      if (target.dataset.trackConversion === 'true') {
        this.trackEvent('cta_click', {
          funnelId: target.dataset.funnelId,
          stepId: target.dataset.stepId,
          value: target.dataset.value,
          text: target.textContent?.trim(),
          position: this.getElementPosition(target)
        })
      }

      // Track external links
      if (target.tagName === 'A') {
        const href = (target as HTMLAnchorElement).href
        if (href && !href.includes(window.location.hostname)) {
          this.trackEvent('external_link_click', {
            url: href,
            text: target.textContent?.trim()
          })
        }
      }
    })

    // Track form interactions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement
      const formData = new FormData(form)
      const fields = Object.fromEntries(formData.entries())

      this.trackEvent('form_submit', {
        formId: form.id || form.className,
        fields: Object.keys(fields),
        fieldCount: Object.keys(fields).length
      })
    })
  }

  /**
   * Track custom event
   */
  trackEvent(name: string, properties: Record<string, any> = {}): void {
    if (!cookieManager.hasConsent('analytics')) return

    const event: AnalyticsEvent = {
      name,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        userId: this.userId,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer
      }
    }

    if (this.isInitialized) {
      this.sendEvent(event)
    } else {
      this.queue.push(event)
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageData: Partial<PageView> = {}): void {
    if (!cookieManager.hasConsent('analytics')) return

    const pageView: PageView = {
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId,
      ...pageData
    }

    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_title: pageView.title,
        page_location: window.location.href,
        page_path: pageView.path
      })
    }

    // Send to custom analytics
    this.trackEvent('page_view', pageView)
  }

  /**
   * Track conversion
   */
  trackConversion(conversionData: {
    funnelId: string
    stepId: string
    value?: number
    currency?: string
    transactionId?: string
  }): void {
    if (!cookieManager.hasConsent('analytics')) return

    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: process.env.NEXT_PUBLIC_GA_ID,
        value: conversionData.value || 0,
        currency: conversionData.currency || 'BRL',
        transaction_id: conversionData.transactionId
      })
    }

    // Send to custom analytics
    this.trackEvent('conversion', conversionData)
  }

  /**
   * Track user identification
   */
  identify(userId: string, properties: Record<string, any> = {}): void {
    this.userId = userId
    
    if (!cookieManager.hasConsent('analytics')) return

    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        user_id: userId
      })
    }

    // Send to custom analytics
    this.trackEvent('user_identify', {
      userId,
      ...properties
    })

    // Save to session
    cookieManager.saveSession({
      userId,
      identifiedAt: new Date().toISOString()
    })
  }

  /**
   * Send event to analytics services
   */
  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // Send to internal API
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      })

      // Send to Google Analytics
      if (window.gtag) {
        window.gtag('event', event.name, event.properties)
      }

    } catch (error) {
      console.error('Failed to send analytics event:', error)
    }
  }

  /**
   * Process queued events
   */
  private processQueue(): void {
    while (this.queue.length > 0) {
      const event = this.queue.shift()
      if (event) {
        this.sendEvent(event)
      }
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get element position for tracking
   */
  private getElementPosition(element: HTMLElement): Record<string, number> {
    const rect = element.getBoundingClientRect()
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    }
  }

  /**
   * Get analytics metrics
   */
  getMetrics(): Record<string, any> {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      isInitialized: this.isInitialized,
      queueSize: this.queue.length,
      consent: cookieManager.getConsent()
    }
  }
}

// Export singleton instance
export const analytics = AnalyticsManager.getInstance()

// Global type declarations
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}
