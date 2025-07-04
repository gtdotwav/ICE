import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Bot, Sparkles, Paperclip, Send } from "lucide-react"

const quickPrompts = [
  "Otimize a headline da minha landing page",
  "Crie 3 emails de nurturing para leads frios",
  "Analise o churn do funil de checkout",
]

export function AiWidget() {
  return (
    <Card className="bg-background/60 backdrop-blur-sm flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <CardTitle>Assistente de IA IceFunnel</CardTitle>
            <CardDescription>Peça qualquer coisa, de copy a análises complexas.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-4">
        <div className="relative flex-grow">
          <Textarea
            placeholder="Ex: Crie uma nova variação do meu funil de vendas principal com foco em LTV..."
            className="flex-grow bg-background/70 text-base w-full h-full resize-none p-4 pr-12"
            rows={5}
          />
          <div className="absolute bottom-3 right-3 flex flex-col gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-8 w-8"
            >
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Anexar arquivo</span>
            </Button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <Button key={prompt} variant="outline" size="sm" className="bg-transparent">
              {prompt}
            </Button>
          ))}
        </div>
      </CardContent>
      <div className="p-4 pt-0 border-t border-border/50">
        <div className="flex items-center justify-between mt-4">
          <Button variant="ghost" className="text-muted-foreground">
            <Sparkles className="mr-2 h-4 w-4" />
            Melhorar texto
          </Button>
          <Button size="lg">
            Gerar com IA
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
