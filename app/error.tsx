"use client" // Componentes de erro precisam ser 'use client'

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Idealmente, você logaria este erro em um serviço como Sentry
    console.error("Erro Global:", error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body>
        <main className="flex h-screen w-full flex-col items-center justify-center bg-background">
          <div className="text-center">
            <ShieldAlert className="mx-auto h-16 w-16 text-destructive" />
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Oops! Algo deu muito errado.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Ocorreu um erro inesperado na aplicação. Nossa equipe já foi notificada.
            </p>
            <div className="mt-10">
              <Button onClick={() => reset()}>Tentar novamente</Button>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
