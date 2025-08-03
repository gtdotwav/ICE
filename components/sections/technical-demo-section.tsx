"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Code, Cpu, FileText, Target, Bot, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

type OutputItem = {
  title: string
  metric: string
  description: string
  color: keyof typeof outputColors
}

const demoData = {
  conversion: {
    title: "Otimização de Conversão",
    icon: <Target className="h-5 w-5" />,
    prompt:
      "Analise o funil 'landing-page' e sugira 3 otimizações de alto impacto para maximizar as conversões, focando em headline, CTA e layout.",
    code: `const result = await icefunnel.ai.optimize({
funnel: 'landing-page',
goal: 'maximize_conversions',
data: userBehaviorData
});`,
    outputs: [
      {
        title: "Otimização de Headline",
        metric: "+34% CTR",
        description: 'Alterado de "Aumente vendas" para "Aumente vendas em 347%"',
        color: "green",
      },
      {
        title: "Otimização de CTA",
        metric: "+28% Cliques",
        description: "Cor do botão alterada para #00F0FF com base em heatmap.",
        color: "cyan",
      },
      {
        title: "Ajuste de Layout",
        metric: "+19% Envios",
        description: "Formulário movido para 40% acima da dobra.",
        color: "purple",
      },
    ],
  },
  copywriting: {
    title: "Geração de Copy",
    icon: <FileText className="h-5 w-5" />,
    prompt:
      "Gere duas variações de título para um hero de um SaaS para desenvolvedores, com tom persuasivo. Uma focada em benefício e outra em dor.",
    code: `const result = await icefunnel.ai.generate({
component: 'hero_title',
tone: 'persuasive',
context: 'SaaS for developers'
});`,
    outputs: [
      {
        title: "Variação A (Foco em Benefício)",
        metric: "9.8/10 Score",
        description: '"Construa APIs 10x mais rápido com nossa infraestrutura."',
        color: "cyan",
      },
      {
        title: "Variação B (Foco em Dor)",
        metric: "9.5/10 Score",
        description: '"Cansado de gerenciar servidores? Foque no seu código."',
        color: "purple",
      },
    ],
  },
  segmentation: {
    title: "Segmentação Preditiva",
    icon: <Bot className="h-5 w-5" />,
    prompt:
      "Segmente a base de usuários para encontrar clientes com LTV potencial acima de R$1.000 e aqueles com alto risco de churn.",
    code: `const segments = await icefunnel.ai.segment({
users: allUsers,
criteria: 'potential_ltv > 1000'
});`,
    outputs: [
      {
        title: "Segmento 'High-Value'",
        metric: "2,418 Usuários",
        description: "Potencial de LTV > R$1.000. Ação: Enviar oferta premium.",
        color: "green",
      },
      {
        title: "Segmento 'Churn-Risk'",
        metric: "897 Usuários",
        description: "Probabilidade de churn de 82%. Ação: Iniciar fluxo de retenção.",
        color: "purple",
      },
    ],
  },
}

type DemoKey = keyof typeof demoData

const outputColors = {
  green: "border-ai-green/30 bg-gradient-to-r from-ai-green/30 text-ai-green",
  cyan: "border-ai-cyan/30 bg-gradient-to-r from-ai-cyan/30 text-ai-cyan",
  purple: "border-ai-purple/30 bg-gradient-to-r from-ai-purple/30 text-ai-purple",
}

export function TechnicalDemoSection() {
  const [activeDemo, setActiveDemo] = useState<DemoKey>("conversion")
  const [outputs, setOutputs] = useState<OutputItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const currentDemo = useMemo(() => demoData[activeDemo], [activeDemo])

  useEffect(() => {
    // reinicia animação
    setOutputs([])
    setIsProcessing(true)

    let outputIndex = 0
    const intervalRef = { current: 0 as any }

    const timeoutId = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        // se ainda houver itens válidos
        if (outputIndex < currentDemo.outputs.length) {
          setOutputs((prev) => [...prev, currentDemo.outputs[outputIndex]])
          outputIndex += 1
        } else {
          clearInterval(intervalRef.current)
          setIsProcessing(false)
        }
      }, 800)
    }, 500) // pequeno atraso para efeito de "carregando"

    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalRef.current)
    }
  }, [currentDemo])

  return (
    <section className="py-20 md:py-32 px-4 bg-ice-quantum-900">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display">
            Veja a <span className="bg-clip-text bg-gradient-frost text-sky-400">IA em Ação</span> - Ao Vivo
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-ice-quantum-300">
            Demonstração técnica interativa que mostra como a IA do HIAS FLOW otimiza funis em tempo real.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
          {(Object.keys(demoData) as DemoKey[]).map((key) => (
            <Button
              key={key}
              variant="outline"
              onClick={() => setActiveDemo(key)}
              className={cn(
                "border-ice-quantum-700 bg-ice-quantum-800/50 hover:bg-ice-quantum-700/50 transition-all duration-300 gap-2",
                activeDemo === key &&
                  "border-ai-cyan/50 bg-gradient-frost text-ice-quantum-950 font-bold hover:opacity-90",
              )}
            >
              {demoData[key].icon}
              {demoData[key].title}
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Code Editor */}
          <div className="rounded-2xl overflow-hidden bg-ice-quantum-950 border border-ice-quantum-700">
            <div className="px-4 py-3 border-b border-ice-quantum-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <span className="text-sm text-ice-quantum-400 flex items-center gap-2">
                <Code className="h-4 w-4" /> Input
              </span>
            </div>
            <div className="p-6 font-mono text-sm text-ice-quantum-300">
              <pre>
                <code>{currentDemo.code}</code>
              </pre>
            </div>
            <div className="border-t border-ice-quantum-700 p-4 bg-ice-quantum-900/50">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-ai-purple flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-sans font-bold text-ice-quantum-200">Prompt para IA:</h4>
                  <p className="font-sans text-sm text-ice-quantum-400 mt-1">"{currentDemo.prompt}"</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Output */}
          <div className="rounded-2xl overflow-hidden bg-ice-quantum-950 border border-ice-quantum-700">
            <div className="px-4 py-3 border-b border-ice-quantum-700 flex items-center justify-between">
              <span className="text-sm text-ice-quantum-400 flex items-center gap-2">
                <Cpu className="h-4 w-4" /> Output da IA
              </span>
              {isProcessing && (
                <div className="flex items-center gap-2 text-xs text-ai-cyan">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ai-cyan opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-ai-cyan" />
                  </div>
                  Processando...
                </div>
              )}
            </div>
            <div className="p-6 space-y-4 min-h-[260px]">
              <AnimatePresence>
                {outputs.filter(Boolean).map((output, index) => (
                  <motion.div
                    key={index}
                    className={cn("p-4 rounded-lg border to-transparent", outputColors[output.color])}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-sm font-bold">{output.title}</div>
                    <div className="text-white font-semibold text-lg">{output.metric}</div>
                    <div className="text-ice-quantum-300 text-sm">{output.description}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}