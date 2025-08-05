/**
 * Comprehensive Cookie Management System
 * GDPR/LGPD compliant with secure practices
 */

export interface CookieOptions {
  expires?: Date | number
  maxAge?: number
  domain?: string
  path?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: "strict" | "lax" | "none"
}

export interface CookieConsent {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
  timestamp: string
}

export class CookieManager {
  private static instance: CookieManager
  private consent: CookieConsent | null = null

  static getInstance(): CookieManager {
    if (!CookieManager.instance) {
      CookieManager.instance = new CookieManager()
    }
    return CookieManager.instance
  }

  /**
   * Set cookie with proper options and consent check
   */
  setCookie(
    name: string,
    value: string,
    options: CookieOptions = {},
    category: keyof CookieConsent = "necessary",
  ): boolean {
    if (!this.hasConsent(category)) {
      console.warn(`Cookie ${name} not set: No consent for ${category}`)
      return false
    }

    const defaults: CookieOptions = {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    }

    const finalOptions = { ...defaults, ...options }
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    if (finalOptions.expires) {
      const expires =
        finalOptions.expires instanceof Date ? finalOptions.expires : new Date(Date.now() + finalOptions.expires)
      cookieString += `; expires=${expires.toUTCString()}`
    }

    if (finalOptions.maxAge) {
      cookieString += `; max-age=${finalOptions.maxAge}`
    }

    if (finalOptions.domain) {
      cookieString += `; domain=${finalOptions.domain}`
    }

    if (finalOptions.path) {
      cookieString += `; path=${finalOptions.path}`
    }

    if (finalOptions.secure) {
      cookieString += `; secure`
    }

    if (finalOptions.httpOnly) {
      cookieString += `; httponly`
    }

    if (finalOptions.sameSite) {
      cookieString += `; samesite=${finalOptions.sameSite}`
    }

    if (typeof document !== "undefined") {
      document.cookie = cookieString
      return true
    }

    return false
  }

  /**
   * Get cookie value
   */
  getCookie(name: string): string | null {
    if (typeof document === "undefined") return null

    const nameEQ = encodeURIComponent(name) + "="
    const cookies = document.cookie.split(";")

    for (let cookie of cookies) {
      cookie = cookie.trim()
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length))
      }
    }

    return null
  }

  /**
   * Delete cookie
   */
  deleteCookie(name: string, path = "/", domain?: string): void {
    let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`

    if (domain) {
      cookieString += `; domain=${domain}`
    }

    if (typeof document !== "undefined") {
      document.cookie = cookieString
    }
  }

  /**
   * Set user consent preferences
   */
  setConsent(consent: Partial<CookieConsent>): void {
    this.consent = {
      necessary: true, // Always true
      analytics: Boolean(consent.analytics),
      marketing: Boolean(consent.marketing),
      preferences: Boolean(consent.preferences),
      timestamp: new Date().toISOString(),
    }

    this.setCookie(
      "cookie_consent",
      JSON.stringify(this.consent),
      {
        maxAge: 365 * 24 * 60 * 60, // 1 year
        secure: true,
        sameSite: "strict",
      },
      "necessary",
    )

    // Clean up cookies based on consent
    this.cleanupBasedOnConsent()
  }

  /**
   * Get current consent status
   */
  getConsent(): CookieConsent | null {
    if (this.consent) return this.consent

    const consentCookie = this.getCookie("cookie_consent")
    if (consentCookie) {
      try {
        this.consent = JSON.parse(consentCookie)
        return this.consent
      } catch (error) {
        console.error("Error parsing consent cookie:", error)
      }
    }

    return null
  }

  /**
   * Check if user has given consent for specific category
   */
  hasConsent(category: keyof CookieConsent): boolean {
    const consent = this.getConsent()
    return consent ? Boolean(consent[category]) : category === "necessary"
  }

  /**
   * Clean up cookies based on consent
   */
  private cleanupBasedOnConsent(): void {
    const consent = this.getConsent()
    if (!consent) return

    // Remove analytics cookies if no consent
    if (!consent.analytics) {
      this.deleteCookie("_ga")
      this.deleteCookie("_gid")
      this.deleteCookie("_gat")
      this.deleteCookie("analytics_session")
    }

    // Remove marketing cookies if no consent
    if (!consent.marketing) {
      this.deleteCookie("marketing_id")
      this.deleteCookie("campaign_source")
      this.deleteCookie("utm_data")
    }

    // Remove preference cookies if no consent
    if (!consent.preferences) {
      this.deleteCookie("user_preferences")
      this.deleteCookie("theme")
      this.deleteCookie("language")
    }
  }

  /**
   * Save user session data
   */
  saveSession(sessionData: Record<string, any>): void {
    this.setCookie(
      "user_session",
      JSON.stringify(sessionData),
      {
        maxAge: 24 * 60 * 60, // 24 hours
        secure: true,
        sameSite: "strict",
      },
      "necessary",
    )
  }

  /**
   * Get user session data
   */
  getSession(): Record<string, any> | null {
    const sessionCookie = this.getCookie("user_session")
    if (sessionCookie) {
      try {
        return JSON.parse(sessionCookie)
      } catch (error) {
        console.error("Error parsing session cookie:", error)
      }
    }
    return null
  }

  /**
   * Save user preferences
   */
  savePreferences(preferences: Record<string, any>): void {
    this.setCookie(
      "user_preferences",
      JSON.stringify(preferences),
      {
        maxAge: 365 * 24 * 60 * 60, // 1 year
        secure: true,
        sameSite: "lax",
      },
      "preferences",
    )
  }

  /**
   * Get user preferences
   */
  getPreferences(): Record<string, any> | null {
    const prefCookie = this.getCookie("user_preferences")
    if (prefCookie) {
      try {
        return JSON.parse(prefCookie)
      } catch (error) {
        console.error("Error parsing preferences cookie:", error)
      }
    }
    return null
  }

  /**
   * Track analytics event (with consent check)
   */
  trackEvent(event: string, data: Record<string, any>): void {
    if (!this.hasConsent("analytics")) return

    this.setCookie(
      "last_event",
      JSON.stringify({ event, data, timestamp: Date.now() }),
      {
        maxAge: 60 * 60, // 1 hour
        secure: true,
      },
      "analytics",
    )
  }

  /**
   * Get all cookies for debugging
   */
  getAllCookies(): Record<string, string> {
    if (typeof document === "undefined") return {}

    const cookies: Record<string, string> = {}
    document.cookie.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=")
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value)
      }
    })

    return cookies
  }
}

// Export singleton instance
export const cookieManager = CookieManager.getInstance()
