import "@/app/globals.css"
import { CanvasProvider } from "@/components/canvas-provider"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "IceFunnel",
  description: "Marketing funnels driven by AI",
    generator: 'v0.dev'
}

/*  ────────────────────────────────────────────────────────────
    Disable automatic static prerendering so pages render
    at request-time (avoids the crashing SSR step for now).
   ──────────────────────────────────────────────────────────── */
export const dynamic = "force-dynamic"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CanvasProvider>{children}</CanvasProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
