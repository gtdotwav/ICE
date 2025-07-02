import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { AnimatedGradient } from "@/components/background/animated-gradient"

// Configuração das fontes customizadas usando next/font para otimização automática.
// A fonte 'Space Grotesk' será usada para títulos (display) e 'Inter' para o corpo do texto.
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

// Metadados otimizados para SEO, essenciais para a visibilidade da plataforma.
export const metadata: Metadata = {
  title: "IceFunnel | AI-Powered Conversion Engine",
  description:
    "Funis com IA que congelam a concorrência. Inteligência Artificial aplicada em cada etapa para um ROI previsível e crescimento escalável.",
  keywords: ["IA", "SaaS", "Funil de Vendas", "Machine Learning", "Otimização de Conversão", "Next.js"],
    generator: 'v0.dev'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={cn(
          "min-h-screen bg-ice-quantum-950 font-body text-ice-quantum-200 antialiased",
          inter.variable,
          spaceGrotesk.variable,
        )}
      >
        {/* Componente de fundo animado para criar uma atmosfera imersiva e tecnológica */}
        <AnimatedGradient />
        {/* O conteúdo da página é renderizado sobre o fundo */}
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  )
}
