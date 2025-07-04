"use client" // Componentes de erro precisam ser 'use client'

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Loga o erro para um serviço de monitoramento
    console.error("Erro no Dashboard:", error)
  }, [error])

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center rounded-lg border border-dashed border-destructive bg-destructive/10 p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <h2 className="mt-4 text-2xl font-semibold text-destructive">Ocorreu um Erro no Dashboard</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        Não foi possível carregar esta seção. Você pode tentar recarregar ou contatar o suporte se o problema persistir.
      </p>
      <Button onClick={() => reset()} className="mt-6">
        Tentar Novamente
      </Button>
    </div>
  )
}
