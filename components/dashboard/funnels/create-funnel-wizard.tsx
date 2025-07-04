"use client"
import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CheckCircle,
  FileText,
  Loader2,
  Sparkles,
  Target,
  Users,
} from "lucide-react"
import type { Funnel } from "./funnels-table"

const goals = [
  {
    id: "lead-generation",
    title: "Geração de Leads",
    description: "Capture contatos qualificados.",
    icon: <Users className="h-8 w-8" />,
  },
  {
    id: "sales",
    title: "Vendas Online",
    description: "Venda produtos ou serviços.",
    icon: <Target className="h-8 w-8" />,
  },
  {
    id: "webinar",
    title: "Inscrição em Webinar",
    description: "Promova seu evento online.",
    icon: <FileText className="h-8 w-8" />,
  },
]

const templates = [
  {
    id: "simple",
    title: "Simples",
    description: "Página de captura e obrigado.",
    complexity: "Baixa",
    conversion: "12%",
  },
  {
    id: "standard",
    title: "Padrão",
    description: "Captura, VSL e Checkout.",
    complexity: "Média",
    conversion: "8%",
    recommended: true,
  },
  {
    id: "complex",
    title: "Completo",
    description: "Captura, VSL, Upsell, Downsell.",
    complexity: "Alta",
    conversion: "15%",
  },
]

interface CreateFunnelWizardProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onFunnelCreated: (newFunnel: Funnel) => void
}

export function CreateFunnelWizard({ isOpen, onOpenChange, onFunnelCreated }: CreateFunnelWizardProps) {
  const [step, setStep] = useState(1)
  const [funnelData, setFunnelData] = useState({ name: "", goal: "", template: "" })
  const [isCreating, setIsCreating] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const totalSteps = 4
  const progress = useMemo(() => (step / totalSteps) * 100, [step])

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
    else handleCreateFunnel()
  }
  const handleBack = () => setStep(step - 1)

  const handleCreateFunnel = () => {
    setIsCreating(true)
    toast.info("Sua IA está construindo o funil...", {
      icon: <Bot className="h-4 w-4" />,
    })

    setTimeout(() => {
      setIsCreating(false)
      setIsSuccess(true)

      // Create the new funnel object
      const newFunnel: Funnel = {
        id: `FNL-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        name: funnelData.name || "Novo Funil",
        status: "active",
        revenue: 0,
        conversion: 0,
        trend: 0,
      }

      // Call the callback to add the funnel to the list
      onFunnelCreated(newFunnel)

      toast.success("Funil criado e otimizado com sucesso!", {
        icon: <CheckCircle className="h-4 w-4" />,
      })

      setTimeout(() => {
        onOpenChange(false)
        // Reset state for next time
        setTimeout(() => {
          setStep(1)
          setIsSuccess(false)
          setFunnelData({ name: "", goal: "", template: "" })
        }, 500)
      }, 2000)
    }, 3000)
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <Label htmlFor="funnel-name">Nome do Funil</Label>
            <Input
              id="funnel-name"
              placeholder="Ex: Lançamento Produto X"
              value={funnelData.name}
              onChange={(e) => setFunnelData({ ...funnelData, name: e.target.value })}
            />
          </div>
        )
      case 2:
        return (
          <RadioGroup
            value={funnelData.goal}
            onValueChange={(value) => setFunnelData({ ...funnelData, goal: value })}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {goals.map((goal) => (
              <Label
                key={goal.id}
                htmlFor={goal.id}
                className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
              >
                <RadioGroupItem value={goal.id} id={goal.id} className="sr-only" />
                {goal.icon}
                <span className="mt-2 font-bold">{goal.title}</span>
                <span className="text-sm text-muted-foreground">{goal.description}</span>
              </Label>
            ))}
          </RadioGroup>
        )
      case 3:
        return (
          <RadioGroup
            value={funnelData.template}
            onValueChange={(value) => setFunnelData({ ...funnelData, template: value })}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {templates.map((template) => (
              <Label
                key={template.id}
                htmlFor={template.id}
                className="relative flex flex-col rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
              >
                {template.recommended && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                    Recomendado
                  </div>
                )}
                <RadioGroupItem value={template.id} id={template.id} className="sr-only" />
                <span className="font-bold text-lg">{template.title}</span>
                <span className="text-sm text-muted-foreground flex-grow">{template.description}</span>
                <div className="mt-4 flex justify-between text-xs w-full">
                  <span>Complexidade: {template.complexity}</span>
                  <span>Conversão Média: {template.conversion}</span>
                </div>
              </Label>
            ))}
          </RadioGroup>
        )
      case 4:
        return (
          <div className="space-y-4 rounded-lg border bg-secondary/30 p-6">
            <h3 className="text-lg font-bold">Revisão do Funil</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong className="text-muted-foreground">Nome:</strong> {funnelData.name || "Não definido"}
              </p>
              <p>
                <strong className="text-muted-foreground">Objetivo:</strong>{" "}
                {goals.find((g) => g.id === funnelData.goal)?.title || "Não definido"}
              </p>
              <p>
                <strong className="text-muted-foreground">Template:</strong>{" "}
                {templates.find((t) => t.id === funnelData.template)?.title || "Não definido"}
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/10 p-4 mt-4">
              <Sparkles className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm text-primary/90">
                Sua IA irá otimizar este funil continuamente para maximizar os resultados com base nos dados em tempo
                real.
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const stepTitles = ["Nome", "Objetivo", "Estrutura", "Revisão"]

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl p-0" onInteractOutside={(e) => e.preventDefault()}>
        <AnimatePresence mode="wait">
          {isCreating ? (
            <motion.div
              key="creating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center p-8 sm:p-16 gap-4"
            >
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <h3 className="text-xl font-bold">Construindo seu Funil...</h3>
              <p className="text-muted-foreground text-center">
                Nossa IA está analisando as melhores estratégias para você.
              </p>
            </motion.div>
          ) : isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center p-8 sm:p-16 gap-4"
            >
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h3 className="text-xl font-bold">Funil Criado com Sucesso!</h3>
              <p className="text-muted-foreground text-center">Ele já está na sua lista.</p>
            </motion.div>
          ) : (
            <motion.div key="wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogHeader className="p-6 border-b">
                <DialogTitle className="text-2xl font-display">Criar Novo Funil com IA</DialogTitle>
                <DialogDescription>Siga os passos para configurar seu funil de alta conversão.</DialogDescription>
              </DialogHeader>
              <div className="p-4 sm:p-6">
                <div className="mb-6 space-y-3">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-center text-muted-foreground">
                    Passo {step} de {totalSteps}: {stepTitles[step - 1]}
                  </p>
                </div>
                <div className="min-h-[200px] sm:min-h-[250px]">{renderStepContent()}</div>
              </div>
              <div className="flex justify-between p-6 border-t bg-secondary/20 rounded-b-lg">
                <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>
                <Button onClick={handleNext}>
                  {step === totalSteps ? "Criar Funil" : "Próximo"}
                  {step < totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
                  {step === totalSteps && <Check className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
