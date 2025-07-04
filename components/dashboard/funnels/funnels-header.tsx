"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateFunnelWizard } from "./create-funnel-wizard"

export function FunnelsHeader() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Funis</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-semibold text-2xl md:text-3xl mt-2">Funis de Venda</h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-9 gap-1">
              <PlusCircle className="h-4 w-4" />
              <span className="sm:whitespace-nowrap">Criar Novo Funil</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Criar um Funil Perfeito</DialogTitle>
              <DialogDescription>
                Siga os passos para configurar seu novo funil de vendas com assistência da IA.
              </DialogDescription>
            </DialogHeader>
            <CreateFunnelWizard onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
