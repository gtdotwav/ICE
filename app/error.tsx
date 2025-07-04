"use client" // error.js precisa ser um Client Component

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Loga o erro para um serviço de monitoramento
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h2 className="text-3xl font-bold text-destructive mb-4">Oops! Algo deu errado.</h2>
      <p className="text-lg text-muted-foreground mb-6">Um erro inesperado ocorreu. Você pode tentar novamente.</p>
      <Button onClick={() => reset()}>Tentar novamente</Button>
    </div>
  )
}
