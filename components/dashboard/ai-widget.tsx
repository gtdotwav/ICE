import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, Target, Lightbulb, ArrowRight, Sparkles } from "lucide-react"

const insights = [
  {
    icon: TrendingUp,
    title: "Otimização Detectada",
    description: "Sua página de checkout pode ter 23% mais conversões com pequenos ajustes no formulário.",
    priority: "high",
    impact: "+23%",
  },
  {
    icon: Target,
    title: "Segmento Identificado",
    description: "Usuários de 25-34 anos têm 40% mais chance de conversão às terças-feiras entre 14h-16h.",
    priority: "medium",
    impact: "+40%",
  },
  {
    icon: Lightbulb,
    title: "Recomendação IA",
    description: "Teste A/B sugerido: alterar CTA de 'Comprar Agora' para 'Garantir Meu Desconto'.",
    priority: "high",
    impact: "+15%",
  },
]

const priorityColors = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-green-500/20 text-green-400 border-green-500/30",
}

export function AiWidget() {
  return (
    <Card className="bg-background/40 backdrop-blur-xl border-white/10 hover:bg-background/60 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 backdrop-blur-sm">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Insights da IA
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Sparkles className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">Atualizado há 5 min</span>
            </div>
          </div>
        </CardTitle>
        <CardDescription>Recomendações personalizadas para otimizar suas conversões</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                  <insight.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{insight.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className={`text-xs ${priorityColors[insight.priority as keyof typeof priorityColors]}`}
                    >
                      {insight.priority === "high" ? "Alta" : insight.priority === "medium" ? "Média" : "Baixa"}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                      {insight.impact}
                    </Badge>
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
          </div>
        ))}

        <div className="pt-4 border-t border-white/10">
          <Button className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 hover:border-primary/50 backdrop-blur-sm transition-all duration-300">
            <Brain className="mr-2 h-4 w-4" />
            Ver Todas as Recomendações
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
