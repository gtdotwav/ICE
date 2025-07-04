"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Bot,
  Sparkles,
  FileText,
  ImageIcon,
  Video,
  Mail,
  MessageSquare,
  TrendingUp,
  Zap,
  Download,
  Copy,
  Star,
  Send,
  Search,
  CreditCard,
  Gift,
  Crown,
  Info,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

const aiTools = [
  {
    id: "copywriter",
    name: "Copywriter IA",
    description: "Gere textos persuasivos para seus funis",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/20",
    category: "Conteúdo",
    credits: 10,
    examples: ["Headlines", "Descrições de produto", "Emails de vendas"],
  },
  {
    id: "image-generator",
    name: "Gerador de Imagens",
    description: "Crie imagens únicas para suas campanhas",
    icon: ImageIcon,
    color: "text-purple-500",
    bgColor: "bg-purple-500/20",
    category: "Visual",
    credits: 25,
    examples: ["Banners", "Posts sociais", "Logos"],
  },
  {
    id: "video-creator",
    name: "Criador de Vídeos",
    description: "Produza vídeos promocionais automaticamente",
    icon: Video,
    color: "text-red-500",
    bgColor: "bg-red-500/20",
    category: "Visual",
    credits: 50,
    examples: ["Vídeos de vendas", "Tutoriais", "Anúncios"],
  },
  {
    id: "email-optimizer",
    name: "Otimizador de Email",
    description: "Melhore suas campanhas de email marketing",
    icon: Mail,
    color: "text-green-500",
    bgColor: "bg-green-500/20",
    category: "Marketing",
    credits: 15,
    examples: ["Subject lines", "Sequências", "Newsletters"],
  },
  {
    id: "chatbot",
    name: "Chatbot Inteligente",
    description: "Automatize o atendimento ao cliente",
    icon: MessageSquare,
    color: "text-orange-500",
    bgColor: "bg-orange-500/20",
    category: "Automação",
    credits: 20,
    examples: ["FAQ automático", "Suporte 24/7", "Qualificação de leads"],
  },
  {
    id: "analytics",
    name: "Análise Preditiva",
    description: "Preveja tendências e comportamentos",
    icon: TrendingUp,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/20",
    category: "Analytics",
    credits: 30,
    examples: ["Previsão de vendas", "Análise de comportamento", "Otimização de campanhas"],
  },
]

const creditPackages = [
  {
    id: "starter",
    name: "Pacote Iniciante",
    credits: 100,
    price: 29,
    originalPrice: 39,
    popular: false,
    description: "Perfeito para começar",
    features: ["100 créditos", "Válido por 30 dias", "Suporte por email", "Acesso a todas as ferramentas"],
    savings: "Economize R$ 10",
  },
  {
    id: "professional",
    name: "Pacote Profissional",
    credits: 500,
    price: 99,
    originalPrice: 149,
    popular: true,
    description: "Ideal para negócios em crescimento",
    features: ["500 créditos", "Válido por 60 dias", "Suporte prioritário", "Templates premium", "Análises avançadas"],
    savings: "Economize R$ 50",
  },
  {
    id: "enterprise",
    name: "Pacote Empresarial",
    credits: 1500,
    price: 249,
    originalPrice: 399,
    popular: false,
    description: "Para empresas e agências",
    features: ["1500 créditos", "Válido por 90 dias", "Suporte dedicado", "API personalizada", "Treinamento incluído"],
    savings: "Economize R$ 150",
  },
]

const templates = [
  {
    id: 1,
    name: "Email de Boas-vindas",
    description: "Template para novos subscribers",
    category: "Email Marketing",
    uses: 1250,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Landing Page de Conversão",
    description: "Página otimizada para vendas",
    category: "Landing Pages",
    uses: 890,
    rating: 4.9,
  },
  {
    id: 3,
    name: "Sequência de Abandono",
    description: "Recupere carrinho abandonado",
    category: "Automação",
    uses: 650,
    rating: 4.7,
  },
]

const recentGenerations = [
  {
    id: 1,
    tool: "Copywriter IA",
    content: "Headline para landing page de curso online",
    timestamp: "2 min atrás",
    status: "completed",
  },
  {
    id: 2,
    tool: "Gerador de Imagens",
    content: "Banner promocional para Black Friday",
    timestamp: "15 min atrás",
    status: "completed",
  },
  {
    id: 3,
    tool: "Email Optimizer",
    content: "Subject line para newsletter semanal",
    timestamp: "1 hora atrás",
    status: "processing",
  },
]

export default function IAPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [credits] = useState(247)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [showCreditDialog, setShowCreditDialog] = useState(false)

  const categories = ["Todos", "Conteúdo", "Visual", "Marketing", "Automação", "Analytics"]

  const filteredTools = aiTools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleGenerate = async () => {
    if (!selectedTool || !prompt.trim()) return

    setIsGenerating(true)
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGenerating(false)
    setPrompt("")
  }

  const selectedToolData = selectedTool ? aiTools.find((t) => t.id === selectedTool) : null
  const canAfford = selectedToolData ? credits >= selectedToolData.credits : false

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Inteligência Artificial</h1>
            <p className="text-muted-foreground">Ferramentas de IA para otimizar seus funis e campanhas</p>
          </div>
          <Dialog open={showCreditDialog} onOpenChange={setShowCreditDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="glass-button bg-transparent">
                <CreditCard className="h-4 w-4 mr-2" />
                Comprar Créditos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl glass-card">
              <DialogHeader>
                <DialogTitle className="gradient-text text-2xl flex items-center gap-2">
                  <Sparkles className="h-6 w-6" />
                  Como Funcionam os Créditos IA
                </DialogTitle>
                <DialogDescription className="text-base">
                  Entenda nosso sistema de créditos e escolha o melhor pacote para suas necessidades
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* How Credits Work */}
                <div className="glass-card p-4 space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-500" />
                    Como Funcionam os Créditos?
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <FileText className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Texto (10 créditos)</h4>
                        <p className="text-xs text-muted-foreground">Headlines, emails, descrições</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <ImageIcon className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Imagem (25 créditos)</h4>
                        <p className="text-xs text-muted-foreground">Banners, logos, posts sociais</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-red-500/20">
                        <Video className="h-4 w-4 text-red-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Vídeo (50 créditos)</h4>
                        <p className="text-xs text-muted-foreground">Vídeos promocionais, tutoriais</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-green-500/20">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Análise (30 créditos)</h4>
                        <p className="text-xs text-muted-foreground">Insights, previsões, otimizações</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credit Packages */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Gift className="h-5 w-5 text-green-500" />
                    Escolha Seu Pacote
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {creditPackages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`relative p-4 rounded-xl border transition-all duration-200 hover:scale-105 ${
                          pkg.popular
                            ? "border-primary bg-primary/5 shadow-lg"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <Badge className="bg-primary text-primary-foreground px-3 py-1">
                              <Crown className="h-3 w-3 mr-1" />
                              Mais Popular
                            </Badge>
                          </div>
                        )}

                        <div className="text-center space-y-3">
                          <h4 className="font-semibold">{pkg.name}</h4>
                          <div className="space-y-1">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-2xl font-bold gradient-text">R$ {pkg.price}</span>
                              <span className="text-sm text-muted-foreground line-through">R$ {pkg.originalPrice}</span>
                            </div>
                            <p className="text-xs text-green-400">{pkg.savings}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{pkg.description}</p>

                          <div className="space-y-2">
                            {pkg.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>

                          <Button
                            className={`w-full ${pkg.popular ? "bg-primary hover:bg-primary/90" : "glass-button"}`}
                          >
                            Comprar {pkg.credits} Créditos
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="glass-card p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    Vantagens dos Nossos Créditos
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Nunca expiram (enquanto sua conta estiver ativa)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Acesso a todas as ferramentas IA</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Gerações ilimitadas por dia</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Suporte técnico incluído</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Credits & Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Créditos Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold gradient-primary">{credits}</div>
              {credits < 50 && <AlertCircle className="h-5 w-5 text-yellow-500" />}
            </div>
            <Progress value={(credits / 500) * 100} className="mt-2 h-2" />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                {credits < 50 ? "Créditos baixos" : "Créditos suficientes"}
              </p>
              <Button variant="ghost" size="sm" className="text-xs h-6 px-2" onClick={() => setShowCreditDialog(true)}>
                Comprar +
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gerações Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">24</div>
            <p className="text-xs text-green-400 mt-1">+12% vs ontem</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Economizado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">8.5h</div>
            <p className="text-xs text-muted-foreground mt-1">Esta semana</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">94%</div>
            <p className="text-xs text-green-400 mt-1">Gerações aprovadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tools Sidebar */}
        <Card className="glass-card lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="gradient-text flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Ferramentas IA
              </CardTitle>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                {filteredTools.length}
              </Badge>
            </div>
            <CardDescription>Selecione uma ferramenta para começar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search & Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar ferramentas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-input"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`text-xs ${
                      selectedCategory === category ? "bg-primary text-primary-foreground" : "glass-button"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Tools List */}
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {filteredTools.map((tool, index) => (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? "default" : "ghost"}
                    className={`w-full justify-start p-4 h-auto transition-all duration-200 animate-slide-up ${
                      selectedTool === tool.id
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "hover:bg-white/10"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setSelectedTool(tool.id)}
                  >
                    <div className={`p-2 rounded-lg ${tool.bgColor} ${tool.color} mr-3`}>
                      <tool.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{tool.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{tool.description}</div>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          {tool.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-muted-foreground">{tool.credits}</span>
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Workspace */}
        <div className="lg:col-span-2 space-y-6">
          {/* Generation Interface */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                {selectedToolData ? selectedToolData.name : "Selecione uma Ferramenta"}
              </CardTitle>
              <CardDescription>
                {selectedToolData
                  ? selectedToolData.description
                  : "Escolha uma ferramenta IA para começar a gerar conteúdo"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedToolData ? (
                <>
                  {/* Tool Examples */}
                  <div className="glass-card p-3 space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      Exemplos do que você pode criar:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedToolData.examples.map((example, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descreva o que você precisa</label>
                    <Textarea
                      placeholder="Ex: Crie um headline persuasivo para uma landing page de curso de marketing digital..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[100px] glass-input resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-muted-foreground">Custo:</span>
                        <span className={canAfford ? "text-green-400" : "text-red-400"}>
                          {selectedToolData.credits} créditos
                        </span>
                      </div>
                      {!canAfford && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 px-2 text-primary"
                          onClick={() => setShowCreditDialog(true)}
                        >
                          Comprar créditos
                        </Button>
                      )}
                    </div>
                    <Button
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || isGenerating || !canAfford}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Gerar Conteúdo
                        </>
                      )}
                    </Button>
                  </div>

                  {isGenerating && (
                    <div className="space-y-3 p-4 glass-card animate-fade-in">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                        <span className="text-sm">Processando sua solicitação...</span>
                      </div>
                      <Progress value={33} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Isso pode levar alguns segundos. Nossa IA está trabalhando para você!
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Nenhuma ferramenta selecionada</h3>
                  <p className="text-sm text-muted-foreground">
                    Escolha uma ferramenta IA na barra lateral para começar
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabs for Templates and History */}
          <Tabs defaultValue="templates" className="space-y-4">
            <TabsList className="glass-card">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="templates">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="gradient-text">Biblioteca de Templates</CardTitle>
                  <CardDescription>Templates prontos para acelerar sua criação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {templates.map((template, index) => (
                      <div
                        key={template.id}
                        className="p-4 glass-card-hover cursor-pointer animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{template.name}</h4>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-muted-foreground">{template.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{template.uses} usos</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="gradient-text">Histórico de Gerações</CardTitle>
                  <CardDescription>Suas gerações recentes e resultados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentGenerations.map((generation, index) => (
                      <div
                        key={generation.id}
                        className="flex items-center justify-between p-4 glass-card-hover animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{generation.tool}</h4>
                            <Badge
                              variant={generation.status === "completed" ? "default" : "secondary"}
                              className={`text-xs ${
                                generation.status === "completed"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {generation.status === "completed" ? "Concluído" : "Processando"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{generation.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">{generation.timestamp}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-3 w-3" />
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
