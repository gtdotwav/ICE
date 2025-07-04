"use client"

import { useState } from "react"
import { FunnelsHeader } from "@/components/dashboard/funnels/funnels-header"
import { FunnelsTable } from "@/components/dashboard/funnels/funnels-table"
import { CreateFunnelWizard } from "@/components/dashboard/funnels/create-funnel-wizard"
import type { Funnel } from "@/components/dashboard/funnels/funnels-table"

const initialFunnels: Funnel[] = [
  { id: "FNL-001", name: "Lançamento SaaS", status: "active", revenue: 45231.89, conversion: 12.5, trend: 5.2 },
  { id: "FNL-002", name: "Webinar Tech", status: "active", revenue: 12100.0, conversion: 22.1, trend: -1.8 },
  { id: "FNL-003", name: "Ebook Gratuito", status: "paused", revenue: 5300.5, conversion: 35.0, trend: 0 },
  { id: "FNL-004", name: "Venda Direta - Produto Y", status: "draft", revenue: 0.0, conversion: 0.0, trend: 0 },
]

export default function FunnelsPage() {
  const [funnels, setFunnels] = useState<Funnel[]>(initialFunnels)
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  const handleAddFunnel = (newFunnel: Funnel) => {
    setFunnels((prevFunnels) => [newFunnel, ...prevFunnels])
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Funis de Vendas
        </h1>
        <p className="text-lg text-muted-foreground">Gerencie e otimize seus funis de conversão.</p>
      </div>

      <FunnelsHeader onOpenWizard={() => setIsWizardOpen(true)} />
      <FunnelsTable funnels={funnels} onOpenWizard={() => setIsWizardOpen(true)} />

      <CreateFunnelWizard isOpen={isWizardOpen} onOpenChange={setIsWizardOpen} onFunnelCreated={handleAddFunnel} />
    </div>
  )
}
