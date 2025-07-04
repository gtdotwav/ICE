"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log do erro para debugging
    console.error("Erro na aplicação:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-4">
          <ShieldAlert className="mx-auto h-16 w-16 text-destructive" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Algo deu errado</h1>
            <p className="text-muted-foreground">
              Ocorreu um erro inesperado. Tente novamente ou volte à página inicial.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => reset()} variant="default" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Button>
          <Button asChild variant="outline" className="flex items-center gap-2 bg-transparent">
            <Link href="/">
              <Home className="h-4 w-4" />
              Página inicial
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
