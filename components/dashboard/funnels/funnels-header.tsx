"use client"

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { PlusCircle, Sparkles } from "lucide-react"

interface FunnelsHeaderProps {
  onOpenWizard: () => void
}

export function FunnelsHeader({ onOpenWizard }: FunnelsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Funis de Venda</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-2">Gerenciamento de Funis</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button size="lg" onClick={onOpenWizard}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Criar Novo Funil
          
        </Button>
      </div>
    </div>
  )
}
