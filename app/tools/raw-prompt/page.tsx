"use client"

import { useState } from "react"
import { RAW_V0_PROMPT_PT } from "@/components/funnel-prompt/raw-template"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check } from "lucide-react"

export default function Page() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(RAW_V0_PROMPT_PT)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">PROMPT PARA V0.DEV — LP, Checkout e LP+VSL+Checkout</h1>
        <p className="text-sm text-muted-foreground">
          Copie e cole exatamente este prompt no v0.dev. Substitua apenas os valores entre {"{{…}}"}.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Prompt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label className="text-sm">Conteúdo</Label>
            <Textarea
              value={RAW_V0_PROMPT_PT}
              readOnly
              rows={28}
              className="font-mono text-xs"
              aria-label="Prompt para copiar"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Caracteres: {RAW_V0_PROMPT_PT.length.toLocaleString()}
              </span>
              <Button onClick={copy} size="sm">
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" /> Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" /> Copiar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Onde colar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Abra v0.dev e cole o prompt no campo principal. Em seguida, substitua os placeholders {"{{…}}"} pelos
              valores do seu formulário.
            </p>
            <img
              src="https://sjc.microlink.io/DALgH5-uN2OXcUZH93wwM17XGGKo0Td8oHHDHnHsAlTSoXRGhboRsubVu9q-8f1tWKwm2Y7kI9vvNDRgjFuLDw.jpeg"
              alt="Screenshot da tela inicial do v0.dev com campo de prompt e cards da comunidade."
              className="w-full rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
