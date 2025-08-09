"use client"

import { useMemo, useState } from "react"
import { buildPrompt, type FunnelType } from "./prompt-template"
import { BLOCKS_ORDER } from "@/lib/funnel/blocks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Copy, Download, ListChecks } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type PreviewMode = "template" | "filled"

function parseMultiline(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.replace(/^\s*[-•]\s?/, "").trim())
    .filter(Boolean)
}

export default function FunnelPromptBuilder() {
  const { toast } = useToast()
  const [mode, setMode] = useState<PreviewMode>("filled")
  const [funnelType, setFunnelType] = useState<FunnelType>("lp")
  const [applyDidaticaV2, setApplyDidaticaV2] = useState<boolean>(true)

  // Campos do formulário
  const [language, setLanguage] = useState("pt-BR")
  const [funnelName, setFunnelName] = useState("Lançamento ICE")
  const [tone, setTone] = useState("Direto e confiante")
  const [style, setStyle] = useState("Moderno, objetivo, foco em conversão")

  const [productName, setProductName] = useState("ICE Funnel")
  const [productPrice, setProductPrice] = useState("R$ 497")
  const [productCategory, setProductCategory] = useState("Ferramenta de marketing")
  const [productBenefits, setProductBenefits] = useState(
    ["Lance páginas em minutos", "Aumente conversão com UX validada", "Integração simples com seu stack"].join("\n"),
  )
  const [productUniques, setProductUniques] = useState(
    ["Prompt único para LP/VSL/Checkout", "CSS inline sem dependências", "Estrutura didática v2 para LP"].join("\n"),
  )

  const [audienceWho, setAudienceWho] = useState("Criadores, infoprodutores e PMMs")
  const [audiencePains, setAudiencePains] = useState(
    ["Demora para publicar páginas", "Baixa conversão por falta de prova social", "Manutenção complexa"].join("\n"),
  )
  const [audienceObjections, setAudienceObjections] = useState(
    ["“Não tenho tempo”", "“Preciso de dev”", "“Já tentei e não funcionou”"].join("\n"),
  )

  const [offerPromise, setOfferPromise] = useState("Publicar funis completos com alta conversão em menos de 1 hora")
  const [offerBonuses, setOfferBonuses] = useState(
    ["Pack de seções de prova social", "Checklist de copy anti-objeções", "Modelos prontos de FAQ (5 itens)"].join(
      "\n",
    ),
  )
  const [offerGuarantee, setOfferGuarantee] = useState("Garantia incondicional de 7 dias")

  const [brandGuidelines, setBrandGuidelines] = useState(
    "Use contraste alto, leitura em blocos curtos e chamadas claras à ação.",
  )

  const blocks = useMemo(() => BLOCKS_ORDER[funnelType], [funnelType])

  const prompt = useMemo(() => {
    const filled = buildPrompt(
      {
        language,
        funnelName,
        funnelType,
        tone,
        style,
        product: {
          name: productName,
          price: productPrice,
          category: productCategory,
          benefits: parseMultiline(productBenefits),
          uniques: parseMultiline(productUniques),
        },
        audience: {
          who: audienceWho,
          pains: parseMultiline(audiencePains),
          objections: parseMultiline(audienceObjections),
        },
        offer: {
          promise: offerPromise,
          bonuses: parseMultiline(offerBonuses),
          guarantee: offerGuarantee,
        },
        brand: {
          guidelines: brandGuidelines,
        },
        applyDidaticaV2,
      },
      mode,
    )
    return filled
  }, [
    language,
    funnelName,
    funnelType,
    tone,
    style,
    productName,
    productPrice,
    productCategory,
    productBenefits,
    productUniques,
    audienceWho,
    audiencePains,
    audienceObjections,
    offerPromise,
    offerBonuses,
    offerGuarantee,
    brandGuidelines,
    applyDidaticaV2,
    mode,
  ])

  function copyToClipboard() {
    navigator.clipboard.writeText(prompt).then(() => {
      toast({
        title: "Prompt copiado",
        description: "Cole diretamente no v0.dev",
      })
    })
  }

  function downloadTxt() {
    const blob = new Blob([prompt], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `prompt-${funnelType}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Gerador de Prompt v2 — Funis (LP / Checkout / LP+VSL+Checkout)</h1>
          <p className="text-sm text-muted-foreground">
            Modo {mode === "filled" ? "Preenchido" : "Template"} • Blocos:{" "}
            <span className="font-mono">{JSON.stringify(blocks)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={downloadTxt}>
            <Download className="mr-2 h-4 w-4" />
            Baixar .txt
          </Button>
          <Button onClick={copyToClipboard}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar Prompt
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Linguagem</Label>
              <Input id="language" value={language} onChange={(e) => setLanguage(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="funnelName">Nome do funil</Label>
              <Input id="funnelName" value={funnelName} onChange={(e) => setFunnelName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tipo de funil</Label>
              <Select value={funnelType} onValueChange={(v) => setFunnelType(v as FunnelType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lp">lp</SelectItem>
                  <SelectItem value="checkout">checkout</SelectItem>
                  <SelectItem value="lp_vsl_checkout">lp_vsl_checkout</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone">Tom</Label>
              <Input id="tone" value={tone} onChange={(e) => setTone(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="style">Estilo</Label>
              <Input id="style" value={style} onChange={(e) => setStyle(e.target.value)} />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Produto — Nome</Label>
              <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productPrice">Produto — Preço</Label>
              <Input id="productPrice" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productCategory">Produto — Categoria</Label>
              <Input
                id="productCategory"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productBenefits">Benefícios (1 por linha)</Label>
              <Textarea
                id="productBenefits"
                value={productBenefits}
                onChange={(e) => setProductBenefits(e.target.value)}
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productUniques">Diferenciais (1 por linha)</Label>
              <Textarea
                id="productUniques"
                value={productUniques}
                onChange={(e) => setProductUniques(e.target.value)}
                rows={5}
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="audienceWho">Público — Quem</Label>
              <Input id="audienceWho" value={audienceWho} onChange={(e) => setAudienceWho(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="audiencePains">Dores (1 por linha)</Label>
              <Textarea
                id="audiencePains"
                value={audiencePains}
                onChange={(e) => setAudiencePains(e.target.value)}
                rows={5}
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="audienceObjections">Objeções (1 por linha)</Label>
              <Textarea
                id="audienceObjections"
                value={audienceObjections}
                onChange={(e) => setAudienceObjections(e.target.value)}
                rows={5}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="offerPromise">Promessa</Label>
              <Input id="offerPromise" value={offerPromise} onChange={(e) => setOfferPromise(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="offerBonuses">Bônus (1 por linha)</Label>
              <Textarea
                id="offerBonuses"
                value={offerBonuses}
                onChange={(e) => setOfferBonuses(e.target.value)}
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="offerGuarantee">Garantia</Label>
              <Input id="offerGuarantee" value={offerGuarantee} onChange={(e) => setOfferGuarantee(e.target.value)} />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="brandGuidelines">Guidelines da Marca</Label>
              <Textarea
                id="brandGuidelines"
                value={brandGuidelines}
                onChange={(e) => setBrandGuidelines(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                Aplicar Didática LP v2
              </Label>
              <div className="flex h-10 items-center gap-3">
                <Switch checked={applyDidaticaV2} onCheckedChange={setApplyDidaticaV2} />
                <span className="text-sm text-muted-foreground">Ative para reforçar a estrutura didática em LP</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Preview do Prompt</CardTitle>
          <Tabs value={mode} onValueChange={(v) => setMode(v as PreviewMode)}>
            <TabsList>
              <TabsTrigger value="filled">Preenchido</TabsTrigger>
              <TabsTrigger value="template">Template</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Textarea value={prompt} readOnly rows={22} className="font-mono text-sm" aria-label="Preview do prompt" />
        </CardContent>
      </Card>
    </main>
  )
}
