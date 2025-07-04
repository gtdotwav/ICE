"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Check,
  Bot,
  BarChart,
  ShoppingCart,
  Target,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  CheckCircle,
  Globe,
  Mail,
  Share2,
  Users,
  Zap,
  TrendingUp,
  Star,
  Lightbulb,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const steps = [
  { id: "01", name: "Objetivo", description: "Defina o propósito do seu funil", icon: Target },
  { id: "02", name: "Tráfego", description: "Como os visitantes chegam", icon: Globe },
  { id: "03", name: "Estrutura", description: "Escolha o modelo ideal", icon: BarChart },
  { id: "04", name: "Personalização", description: "Ajustes finais com IA", icon: Bot },
  { id: "05", name: "Revisão", description: "Confirme e crie", icon: CheckCircle },
]

const goalOptions = [
  {
    value: "leads",
    title: "Gerar Leads",
    description: "Capturar contatos qualificados para nutrição",
    icon: Target,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    features: ["Landing Pages", "Formulários", "Email Marketing", "Lead Scoring"],
  },
  {
    value: "sales",
    title: "Realizar Vendas",
    description: "Converter visitantes em clientes pagantes",
    icon: ShoppingCart,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    features: ["Páginas de Vendas", "Checkout", "Upsells", "Recuperação de Carrinho"],
  },
  {
    value: "retention",
    title: "Retenção/Upsell",
    description: "Aumentar valor do cliente existente",
    icon: TrendingUp,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    features: ["Cross-sell", "Upsell", "Programas de Fidelidade", "Reativação"],
  },
]

const trafficSources = [
  {
    value: "organic",
    label: "Tráfego Orgânico (SEO)",
    icon: Globe,
    description: "Visitantes que encontram você através de buscas naturais",
  },
  {
    value: "paid",
    label: "Mídia Paga (Google/Social Ads)",
    icon: Zap,
    description: "Campanhas pagas no Google, Facebook, Instagram, etc.",
  },
  {
    value: "email",
    label: "Email Marketing",
    icon: Mail,
    description: "Lista de emails própria ou campanhas de email",
  },
  {
    value: "social",
    label: "Redes Sociais (Orgânico)",
    icon: Share2,
    description: "Conteúdo orgânico em redes sociais",
  },
  {
    value: "referral",
    label: "Indicação / Afiliados",
    icon: Users,
    description: "Programa de afiliados ou indicações",
  },
]

const templates = [
  {
    value: "aida",
    title: "AIDA Clássico",
    description: "Atenção → Interesse → Desejo → Ação",
    features: ["Landing Page", "Página de Captura", "Email de Confirmação", "Página de Vendas"],
    recommended: true,
    conversionRate: "15-25%",
    complexity: "Simples",
    timeToLaunch: "2-3 dias",
  },
  {
    value: "webinar",
    title: "Funil de Webinar",
    description: "Educação antes da venda para produtos premium",
    features: ["Página de Inscrição", "Página de Confirmação", "Webinar", "Oferta Especial"],
    recommended: false,
    conversionRate: "20-35%",
    complexity: "Avançado",
    timeToLaunch: "5-7 dias",
  },
  {
    value: "lead-magnet",
    title: "Isca Digital",
    description: "Material gratuito em troca do contato",
    features: ["Landing Page", "Download Page", "Sequência de Email", "Oferta Tripwire"],
    recommended: false,
    conversionRate: "25-40%",
    complexity: "Intermediário",
    timeToLaunch: "3-4 dias",
  },
  {
    value: "custom",
    title: "Personalizado",
    description: "Criado especificamente para suas necessidades",
    features: ["Estrutura Única", "IA Personalizada", "Otimização Avançada", "A/B Testing"],
    recommended: false,
    conversionRate: "Variável",
    complexity: "Personalizado",
    timeToLaunch: "7-10 dias",
  },
]

interface CreateFunnelWizardProps {
  onClose: () => void
}

export function CreateFunnelWizard({ onClose }: CreateFunnelWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCreating, setIsCreating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    goal: "",
    trafficSource: "",
    template: "",
    description: "",
    targetAudience: "",
    budget: "",
    productPrice: "",
    industry: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 0:
        if (!formData.name.trim()) newErrors.name = "Nome do funil é obrigatório"
        if (formData.name.length < 3) newErrors.name = "Nome deve ter pelo menos 3 caracteres"
        if (!formData.goal) newErrors.goal = "Selecione um objetivo"
        break
      case 1:
        if (!formData.trafficSource) newErrors.trafficSource = "Selecione uma fonte de tráfego"
        break
      case 2:
        if (!formData.template) newErrors.template = "Escolha um modelo"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((step) => step + 1)
      }
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1)
      setErrors({})
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCreateFunnel = async () => {
    setIsCreating(true)

    try {
      // Simulate API call with realistic timing
      await new Promise((resolve) => setTimeout(resolve, 3500))

      console.log("Criando funil com dados:", formData)

      setIsComplete(true)

      toast({
        title: "🎉 Funil criado com sucesso!",
        description: `${formData.name} foi criado e está sendo otimizado pela IA.`,
      })

      setTimeout(() => {
        onClose()
      }, 2500)
    } catch (error) {
      toast({
        title: "❌ Erro ao criar funil",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="relative mx-auto w-24 h-24 mb-6">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-green-500/30"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        </motion.div>
        <h3 className="text-3xl font-bold mb-3 text-foreground">Funil Criado com Sucesso!</h3>
        <p className="text-muted-foreground mb-6 text-lg">
          Sua nova máquina de conversão está sendo preparada pela nossa IA.
        </p>
        <div className="flex flex-col items-center gap-4">
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            IA trabalhando na otimização
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Gerando páginas otimizadas...
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      {/* Progress Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">Progresso do Funil</span>
          <span className="text-sm font-bold text-primary">{Math.round(progress)}% Completo</span>
        </div>
        <Progress value={progress} className="h-3 bg-muted" />
      </div>

      {/* Steps Navigation */}
      <nav aria-label="Progress" className="mb-8">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => (
            <li key={step.name} className="flex flex-col items-center relative">
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-4 left-8 w-full h-0.5 -z-10",
                    currentStep > index ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300",
                  currentStep > index
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : currentStep === index
                      ? "bg-primary/20 text-primary border-2 border-primary shadow-md"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {currentStep > index ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <div className="mt-3 text-center max-w-20">
                <div
                  className={cn(
                    "text-xs font-medium transition-colors",
                    currentStep >= index ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.name}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      {/* Step Content */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 0: Objetivo */}
            {currentStep === 0 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Vamos começar definindo seu objetivo</h2>
                  <p className="text-muted-foreground">Isso nos ajuda a criar o funil perfeito para você</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-base font-semibold mb-2 block">
                      Nome do Funil *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex: Lançamento do Ebook de IA para Empreendedores"
                      className={cn("h-12 text-base", errors.name && "border-red-500")}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Qual é o principal objetivo deste funil? *
                    </Label>
                    <RadioGroup
                      value={formData.goal}
                      onValueChange={handleSelectChange("goal")}
                      className="grid grid-cols-1 gap-4"
                    >
                      {goalOptions.map((option) => (
                        <Label
                          key={option.value}
                          htmlFor={`goal-${option.value}`}
                          className={cn(
                            "flex items-start space-x-4 rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 hover:bg-accent/50",
                            formData.goal === option.value
                              ? `${option.borderColor} ${option.bgColor} shadow-lg`
                              : "border-muted bg-card hover:border-muted-foreground/20",
                            errors.goal && "border-red-500",
                          )}
                        >
                          <RadioGroupItem value={option.value} id={`goal-${option.value}`} className="sr-only" />
                          <div className={cn("p-3 rounded-lg", option.bgColor)}>
                            <option.icon className={cn("h-6 w-6", option.color)} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-lg mb-1">{option.title}</div>
                            <div className="text-sm text-muted-foreground mb-3">{option.description}</div>
                            <div className="flex flex-wrap gap-2">
                              {option.features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </Label>
                      ))}
                    </RadioGroup>
                    {errors.goal && (
                      <p className="text-sm text-red-500 mt-3 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.goal}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Fonte de Tráfego */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Como seus visitantes chegam até você?</h2>
                  <p className="text-muted-foreground">Isso nos ajuda a otimizar o funil para sua fonte de tráfego</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-4 block">Principal fonte de tráfego *</Label>
                    <Select value={formData.trafficSource} onValueChange={handleSelectChange("trafficSource")}>
                      <SelectTrigger className={cn("h-14 text-base", errors.trafficSource && "border-red-500")}>
                        <SelectValue placeholder="Selecione como seus visitantes chegam..." />
                      </SelectTrigger>
                      <SelectContent>
                        {trafficSources.map((source) => (
                          <SelectItem key={source.value} value={source.value} className="p-4">
                            <div className="flex items-start gap-3">
                              <source.icon className="h-5 w-5 mt-0.5 text-primary" />
                              <div>
                                <div className="font-medium">{source.label}</div>
                                <div className="text-sm text-muted-foreground">{source.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.trafficSource && (
                      <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.trafficSource}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="targetAudience" className="text-base font-semibold mb-2 block">
                      Descreva seu público-alvo (opcional)
                    </Label>
                    <Textarea
                      id="targetAudience"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleChange}
                      placeholder="Ex: Empreendedores digitais entre 25-45 anos, interessados em automação e IA, com faturamento entre R$ 10k-100k/mês..."
                      className="min-h-[120px] text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="industry" className="text-base font-semibold mb-2 block">
                      Setor/Nicho (opcional)
                    </Label>
                    <Select value={formData.industry} onValueChange={handleSelectChange("industry")}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecione seu setor..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Tecnologia</SelectItem>
                        <SelectItem value="marketing">Marketing Digital</SelectItem>
                        <SelectItem value="education">Educação</SelectItem>
                        <SelectItem value="health">Saúde e Bem-estar</SelectItem>
                        <SelectItem value="finance">Finanças</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="consulting">Consultoria</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Estrutura */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Escolha a estrutura do seu funil</h2>
                  <p className="text-muted-foreground">Cada modelo é otimizado para diferentes objetivos</p>
                </div>

                <div>
                  <RadioGroup
                    value={formData.template}
                    onValueChange={handleSelectChange("template")}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    {templates.map((template) => (
                      <Label
                        key={template.value}
                        htmlFor={`template-${template.value}`}
                        className={cn(
                          "rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 hover:bg-accent/50 relative",
                          formData.template === template.value
                            ? "border-primary bg-primary/5 shadow-lg"
                            : "border-muted bg-card hover:border-muted-foreground/20",
                          errors.template && "border-red-500",
                        )}
                      >
                        <RadioGroupItem value={template.value} id={`template-${template.value}`} className="sr-only" />

                        {template.recommended && (
                          <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            Recomendado
                          </Badge>
                        )}

                        <div className="space-y-4">
                          <div>
                            <h3 className="font-bold text-lg mb-2">{template.title}</h3>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-xs text-muted-foreground">Conversão</div>
                              <div className="font-semibold text-sm">{template.conversionRate}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Complexidade</div>
                              <div className="font-semibold text-sm">{template.complexity}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Lançamento</div>
                              <div className="font-semibold text-sm">{template.timeToLaunch}</div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {template.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                  {errors.template && (
                    <p className="text-sm text-red-500 mt-4 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.template}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Personalização */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Vamos personalizar seu funil</h2>
                  <p className="text-muted-foreground">
                    Essas informações ajudam nossa IA a criar conteúdo mais eficaz
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="description" className="text-base font-semibold mb-2 block">
                      Descreva seu produto/serviço
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Ex: Curso online completo que ensina empreendedores a usar IA para automatizar processos de marketing, vendas e atendimento ao cliente. Inclui templates, ferramentas e suporte por 6 meses..."
                      className="min-h-[140px] text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="productPrice" className="text-base font-semibold mb-2 block">
                        Preço do produto (opcional)
                      </Label>
                      <Select value={formData.productPrice} onValueChange={handleSelectChange("productPrice")}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Faixa de preço..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-100">Gratuito - R$ 100</SelectItem>
                          <SelectItem value="100-500">R$ 100 - R$ 500</SelectItem>
                          <SelectItem value="500-1000">R$ 500 - R$ 1.000</SelectItem>
                          <SelectItem value="1000-5000">R$ 1.000 - R$ 5.000</SelectItem>
                          <SelectItem value="5000+">R$ 5.000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="budget" className="text-base font-semibold mb-2 block">
                        Orçamento para tráfego pago (opcional)
                      </Label>
                      <Select value={formData.budget} onValueChange={handleSelectChange("budget")}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Orçamento mensal..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Sem orçamento (orgânico)</SelectItem>
                          <SelectItem value="0-1000">R$ 0 - R$ 1.000</SelectItem>
                          <SelectItem value="1000-5000">R$ 1.000 - R$ 5.000</SelectItem>
                          <SelectItem value="5000-10000">R$ 5.000 - R$ 10.000</SelectItem>
                          <SelectItem value="10000+">R$ 10.000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Card className="border-blue-500/30 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Lightbulb className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-200 mb-2">IA Personalizada em Ação</h4>
                          <p className="text-sm text-blue-300 mb-3">Com essas informações, nossa IA irá:</p>
                          <ul className="text-sm text-blue-300 space-y-1">
                            <li>• Criar copy persuasivo personalizado para seu público</li>
                            <li>• Sugerir cores e layouts otimizados para conversão</li>
                            <li>• Definir estratégias de preço e ofertas especiais</li>
                            <li>• Configurar automações de email personalizadas</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 4: Revisão */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Revise e confirme seu funil</h2>
                  <p className="text-muted-foreground">Verifique se tudo está correto antes de criar</p>
                </div>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      Resumo do Funil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <span className="text-sm font-medium text-muted-foreground">Nome do Funil</span>
                          <p className="font-semibold text-lg">{formData.name || "Não definido"}</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <span className="text-sm font-medium text-muted-foreground">Objetivo</span>
                          <p className="font-semibold">
                            {goalOptions.find((g) => g.value === formData.goal)?.title || "Não definido"}
                          </p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <span className="text-sm font-medium text-muted-foreground">Fonte de Tráfego</span>
                          <p className="font-semibold">
                            {trafficSources.find((t) => t.value === formData.trafficSource)?.label || "Não definido"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <span className="text-sm font-medium text-muted-foreground">Modelo</span>
                          <p className="font-semibold">
                            {templates.find((t) => t.value === formData.template)?.title || "Não definido"}
                          </p>
                        </div>
                        {formData.productPrice && (
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <span className="text-sm font-medium text-muted-foreground">Faixa de Preço</span>
                            <p className="font-semibold">{formData.productPrice}</p>
                          </div>
                        )}
                        {formData.budget && (
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <span className="text-sm font-medium text-muted-foreground">Orçamento</span>
                            <p className="font-semibold">{formData.budget}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {formData.description && (
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-muted-foreground">Descrição do Produto</span>
                        <p className="text-sm mt-1">{formData.description}</p>
                      </div>
                    )}

                    <div className="!mt-8 flex items-start gap-4 rounded-xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6">
                      <Sparkles className="h-8 w-8 flex-shrink-0 text-green-400" />
                      <div>
                        <p className="font-semibold text-green-200 mb-2">Pronto para criar seu funil!</p>
                        <p className="text-sm text-green-300 mb-3">
                          Nossa IA irá gerar um funil completo otimizado para máxima conversão:
                        </p>
                        <ul className="text-sm text-green-300 space-y-1">
                          <li>• Páginas responsivas com design profissional</li>
                          <li>• Copy persuasivo personalizado para seu público</li>
                          <li>• Automações de email inteligentes</li>
                          <li>• Analytics e otimização contínua</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-border">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 h-12 px-6 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} className="flex items-center gap-2 h-12 px-6">
            Próximo
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleCreateFunnel}
            disabled={isCreating}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex items-center gap-2 h-12 px-8 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Criando Funil...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Criar Funil com IA
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
