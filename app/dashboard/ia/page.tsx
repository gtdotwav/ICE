"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bot,
  Sparkles,
  Zap,
  FileText,
  ImageIcon,
  Code,
  Send,
  Copy,
  Download,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react"

const aiTools = [
  {
    id: "copywriter",
    name: "Copywriter IA",
    description: "Crie textos persuasivos para seus funis",
    icon: FileText,
    category: "Texto",
    popular: true,
  },
  {
    id: "designer",
    name: "Designer IA",
    description: "Gere imagens e designs profissionais",
    icon: ImageIcon,
    category: "Design",
    popular: false,
  },
  {
    id: "coder",
    name: "Desenvolvedor IA",
    description: "Gere códigos e automações",
    icon: Code,
    category: "Código",
    popular: true,
  },
  {
    id: "analyst",
    name: "Analista IA",
    description: "Análise de dados e insights",
    icon: TrendingUp,
    category: "Análise",
    popular: false,
  },
]

const recentGenerations = [
  {
    id: 1,
    tool: "Copywriter IA",
    title: "Headline para Landing Page",
    preview: "Transforme Visitantes em Clientes com o Funil Perfeito...",
    timestamp: "2 min atrás",
    status: "completed",
  },
  {
    id: 2,
    tool: "Designer IA",
    title: "Banner para Facebook Ads",
    preview: "Banner 1200x628 - Tema: Vendas Online",
    timestamp: "5 min atrás",
    status: "completed",
  },
  {
    id: 3,
    tool: "Copywriter IA",
    title: "Email de Follow-up",
    preview: "Assunto: Não perca esta oportunidade única...",
    timestamp: "10 min atrás",
    status: "processing",
  },
]

const templates = [
  {
    id: 1,
    name: "Landing Page Completa",
    description: "Headline, subheadline, benefícios e CTA",
    category: "Copywriting",
    uses: 1247,
  },
  {
    id: 2,
    name: "Sequência de Email",
    description: "5 emails de nutrição automática",
    category: "Email Marketing",
    uses: 892,
  },
  {
    id: 3,
    name: "Post para Redes Sociais",
    description: "Conteúdo engajador para Instagram/Facebook",
    category: "Social Media",
    uses: 2156,
  },
]

export default function IAPage() {
  const [selectedTool, setSelectedTool] = useState("copywriter")
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent(`# Resultado Gerado pela IA

**Baseado no seu prompt:** "${prompt}"

## Headline Principal
🚀 **Transforme Seus Visitantes em Clientes Pagantes em 24 Horas**

## Subheadline
Descubra o sistema comprovado que já ajudou mais de 10.000 empreendedores a criar funis de vendas que convertem automaticamente.

## Benefícios Principais
✅ **Aumento de 300% na conversão** - Técnicas testadas e aprovadas
✅ **Setup em menos de 1 hora** - Interface intuitiva e fácil
✅ **Suporte 24/7** - Time especializado sempre disponível
✅ **Garantia de 30 dias** - Risco zero para você

## Call-to-Action
**[QUERO COMEÇAR AGORA - 50% OFF]**

*Oferta limitada: Apenas para os primeiros 100 clientes*`)
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <DashboardHeader title="Inteligência Artificial" description="Potencialize seus funis com IA avançada" />

      <div className="grid gap-6 lg:grid-cols-4">
        {/* AI Tools Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-background/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Ferramentas IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiTools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? "secondary" : "ghost"}
                  className="w-full justify-start h-auto p-3 bg-white/5 hover:bg-white/10 transition-all duration-200"
                  onClick={() => setSelectedTool(tool.id)}
                >
                  <div className="flex items-start gap-3">
                    <tool.icon className="h-4 w-4 mt-0.5 text-primary" />
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{tool.name}</span>
                        {tool.popular && (
                          <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Quick Templates */}
          <Card className="bg-background/40 backdrop-blur-xl border-white/10 mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Templates Populares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{template.uses} usos</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="generate" className="space-y-6">
            <TabsList className="bg-background/40 backdrop-blur-xl border border-white/10">
              <TabsTrigger value="generate" className="data-[state=active]:bg-primary/20">
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Conteúdo
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-primary/20">
                <Clock className="h-4 w-4 mr-2" />
                Histórico
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6">
              {/* Generation Interface */}
              <Card className="bg-background/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Copywriter IA
                  </CardTitle>
                  <CardDescription>
                    Descreva o que você precisa e nossa IA criará o conteúdo perfeito para você
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descreva seu projeto</label>
                    <Textarea
                      placeholder="Ex: Preciso de uma headline para uma landing page de curso online sobre marketing digital. O público-alvo são empreendedores iniciantes que querem aumentar suas vendas..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px] bg-white/5 border-white/10 focus:border-primary/50"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || isGenerating}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Gerar Conteúdo
                        </>
                      )}
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles className="h-4 w-4" />
                      <span>Créditos restantes: 47</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generated Content */}
              {generatedContent && (
                <Card className="bg-background/40 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Conteúdo Gerado
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="bg-white/5 border-white/10">
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white/5 border-white/10">
                          <Download className="h-4 w-4 mr-2" />
                          Exportar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] w-full rounded-md border border-white/10 bg-white/5 p-4">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed">{generatedContent}</pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="bg-background/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle>Gerações Recentes</CardTitle>
                  <CardDescription>Acesse seus conteúdos gerados anteriormente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentGenerations.map((generation) => (
                      <div
                        key={generation.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{generation.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {generation.tool}
                            </Badge>
                            {generation.status === "completed" ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{generation.preview}</p>
                          <span className="text-xs text-muted-foreground">{generation.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
