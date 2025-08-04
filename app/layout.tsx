import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import dynamic from "next/dynamic"
import "./globals.css"
import { cn } from "@/lib/utils"

// Dynamically import client-side components with SSR disabled
const AnimatedGradient = dynamic(
  () => import("@/components/background/animated-gradient").then(mod => ({ default: mod.AnimatedGradient })),
  { ssr: false }
)

const FloatingLogo = dynamic(
  () => import("@/components/ui/floating-logo").then(mod => ({ default: mod.FloatingLogo })),
  { ssr: false }
)

const Toaster = dynamic(
  () => import("@/components/ui/toaster").then(mod => ({ default: mod.Toaster })),
  { ssr: false }
)

const CookieConsentBanner = dynamic(
  () => import("@/components/ui/cookie-consent-banner").then(mod => ({ default: mod.CookieConsentBanner })),
  { ssr: false }
)

const ClientInitializer = dynamic(
  () => import("@/components/client-initializer").then(mod => ({ default: mod.ClientInitializer })),
  { ssr: false }
)

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

export const metadata: Metadata = {
  title: "HIAS FLOW | AI-Powered Conversion Engine",
  description:
    "Funis com IA que otimizam conversões. Inteligência Artificial aplicada em cada etapa para um ROI previsível e crescimento escalável.",
  keywords: ["IA", "SaaS", "Funil de Vendas", "Machine Learning", "Otimização de Conversão", "Next.js"],
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-body text-foreground antialiased",
          inter.variable,
          spaceGrotesk.variable,
        )}
      >
        {/* Background gradient animation */}
        <AnimatedGradient />

        {/* Main content container */}
        <div className="relative z-10 flex flex-col min-h-screen">{children}</div>

        {/* Floating logo - positioned in top-right, shows after scrolling */}
        <FloatingLogo
          position="top-right"
          size="md"
          showOnScroll={true}
          className="hidden sm:block" // Hide on mobile to avoid clutter
        />

        {/* Toast notifications */}
        <Toaster />

        {/* Cookie consent banner */}
        <CookieConsentBanner />

        {/* Client-side initialization */}
        <ClientInitializer />
      </body>
    </html>
  )
}
