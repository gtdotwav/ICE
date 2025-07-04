import type { ReactNode } from "react"
import { Inter } from "next/font/google"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

const inter = Inter({ subsets: ["latin"] })

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className={inter.className}>
      <div className="flex min-h-screen w-full bg-secondary/20">
        {/* Navegação lateral fixa */}
        <Sidebar />

        {/* Área principal */}
        <div className="flex flex-1 flex-col">
          {/* Cabeçalho global do dashboard */}
          <Header />

          {/* Conteúdo da rota corrente */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
