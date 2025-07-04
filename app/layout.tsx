import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
// 👇 NEW import — the client wrapper we just added
import AnimatedGradientClient from "@/components/background/animated-gradient-client"

// ——— Google fonts via next/font (local, no network fetch) ———
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
  generator: "v0.dev",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-body text-foreground antialiased",
          inter.variable,
          spaceGrotesk.variable,
        )}
      >
        <AnimatedGradientClient />
        <div className="relative z-10 flex flex-col min-h-screen">{children}</div>
      </body>
    </html>
  )
}
