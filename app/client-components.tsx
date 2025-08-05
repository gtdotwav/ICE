"use client"

import dynamic from "next/dynamic"

// Dynamically import client-side components with SSR disabled
export const AnimatedGradient = dynamic(
  () => import("@/components/background/animated-gradient").then((mod) => ({ default: mod.AnimatedGradient })),
  { ssr: false },
)

export const FloatingLogo = dynamic(
  () => import("@/components/ui/floating-logo").then((mod) => ({ default: mod.FloatingLogo })),
  { ssr: false },
)

export const Toaster = dynamic(() => import("@/components/ui/toaster").then((mod) => ({ default: mod.Toaster })), {
  ssr: false,
})

export const CookieConsentBanner = dynamic(
  () => import("@/components/ui/cookie-consent-banner").then((mod) => ({ default: mod.CookieConsentBanner })),
  { ssr: false },
)

export const ClientInitializer = dynamic(
  () => import("@/components/client-initializer").then((mod) => ({ default: mod.ClientInitializer })),
  { ssr: false },
)
