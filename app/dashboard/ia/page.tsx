"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { AIAutomationForm } from "@/components/dashboard/ia/ai-automation-form"
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
  Wand2,
  Palette,
  PlayCircle,
  AtSign,
  Brain,
  BarChart3,
} from "lucide-react"

const aiTools = [
  {
    id: "copywriter",
    name: "Copywriter IA",
    description: "Gere textos persuasivos para seus funis",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/30",
    hoverColor: "hover:bg-blue-500/30",
    category: "Conteúdo",
    credits: 10,
    examples: ["Headlines", "Descrições de produto", "Emails de vendas"],
    estimatedTime: "30-60s",
    popularity: 95,
  },
  {
    id: "image-generator",
    name: "Gerador de Imagens",
    description: "Crie imagens únicas para suas campanhas",
    icon: ImageIcon,
    color: "text-purple-500",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/30",
    hoverColor: "hover:bg-purple-500/30",
    category: "Visual",
    credits: 25,
    examples: ["Banners", "Posts sociais", "Logos"],
    estimatedTime: "2-3min",
    popularity: 88,
  },
  {
    id: "video-creator",
    name: "Criador de Vídeos",
    description: "Produza vídeos promocionais automaticamente",
    icon: Video,
    color: "text-red-500",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30",
    hoverColor: "hover:bg-red-500/30",
    category: "Visual",
    credits: 50,
    examples: ["Vídeos de vendas", "Tutoriais", "Anúncios"],
    estimatedTime: "5-10min",
    popularity: 76,
  },
  {
    id: "email-optimizer",
    name: "Otimizador de Email",
    description: "Melhore suas campanhas de email marketing",
    icon: Mail,
    color: "text-green-500",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30",
    hoverColor: "hover:bg-green-500/30",
    category: "Marketing",
    credits: 15,
    examples: ["Subject lines", "Sequências", "Newsletters"],
    estimatedTime: "1-2min",
    popularity: 82,
  },
  {
    id: "chatbot",
    name: "Chatbot Inteligente",
    description: "Automatize o atendimento ao cliente",
    icon: MessageSquare,
    color: "text-orange-500",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500/30",
    hoverColor: "hover:bg-orange-500/30",
    category: "Automação",
    credits: 20,
    examples: ["FAQ automático", "Suporte 24/7", "Qualificação de leads"],
    estimatedTime: "3-5min",
    popularity: 71,
  },
  {
    id: "analytics",
    name: "Análise Preditiva",
    description: "Preveja tendências e comportamentos",
    icon: TrendingUp,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/20",
    borderColor: "border-indigo-500/30",
    hoverColor: "hover:bg-indigo-500/30",
    category: "Analytics",
    credits: 30,
    examples: ["Previsão de vendas", "Análise de comportamento", "Otimização de campanhas"],
    estimatedTime: "2-4min",
    popularity: 79,
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
  const [showAutomationForm, setShowAutomationForm] = useState(false)
  const [automationType, setAutomationType] = useState<'copywriter' | 'images' | 'videos' | 'email'>('copywriter')
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

    // Abrir formulário de automação baseado na ferramenta selecionada
    const toolTypeMap: Record<string, 'copywriter' | 'images' | 'videos' | 'email'> = {
      'copywriter': 'copywriter',
      'image-generator': 'images',
      'video-creator': 'videos',
      'email-optimizer': 'email'
    }
    
    const type = toolTypeMap[selectedTool]
    if (type) {
      setAutomationType(type)
      setShowAutomationForm(true)
    }
  }

  const selectedToolData = selectedTool ? aiTools.find((t) => t.id === selectedTool) : null
  const canAfford = selectedToolData ? credits >= selectedToolData.credits : false

  const getPlaceholderByType = (toolId: string): string => {
    switch (toolId) {
      case 'copywriter':
        return 'Crie um headline persuasivo para um curso de marketing digital para iniciantes'
      case 'image-generator':
        return 'Banner promocional para Black Friday com cores vibrantes e call-to-action'
      case 'video-creator':
        return 'Vídeo promocional de 30 segundos para lançamento de produto'
      case 'email-optimizer':
        return 'Subject line para newsletter semanal sobre dicas de vendas'
      default:
        return 'Descreva o que você precisa...'
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Inteligência Artificial
                </h1>
                <p className="text-lg text-muted-foreground">Ferramentas de IA para otimizar seus funis e campanhas</p>
              </div>
            </div>
          </div>
          <Dialog open={showCreditDialog} onOpenChange={setShowCreditDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="glass-button bg-transparent hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Comprar Créditos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl glass-card border-primary/20 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="gradient-text text-3xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  Como Funcionam os Créditos IA
                </DialogTitle>
                <DialogDescription className="text-lg text-muted-foreground">
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
        </motion.div>
      </div>

      {/* Credits & Stats */}
      <motion.div 
        className="grid gap-6 md:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glass-card-hover group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
              <div className="p-1.5 rounded-lg bg-yellow-500/20 group-hover:bg-yellow-500/30 transition-colors">
                <Zap className="h-4 w-4 text-yellow-500" />
              </div>
              Créditos Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
                {credits}
              </div>
              {credits < 50 && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                </motion.div>
              )}
            </div>
            <Progress value={(credits / 500) * 100} className="mt-3 h-3" />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                {credits < 50 ? "Créditos baixos" : "Créditos suficientes"}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-6 px-2 hover:bg-primary/20 hover:text-primary transition-all" 
                onClick={() => setShowCreditDialog(true)}
              >
                Comprar +
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card-hover group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
              <div className="p-1.5 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </div>
              Gerações Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">24</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <p className="text-xs text-green-400">+12% vs ontem</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card-hover group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
              <div className="p-1.5 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                <Clock className="h-4 w-4 text-green-500" />
              </div>
              Tempo Economizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">8.5h</div>
            <p className="text-xs text-muted-foreground mt-1">Esta semana</p>
          </CardContent>
        </Card>

        <Card className="glass-card-hover group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
              <div className="p-1.5 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                <Star className="h-4 w-4 text-purple-500" />
              </div>
              Taxa de Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">94%</div>
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <p className="text-xs text-green-400">Gerações aprovadas</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="grid gap-8 lg:grid-cols-3"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* Tools Sidebar */}
        <Card className="glass-card lg:col-span-1 border-primary/20 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="gradient-text flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                Ferramentas IA
              </CardTitle>
              <Badge variant="secondary" className="bg-primary/20 text-primary border border-primary/30 px-3 py-1">
                {filteredTools.length}
              </Badge>
            </div>
            <CardDescription className="text-base">Selecione uma ferramenta para começar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search & Filter */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/60" />
                <Input
                  placeholder="Buscar ferramentas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-input border-primary/20 focus:border-primary/50 transition-all duration-300"
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
                      selectedCategory === category 
                        ? "bg-primary text-primary-foreground shadow-lg scale-105" 
                        : "glass-button hover:scale-105 hover:bg-primary/10"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {/* Tools List */}
            <ScrollArea className="h-[500px] pr-2">
              <div className="space-y-3">
                {filteredTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start p-0 h-auto transition-all duration-300 group ${
                        selectedTool === tool.id ? "scale-105" : "hover:scale-102"
                      }`}
                      onClick={() => setSelectedTool(tool.id)}
                    >
                      <div className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedTool === tool.id
                          ? `${tool.bgColor} ${tool.borderColor} shadow-lg`
                          : `border-white/10 hover:border-primary/20 ${tool.hoverColor}`
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-3 rounded-xl ${tool.bgColor} ${tool.color} border ${tool.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                            <tool.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 text-left space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-sm">{tool.name}</h3>
                              <div className="flex items-center gap-1">
                                <Zap className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs font-medium text-muted-foreground">{tool.credits}</span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {tool.category}
                              </Badge>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{tool.estimatedTime}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="flex-1 bg-white/10 rounded-full h-1">
                                <div 
                                  className="bg-gradient-to-r from-primary to-purple-400 h-1 rounded-full transition-all duration-500"
                                  style={{ width: `${tool.popularity}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{tool.popularity}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Workspace */}
        <div className="lg:col-span-2 space-y-6">
          {/* Generation Interface */}
          <Card className="glass-card border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="gradient-text flex items-center gap-3 text-xl">
                {selectedToolData ? (
                  <>
                    <div className={`p-2 rounded-lg ${selectedToolData.bgColor} border ${selectedToolData.borderColor}`}>
                      <selectedToolData.icon className={`h-5 w-5 ${selectedToolData.color}`} />
                    </div>
                    {selectedToolData.name}
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      IA Avançada
                    </Badge>
                  </>
                ) : (
                  <>
                    <div className="p-2 rounded-lg bg-muted/20 border border-muted">
                      <Wand2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    Selecione uma Ferramenta
                  </>
                )}
              </CardTitle>
              <CardDescription className="text-base">
                {selectedToolData
                  ? selectedToolData.description
                  : "Escolha uma ferramenta IA para começar a gerar conteúdo"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedToolData ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Tool Examples */}
                  <div className="glass-card p-4 space-y-3 border border-blue-500/20">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-500/20">
                        <Info className="h-4 w-4 text-blue-500" />
                      </div>
                      Exemplos do que você pode criar:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedToolData.examples.map((example, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs hover:bg-primary/10 transition-colors cursor-default"
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Tempo estimado: {selectedToolData.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{selectedToolData.popularity}% de aprovação</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Descreva o que você precisa
                    </label>
                    <Textarea
                      placeholder={`Ex: ${getPlaceholderByType(selectedToolData.id)}`}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px] glass-input resize-none border-primary/20 focus:border-primary/50 transition-all duration-300"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{prompt.length} caracteres</span>
                      <span>Seja específico para melhores resultados</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 glass-card border border-primary/20">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-yellow-500/20">
                          <Zap className="h-4 w-4 text-yellow-500" />
                        </div>
                        <span className="text-muted-foreground font-medium">Custo:</span>
                        <span className={`font-bold ${canAfford ? "text-green-400" : "text-red-400"}`}>
                          {selectedToolData.credits} créditos
                        </span>
                      </div>
                      {!canAfford && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 px-3 text-primary hover:bg-primary/20 transition-all"
                          onClick={() => setShowCreditDialog(true)}
                        >
                          Comprar créditos
                        </Button>
                      )}
                    </div>
                    <Button
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || isGenerating || !canAfford}
                      className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isGenerating ? (
                        <>
                          <motion.div 
                            className="rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Solicitar Automação
                        </>
                      )}
                    </Button>
                  </div>

                  {isGenerating && (
                    <motion.div 
                      className="space-y-4 p-6 glass-card border border-primary/30 bg-gradient-to-r from-primary/5 to-purple-500/5"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex items-center gap-2">
                        <motion.div 
                          className="rounded-full h-5 w-5 border-2 border-primary border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="text-sm font-medium">Processando sua solicitação...</span>
                      </div>
                      <Progress value={33} className="h-3" />
                      <p className="text-xs text-muted-foreground">
                        Isso pode levar alguns segundos. Nossa IA está trabalhando para você!
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-4 rounded-2xl bg-muted/20 border border-muted w-fit mx-auto mb-6">
                    <Bot className="h-16 w-16 text-muted-foreground mx-auto" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Nenhuma ferramenta selecionada</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Escolha uma ferramenta IA na barra lateral para começar
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Tabs for Templates and History */}
          <Tabs defaultValue="templates" className="space-y-6">
            <TabsList className="glass-card border border-primary/20 p-1">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="templates">
              <Card className="glass-card border-primary/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="gradient-text flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                      <Palette className="h-5 w-5 text-primary" />
                    </div>
                    Biblioteca de Templates
                  </CardTitle>
                  <CardDescription className="text-base">Templates prontos para acelerar sua criação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {templates.map((template, index) => (
                      <motion.div
                        key={template.id}
                        className="p-6 glass-card-hover cursor-pointer border border-white/10 hover:border-primary/30 transition-all duration-300 hover:scale-105"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-lg">{template.name}</h4>
                          <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs font-medium text-yellow-400">{template.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{template.description}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <Badge variant="outline" className="text-xs border-primary/30">
                            {template.category}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-400" />
                            <span className="text-xs text-green-400 font-medium">{template.uses} usos</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="glass-card border-primary/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="gradient-text flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    Histórico de Gerações
                  </CardTitle>
                  <CardDescription className="text-base">Suas gerações recentes e resultados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentGenerations.map((generation, index) => (
                      <motion.div
                        key={generation.id}
                        className="flex items-center justify-between p-5 glass-card-hover border border-white/10 hover:border-primary/30 transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{generation.tool}</h4>
                            <Badge
                              variant={generation.status === "completed" ? "default" : "secondary"}
                              className={`text-xs ${
                                generation.status === "completed"
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              }`}
                            >
                              {generation.status === "completed" ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Concluído
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <motion.div
                                    className="h-2 w-2 bg-yellow-400 rounded-full"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                  />
                                  Processando
                                </div>
                              )}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-2">{generation.content}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{generation.timestamp}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 hover:bg-primary/20 hover:scale-110 transition-all duration-200"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 hover:bg-primary/20 hover:scale-110 transition-all duration-200"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>

      {/* Dialog para Formulário de Automação */}
      <Dialog open={showAutomationForm} onOpenChange={setShowAutomationForm}>
        <DialogContent className="max-w-4xl glass-card border-primary/20 shadow-2xl">
          <AIAutomationForm 
            type={automationType} 
            onClose={() => setShowAutomationForm(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}