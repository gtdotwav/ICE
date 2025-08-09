"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { buildFilledPrompt, computeBlocks, RAW_PROMPT_PT_BR, type PromptVars } from "@/lib/funnel/prompt"

type FunnelType = PromptVars["funnelType"]

function useDefaultVars() {
  const [language, setLanguage] = useState("pt-BR")
  const [funnelName, setFunnelName] = useState("Funil de Lançamento")
  const [funnelType, setFunnelType] = useState<FunnelType>("lp")
  const [tone, setTone] = useState("Direto, confiante")
  const [style, setStyle] = useState("Claro, amigável, foco em benefícios")
  const [product, setProduct] = useState({
    name: "ICE Funnel",
    price: "R$ 297",
    category: "SaaS de Funis",
    benefits: "- Crie funis em minutos\n- A/B test sem esforço\n- Templates de alta conversão",
    uniques: "- Integração nativa com n8n\n- Prompt único para LP/Checkout/VSL\n- Sem libs externas",
  })
  const [audience, setAudience] = useState({
    who: "Produtores digitais e agências",
    pains: "- Perda de tempo montando páginas\n- Dificuldade de copy\n- Baixa conversão",
    objections: "- 'Já tenho landing pages'\n- 'É difícil integrar'",
  })
  const [offer, setOffer] = useState({
    promise: "Monte um funil completo e responsivo com 1 prompt",
    bonuses: "- Template LP V2\n- Checklist de Copy\n- 30 dias de suporte",
    guarantee: "Garantia incondicional de 7 dias",
  })
  const [brand, setBrand] = useState({
    guidelines: "Use linguagem simples, foco em benefícios, CTA claro acima da dobra.",
  })

  return {
    state: {
      language,
      funnelName,
      funnelType,
      tone,
      style,
      product,
      audience,
      offer,
      brand,
    },
    setters: {
      setLanguage,
      setFunnelName,
      setFunnelType,
      setTone,
      setStyle,
      setProduct,
      setAudience,
      setOffer,
      setBrand,
    },
  }
}

export function FunnelPromptPanel() {
  const { state, setters } = useDefaultVars()

  const blocks = useMemo(() => computeBlocks(state.funnelType), [state.funnelType])

  const filled = useMemo(
    () =>
      buildFilledPrompt({
        language: state.language,
        funnelName: state.funnelName,
        funnelType: state.funnelType,
        tone: state.tone,
        style: state.style,
        product: state.product,
        audience: state.audience,
        offer: state.offer,
        brand: state.brand,
      }),
    [state],
  )

  const [sending, setSending] = useState(false)
  const [html, setHtml] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function copy(text: string) {
    await navigator.clipboard.writeText(text)
  }

  async function sendToN8n() {
    setSending(true)
    setError(null)
    setHtml(null)
    try {
      // Forwarded by /app/api/[...n8n]/route.ts to N8N_BASE_URL/<prefix>/api/funnels/generate
      const resp = await fetch("/api/funnels/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: filled,
          meta: {
            blocks,
            language: state.language,
            funnelName: state.funnelName,
            funnelType: state.funnelType,
          },
        }),
      })
      const text = await resp.text()
      if (!resp.ok) {
        setError(`Erro ${resp.status}: ${text.slice(0, 300)}`)
      } else {
        setHtml(text)
      }
    } catch (e: any) {
      setError(String(e?.message || e))
    } finally {
      setSending(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Gerar Página de Funil (via Prompt)</CardTitle>
        <p className="text-sm text-muted-foreground">
          Preencha as variáveis, copie o prompt ou envie direto para n8n para gerar HTML.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="language">Idioma</Label>
                <Input
                  id="language"
                  value={state.language}
                  onChange={(e) => setters.setLanguage(e.target.value)}
                  placeholder="pt-BR"
                />
              </div>
              <div>
                <Label htmlFor="funnelName">Nome do Funil</Label>
                <Input
                  id="funnelName"
                  value={state.funnelName}
                  onChange={(e) => setters.setFunnelName(e.target.value)}
                  placeholder="Lançamento X"
                />
              </div>
              <div>
                <Label>Tipo de Funil</Label>
                <Select value={state.funnelType} onValueChange={(v: FunnelType) => setters.setFunnelType(v)}>
                  <SelectTrigger aria-label="Tipo de funil">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lp">lp</SelectItem>
                    <SelectItem value="checkout">checkout</SelectItem>
                    <SelectItem value="lp_vsl_checkout">lp_vsl_checkout</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  value={state.product.price}
                  onChange={(e) => setters.setProduct({ ...state.product, price: e.target.value })}
                  placeholder="R$ 297"
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="productName">Produto - Nome</Label>
                <Input
                  id="productName"
                  value={state.product.name}
                  onChange={(e) => setters.setProduct({ ...state.product, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="productCategory">Produto - Categoria</Label>
                <Input
                  id="productCategory"
                  value={state.product.category}
                  onChange={(e) => setters.setProduct({ ...state.product, category: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="benefits">Benefícios (um por linha)</Label>
                <Textarea
                  id="benefits"
                  rows={3}
                  value={state.product.benefits}
                  onChange={(e) => setters.setProduct({ ...state.product, benefits: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="uniques">Diferenciais (um por linha)</Label>
                <Textarea
                  id="uniques"
                  rows={3}
                  value={state.product.uniques}
                  onChange={(e) => setters.setProduct({ ...state.product, uniques: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="who">Público - Quem</Label>
                <Input
                  id="who"
                  value={state.audience.who}
                  onChange={(e) => setters.setAudience({ ...state.audience, who: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="pains">Público - Dores</Label>
                <Textarea
                  id="pains"
                  rows={3}
                  value={state.audience.pains}
                  onChange={(e) => setters.setAudience({ ...state.audience, pains: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="objections">Público - Objeções</Label>
                <Textarea
                  id="objections"
                  rows={3}
                  value={state.audience.objections}
                  onChange={(e) => setters.setAudience({ ...state.audience, objections: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="promise">Oferta - Promessa</Label>
                <Input
                  id="promise"
                  value={state.offer.promise}
                  onChange={(e) => setters.setOffer({ ...state.offer, promise: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="bonuses">Oferta - Bônus (um por linha)</Label>
                <Textarea
                  id="bonuses"
                  rows={3}
                  value={state.offer.bonuses}
                  onChange={(e) => setters.setOffer({ ...state.offer, bonuses: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="guarantee">Oferta - Garantia</Label>
                <Input
                  id="guarantee"
                  value={state.offer.guarantee}
                  onChange={(e) => setters.setOffer({ ...state.offer, guarantee: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="tone">Tom</Label>
                <Input id="tone" value={state.tone} onChange={(e) => setters.setTone(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="style">Estilo</Label>
                <Input id="style" value={state.style} onChange={(e) => setters.setStyle(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="guidelines">Diretrizes de Marca</Label>
                <Textarea
                  id="guidelines"
                  rows={3}
                  value={state.brand.guidelines}
                  onChange={(e) => setters.setBrand({ ...state.brand, guidelines: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="border-muted">
              <CardHeader>
                <CardTitle className="text-base">Blocos ({state.funnelType})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">{blocks.join(" • ")}</div>
              </CardContent>
            </Card>

            <Tabs defaultValue="filled" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="filled">Preenchido</TabsTrigger>
                <TabsTrigger value="raw">Template</TabsTrigger>
              </TabsList>
              <TabsContent value="filled" className="space-y-2">
                <Textarea readOnly value={filled} rows={16} className="font-mono text-xs" />
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => copy(filled)}>
                    Copiar Prompt (preenchido)
                  </Button>
                  <Button onClick={sendToN8n} data-analytics="cta_generate" disabled={sending}>
                    {sending ? "Enviando..." : "Enviar para n8n"}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="raw" className="space-y-2">
                <Textarea readOnly value={RAW_PROMPT_PT_BR} rows={16} className="font-mono text-xs" />
                <Button variant="secondary" onClick={() => copy(RAW_PROMPT_PT_BR)}>
                  Copiar Template
                </Button>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="text-sm text-red-600 border border-red-200 rounded-md p-2 bg-red-50" role="alert">
                {error}
              </div>
            )}
          </div>
        </div>

        {html && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label>Preview do HTML (resposta do n8n)</Label>
              <div className="rounded-md border overflow-hidden">
                <iframe
                  title="Preview do funil"
                  className="w-full h-[640px] bg-white"
                  srcDoc={html}
                  sandbox="allow-same-origin"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => copy(html)}>
                  Copiar HTML
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const blob = new Blob([html], { type: "text/html" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = `${state.funnelName.replace(/\s+/g, "-").toLowerCase()}.html`
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                >
                  Baixar .html
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
