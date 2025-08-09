"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CreateFunnelWizard({
  isOpen,
  onOpenChange,
  onFunnelCreated,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onFunnelCreated: (f: any) => void
}) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [status, setStatus] = useState<"active" | "draft">("draft")

  const submit = async () => {
    const res = await fetch("/api/funnels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, status }),
    })
    const data = await res.json()
    if (res.ok) {
      onFunnelCreated(data)
      onOpenChange(false)
      setStep(0)
      setName("")
      setStatus("draft")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Funil</DialogTitle>
        </DialogHeader>

        <Tabs value={String(step)} onValueChange={(v) => setStep(Number(v))}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="0">Informações</TabsTrigger>
            <TabsTrigger value="1">Objetivos</TabsTrigger>
            <TabsTrigger value="2">Confirmação</TabsTrigger>
          </TabsList>
          <TabsContent value="0" className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Lançamento SaaS" />
            </div>
            <div className="flex justify-end">
              <Button disabled={!name} onClick={() => setStep(1)}>
                Próximo
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="1" className="space-y-3">
            <p className="text-sm text-muted-foreground">Defina metas e etapas depois. Você pode começar como rascunho.</p>
            <div className="flex items-center gap-2">
              <Button variant={status === "draft" ? "default" : "outline"} onClick={() => setStatus("draft")}>
                Rascunho
              </Button>
              <Button variant={status === "active" ? "default" : "outline"} onClick={() => setStatus("active")}>
                Ativo
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)}>
                Voltar
              </Button>
              <Button onClick={() => setStep(2)}>Próximo</Button>
            </div>
          </TabsContent>
          <TabsContent value="2" className="space-y-3">
            <div className="text-sm">
              <div><strong>Nome:</strong> {name || "—"}</div>
              <div><strong>Status:</strong> {status}</div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button disabled={!name} onClick={submit}>
                Criar Funil
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
