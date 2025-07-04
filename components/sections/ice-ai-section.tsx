import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Zap, Target } from "lucide-react"

export function IceAiSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Powered by <span className="text-blue-600">ICE AI</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nossa inteligência artificial revolucionária que transforma dados em insights acionáveis
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Análise Inteligente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analisa comportamentos e padrões para otimizar suas conversões automaticamente
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Otimização Automática</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Ajusta elementos do funil em tempo real para maximizar resultados</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Targeting Preciso</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Identifica e segmenta seu público ideal com precisão cirúrgica</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Experimente o ICE AI
          </Button>
        </div>
      </div>
    </section>
  )
}
