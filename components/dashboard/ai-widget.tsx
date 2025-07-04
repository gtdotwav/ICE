import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, Target } from "lucide-react"

const insights = [
  {
    icon: TrendingUp,
    title: "Otimização Detectada",
    description: "Sua página de checkout pode ter 23% mais conversões com pequenos ajustes.",
  },
  {
    icon: Target,
    title: "Segmento Identificado",
    description: "Usuários de 25-34 anos têm 40% mais chance de conversão às terças-feiras.",
  },
  {
    icon: Brain,
    title: "Recomendação IA",
    description: "Teste A/B sugerido: alterar CTA de 'Comprar' para 'Garantir Desconto'.",
  },
]

export function AiWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Insights da IA
        </CardTitle>
        <CardDescription>Recomendações personalizadas para otimizar suas conversões</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
            <insight.icon className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium">{insight.title}</h4>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        ))}
        <Button className="w-full">Ver Todas as Recomendações</Button>
      </CardContent>
    </Card>
  )
}
