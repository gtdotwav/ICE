import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { AnimatedGradient } from "@/components/background/animated-gradient"
import { FloatingLogo } from "@/components/ui/floating-logo"
import { Toaster } from "@/components/ui/toaster"

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
  title: "IceFunnel | AI-Powered Conversion Engine",
  description:
    "Funis com IA que congelam a concorrência. Inteligência Artificial aplicada em cada etapa para um ROI previsível e crescimento escalável.",
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
      </body>
    </html>
  )
}
