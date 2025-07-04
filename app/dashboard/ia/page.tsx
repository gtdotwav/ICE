"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
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
  Star,
  Users,
  Lightbulb,
} from "lucide-react"

const aiTools = [
  {
    id: "copywriter",
    name: "Copywriter IA",
    description: "Crie textos persuasivos para seus funis",
    icon: FileText,
    category: "Texto",
    popular: true,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "designer",
    name: "Designer IA",
    description: "Gere imagens e designs profissionais",
    icon: ImageIcon,
    category: "Design",
    popular: false,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "coder",
    name: "Desenvolvedor IA",
    description: "Gere códigos e automações",
    icon: Code,
    category: "Código",
    popular: true,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    id: "analyst",
    name: "Analista IA",
    description: "Análise de dados e insights",
    icon: TrendingUp,
    category: "Análise",
    popular: false,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
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
    rating: 5,
  },
  {
    id: 2,
    tool: "Designer IA",
    title: "Banner para Facebook Ads",
    preview: "Banner 1200x628 - Tema: Vendas Online",
    timestamp: "5 min atrás",
    status: "completed",
    rating: 4,
  },
  {
    id: 3,
    tool: "Copywriter IA",
    title: "Email de Follow-up",
    preview: "Assunto: Não perca esta oportunidade única...",
    timestamp: "10 min atrás",
    status: "processing",
    rating: null,
  },
]

const templates = [
  {
    id: 1,
    name: "Landing Page Completa",
    description: "Headline, subheadline, benefícios e CTA",
    category: "Copywriting",
    uses: 1247,
    rating: 4.8,
    icon: FileText,
  },
  {
    id: 2,
    name: "Sequência de Email",
    description: "5 emails de nutrição automática",
    category: "Email Marketing",
    uses: 892,
    rating: 4.6,
    icon: Zap,
  },
  {
    id: 3,
    name: "Post para Redes Sociais",
    description: "Conteúdo engajador para Instagram/Facebook",
    category: "Social Media",
    uses: 2156,
    rating: 4.9,
    icon: Users,
  },
]

export default function IAPage() {
  const [selectedTool, setSelectedTool] = useState("copywriter")
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [generationProgress, setGenerationProgress] = useState(0)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate AI generation with progress
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
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

*Oferta limitada: Apenas para os primeiros 100 clientes*

## Elementos Adicionais
- **Prova Social**: "Mais de 10.000 clientes satisfeitos"
- **Urgência**: "Oferta válida até meia-noite"
- **Garantia**: "30 dias ou seu dinheiro de volta"`)
          setIsGenerating(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const selectedToolData = aiTools.find((tool) => tool.id === selectedTool)

  return (
    <div className="content-spacing">
      <DashboardHeader
        title="Inteligência Artificial"
        description="Potencialize seus funis com IA avançada"
        action={{
          label: "Novo Projeto",
          onClick: () => console.log("Novo projeto"),
        }}
      />

      <div className="grid gap-6 lg:grid-cols-4">
        {/* AI Tools Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="h-5 w-5 text-primary" />
                Ferramentas IA
              </CardTitle>
              <CardDescription>Escolha a ferramenta ideal para seu projeto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiTools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? "secondary" : "ghost"}
                  className={`w-full justify-start h-auto p-4 glass-button transition-all duration-200 ${
                    selectedTool === tool.id ? "bg-primary/20 border border-primary/30" : ""
                  }`}
                  onClick={() => setSelectedTool(tool.id)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div
                      className={`p-2 rounded-lg ${tool.bgColor} group-hover:scale-110 transition-transform duration-200`}
                    >
                      <tool.icon className={`h-4 w-4 ${tool.color}`} />
                    </div>
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{tool.name}</span>
                        {tool.popular && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-primary/20 text-primary border border-primary/30"
                          >
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
                      <Badge variant="outline" className="text-xs mt-2">
                        {tool.category}
                      </Badge>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Quick Templates */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Templates Populares
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-3 rounded-lg glass-button hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <template.icon className="h-4 w-4 text-primary mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{template.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-muted-foreground">{template.rating}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{template.uses.toLocaleString()} usos</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="generate" className="space-y-6">
            <TabsList className="glass-card h-12 p-1">
              <TabsTrigger value="generate" className="data-[state=active]:bg-primary/20 h-10 px-6">
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Conteúdo
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-primary/20 h-10 px-6">
                <Clock className="h-4 w-4 mr-2" />
                Histórico
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6">
              {/* Generation Interface */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className={`p-2 rounded-lg ${selectedToolData?.bgColor}`}>
                      {selectedToolData && <selectedToolData.icon className={`h-5 w-5 ${selectedToolData.color}`} />}
                    </div>
                    {selectedToolData?.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    Descreva detalhadamente o que você precisa e nossa IA criará o conteúdo perfeito para você
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Descreva seu projeto
                    </label>
                    <Textarea
                      placeholder="Ex: Preciso de uma headline para uma landing page de curso online sobre marketing digital. O público-alvo são empreendedores iniciantes que querem aumentar suas vendas. O curso custa R$ 497 e tem garantia de 30 dias..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[140px] glass-input text-base leading-relaxed resize-none"
                    />
                  </div>

                  {isGenerating && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Gerando conteúdo...</span>
                        <span className="font-medium">{generationProgress}%</span>
                      </div>
                      <Progress value={generationProgress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Button
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || isGenerating}
                      className="bg-primary hover:bg-primary/90 h-12 px-8 text-base"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-3" />
                          Gerar Conteúdo
                        </>
                      )}
                    </Button>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>
                          Créditos restantes: <strong className="text-foreground">47</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generated Content */}
              {generatedContent && (
                <Card className="glass-card animate-slide-up">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        Conteúdo Gerado
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="glass-button h-10 bg-transparent">
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar
                        </Button>
                        <Button variant="outline" size="sm" className="glass-button h-10 bg-transparent">
                          <Download className="h-4 w-4 mr-2" />
                          Exportar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px] w-full rounded-lg border border-white/10 glass-input p-6">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">{generatedContent}</pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xl">Gerações Recentes</CardTitle>
                  <CardDescription>Acesse e gerencie seus conteúdos gerados anteriormente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentGenerations.map((generation) => (
                      <div
                        key={generation.id}
                        className="flex items-center justify-between p-4 rounded-lg glass-button hover:bg-white/10 transition-all duration-200 group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{generation.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {generation.tool}
                            </Badge>
                            {generation.status === "completed" ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{generation.preview}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {generation.timestamp}
                            </span>
                            {generation.rating && (
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < generation.rating ? "text-yellow-400 fill-current" : "text-gray-400"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
