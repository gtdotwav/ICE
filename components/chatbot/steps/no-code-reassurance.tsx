import { CheckCircle2 } from "lucide-react"

type NoCodeReassuranceProps = {
  level: "none" | "basic" | "advanced"
}

const content = {
  none: {
    title: "🎉 PERFEITO! Essa é exatamente nossa especialidade!",
    subtitle: "❄️ ICEFUNNEL foi criado para quem quer RESULTADOS, não dores de cabeça técnicas.",
    points: [
      "Cria funis automaticamente",
      "Otimiza conversões sozinha",
      "Gera relatórios inteligentes",
      "Sugere melhorias em tempo real",
    ],
    conclusion: "💡 Você só precisa clicar e acompanhar os resultados crescerem!",
  },
  advanced: {
    title: "🔥 Incrível! Mas prepare-se para uma surpresa...",
    subtitle: "❄️ Com ICEFUNNEL, até programadores esquecem que sabem código.",
    points: [
      "Nossa IA Arctic é tão avançada que você vai preferir ela fazendo o trabalho.",
      "Foque no que importa: estratégia e resultados, não em implementação.",
    ],
  },
  basic: {
    title: "😌 Relaxa! Mesmo sabendo o básico, você não vai precisar usar.",
    subtitle: "❄️ ICEFUNNEL elimina 100% da necessidade técnica.",
    points: [
      "Nossa IA Arctic cuida de toda a parte complexa.",
      "Você foca no que realmente gera dinheiro: conversões!",
    ],
  },
}

export function NoCodeReassurance({ level }: NoCodeReassuranceProps) {
  const { title, subtitle, points, conclusion } = content[level]

  return (
    <div className="space-y-3">
      <p className="font-bold text-polar-white">{title}</p>
      <p className="text-ice-quantum-300">{subtitle}</p>
      {points && (
        <ul className="space-y-2 text-sm">
          {points.map((point, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-ai-green mt-0.5 shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
      {conclusion && <p className="font-medium">{conclusion}</p>}
    </div>
  )
}
