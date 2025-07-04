"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bot, Lightbulb, TrendingUp, Target, Sparkles } from "lucide-react"
import { useState } from "react"

const insights = [
  {
    type: "optimization",
    title: "Otimização de Conversão",
    description: "Sua página de checkout pode ser otimizada para aumentar conversões em 15%",
    impact: "Alto",
    icon: Target,
    color: "text-green-500",
  },
  {
    type: "trend",
    title: "Tendência Identificada",
    description: "Tráfego mobile aumentou 23% esta semana",
    impact: "Médio",
    icon: TrendingUp,
    color: "text-blue-500",
  },
  {
    type: "suggestion",
    title: "Sugestão de Campanha",
    description: "Momento ideal para lançar campanha de remarketing",
    impact: "Alto",
    icon: Lightbulb,
    color: "text-yellow-500",
  },
]

export function AIWidget() {
  const [currentInsight, setCurrentInsight] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateNewInsight = async () => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setCurrentInsight((prev) => (prev + 1) % insights.length)
    setIsGenerating(false)
  }

  const insight = insights[currentInsight]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-purple-500/20">
          <Bot className="h-4 w-4 text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">IA Assistant</h3>
          <p className="text-xs text-muted-foreground">Insights personalizados</p>
        </div>
        <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
          Beta
        </Badge>
      </div>

      <Separator className="bg-white/10" />

      {/* Current Insight */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-white/5 ${insight.color}`}>
            <insight.icon className="h-4 w-4" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">{insight.title}</h4>
              <Badge
                variant="outline"
                className={`text-xs ${
                  insight.impact === "Alto"
                    ? "border-green-500/50 text-green-400"
                    : "border-yellow-500/50 text-yellow-400"
                }`}
              >
                {insight.impact}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 glass-button text-xs h-8 bg-transparent">
            Ver Detalhes
          </Button>
          <Button size="sm" className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary text-xs h-8">
            Aplicar
          </Button>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Generate New Insight */}
      <Button
        variant="ghost"
        size="sm"
        onClick={generateNewInsight}
        disabled={isGenerating}
        className="w-full glass-button text-xs h-8"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent mr-2" />
            Gerando insight...
          </>
        ) : (
          <>
            <Sparkles className="h-3 w-3 mr-2" />
            Novo Insight
          </>
        )}
      </Button>

      {/* Insight Counter */}
      <div className="flex justify-center gap-1">
        {insights.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              index === currentInsight ? "bg-primary" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
