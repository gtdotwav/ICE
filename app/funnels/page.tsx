"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { RAW_PROMPT, buildFilledPrompt, computeBlocks, type FunnelType } from "@/components/funnel-prompt/prompt-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

type StrDict = Record<string, string>

export default function FunnelsBuilderPage() {
  const { toast } = useToast()

  const [language, setLanguage] = useState("pt-BR")
  const [funnelName, setFunnelName] = useState("LP de Oferta Principal")
  const [funnelType, setFunnelType] = useState<FunnelType>("lp")
  const [tone, setTone] = useState("Direto e confiante")
  const [style, setStyle] = useState("Clássico limpo")

  const [product, setProduct] = useState<StrDict>({
    name: "Curso de Copywriting",
    price: "R$ 497,00",
    category: "Educação",
    benefits: "- Acelere sua escrita\n- Estruture páginas de alta conversão\n- Exemplos práticos",
    uniques: "- Método em 3 passos\n- Templates prontos\n- Suporte por 30 dias",
  })
  const [audience, setAudience] = useState<StrDict>({
    who: "Profissionais de marketing e infoprodutores iniciantes",
    pains: "- Página não converte\n- Dificuldade em escrever\n- Falta de método",
    objections: "- “Não sei se vou conseguir aplicar”\n- “Já tentei antes e não funcionou”",
  })
  const [offer, setOffer] = useState<StrDict>({
    promise: "Escreva sua página que vende em 48h, passo a passo",
    bonuses: "- Checklist de revisão\n- Biblioteca de headlines\n- Acesso a comunidade (30 dias)",
    guarantee: "Garantia incondicional de 7 dias",
  })
  const [brand, setBrand] = useState<StrDict>({
    guidelines: "Tom humano, focado em clareza e prova. Evitar jargões.",
  })

  const blocks = useMemo(() => computeBlocks(funnelType), [funnelType])

  const filledPrompt = useMemo(
    () =>
      buildFilledPrompt({
        language,
        funnelName,
        funnelType,
        tone,
        style,
        product: product as any,
        audience: audience as any,
        offer: offer as any,
        brand: brand as any,
      }),
    [language, funnelName, funnelType, tone, style, product, audience, offer, brand],
  )

  async function copy(text: string, label: string) {
    await navigator.clipboard.writeText(text)
    toast({ title: "Copiado", description: `${label} copiado para a área de transferência.` })
  }

  async function sendToN8n() {
    try {
      const res = await fetch("/api/funnels/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          funnelName,
          funnelType,
          language,
          tone,
          style,
          product,
          audience,
          offer,
          brand,
          blocks,
          prompt: filledPrompt,
        }),
      })
      const text = await res.text()
      if (!res.ok) throw new Error(text || "Erro ao enviar para n8n")
      toast({ title: "Enviado ao n8n", description: "Solicitação encaminhada com sucesso." })
      console.log("n8n response:", text)
    } catch (err: any) {
      toast({ title: "Falha no envio", description: err?.message || "Erro desconhecido" })
    }
  }

  return (
    <main className="container mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Builder de Prompt • Funis</h1>
        <p className="text-muted-foreground">
          Preencha as variáveis, copie o prompt ou envie para o n8n. A página usa o forwarder seguro e já está
          integrada.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Variáveis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="funnelName">Nome do Funil</Label>
                <Input id="funnelName" value={funnelName} onChange={(e) => setFunnelName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Funil</Label>
                <Select value={funnelType} onValueChange={(v) => setFunnelType(v as FunnelType)}>
                  <SelectTrigger aria-label="Tipo de funil">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lp">lp</SelectItem>
                    <SelectItem value="checkout">checkout</SelectItem>
                    <SelectItem value="lp_vsl_checkout">lp_vsl_checkout</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Input id="language" value={language} onChange={(e) => setLanguage(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone">Tom</Label>
                <Input id="tone" value={tone} onChange={(e) => setTone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="style">Estilo</Label>
                <Input id="style" value={style} onChange={(e) => setStyle(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pname">Produto • Nome</Label>
                <Input
                  id="pname"
                  value={product.name}
                  onChange={(e) => setProduct((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pprice">Produto • Preço</Label>
                <Input
                  id="pprice"
                  value={product.price}
                  onChange={(e) => setProduct((p) => ({ ...p, price: e.target.value }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="pcat">Produto • Categoria</Label>
                <Input
                  id="pcat"
                  value={product.category}
                  onChange={(e) => setProduct((p) => ({ ...p, category: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pbenefits">Benefícios (bullets)</Label>
                <Textarea
                  id="pbenefits"
                  className="min-h-[120px]"
                  value={product.benefits}
                  onChange={(e) => setProduct((p) => ({ ...p, benefits: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="punique">Diferenciais (bullets)</Label>
                <Textarea
                  id="punique"
                  className="min-h-[120px]"
                  value={product.uniques}
                  onChange={(e) => setProduct((p) => ({ ...p, uniques: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="awho">Público • Quem</Label>
                <Textarea
                  id="awho"
                  className="min-h-[80px]"
                  value={audience.who}
                  onChange={(e) => setAudience((a) => ({ ...a, who: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apains">Público • Dores</Label>
                <Textarea
                  id="apains"
                  className="min-h-[80px]"
                  value={audience.pains}
                  onChange={(e) => setAudience((a) => ({ ...a, pains: e.target.value }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="aobj">Público • Objeções</Label>
                <Textarea
                  id="aobj"
                  className="min-h-[80px]"
                  value={audience.objections}
                  onChange={(e) => setAudience((a) => ({ ...a, objections: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="opromise">Oferta • Promessa</Label>
                <Textarea
                  id="opromise"
                  className="min-h-[80px]"
                  value={offer.promise}
                  onChange={(e) => setOffer((o) => ({ ...o, promise: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="obonuses">Oferta • Bônus (bullets)</Label>
                <Textarea
                  id="obonuses"
                  className="min-h-[80px]"
                  value={offer.bonuses}
                  onChange={(e) => setOffer((o) => ({ ...o, bonuses: e.target.value }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="oguarantee">Oferta • Garantia</Label>
                <Input
                  id="oguarantee"
                  value={offer.guarantee}
                  onChange={(e) => setOffer((o) => ({ ...o, guarantee: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bguidelines">Diretrizes de Marca</Label>
              <Textarea
                id="bguidelines"
                className="min-h-[80px]"
                value={brand.guidelines}
                onChange={(e) => setBrand((b) => ({ ...b, guidelines: e.target.value }))}
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={() => copy(RAW_PROMPT, "Prompt com placeholders")}>Copiar Prompt (placeholders)</Button>
              <Button variant="outline" onClick={() => copy(filledPrompt, "Prompt preenchido")}>
                Copiar Prompt (preenchido)
              </Button>
              <Button variant="secondary" onClick={sendToN8n} data-analytics="cta_primary">
                Enviar ao n8n
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blocos ({funnelType})</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {blocks.map((b) => (
                  <li key={b} className="text-muted-foreground">
                    {b}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="filled">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="filled">Preenchido</TabsTrigger>
                  <TabsTrigger value="raw">Bruto</TabsTrigger>
                </TabsList>
                <TabsContent value="filled" className="mt-3">
                  <Textarea className="min-h-[280px] font-mono text-sm" value={filledPrompt} readOnly />
                </TabsContent>
                <TabsContent value="raw" className="mt-3">
                  <Textarea className="min-h-[280px] font-mono text-sm" value={RAW_PROMPT} readOnly />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>v0.dev (screenshot)</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <Image
                src="https://sjc.microlink.io/DALgH5-uN2OXcUZH93wwM17XGGKo0Td8oHHDHnHsAlTSoXRGhboRsubVu9q-8f1tWKwm2Y7kI9vvNDRgjFuLDw.jpeg"
                alt="Screenshot da homepage do v0.dev"
                width={600}
                height={330}
                className="rounded-md border"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Copie o prompt e cole no v0.dev para gerar a página. Em alternativa, use “Enviar ao n8n”.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
