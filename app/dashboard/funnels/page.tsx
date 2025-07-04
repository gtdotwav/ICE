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
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <FunnelsHeader onOpenWizard={() => setIsWizardOpen(true)} />
        <FunnelsTable funnels={funnels} onOpenWizard={() => setIsWizardOpen(true)} />
      </main>
      <CreateFunnelWizard isOpen={isWizardOpen} onOpenChange={setIsWizardOpen} onFunnelCreated={handleAddFunnel} />
    </>
  )
}
