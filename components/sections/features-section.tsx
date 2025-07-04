"use client"

import { motion } from "framer-motion"
import { BrainCircuit, BarChartBig, Bot, FileText, Target, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "../ui/glass-card"

export function FeaturesSection() {
  const features = [
    {
      id: "ai-prediction",
      title: "Previsão por IA",
      description: "Machine Learning prevê conversões com 94% de precisão.",
      icon: <BrainCircuit className="h-12 w-12 text-primary" />,
      className: "md:col-span-2 md:row-span-2",
    },
    {
      id: "quantum-analytics",
      title: "Analytics Quântico",
      description: "Processamento em tempo real com edge computing.",
      icon: <BarChartBig className="h-10 w-10 text-primary" />,
      className: "md:col-span-1 md:row-span-1",
    },
    {
      id: "auto-optimization",
      title: "Auto-Otimização",
      description: "IA ajusta funis 24/7 sem intervenção humana.",
      icon: <Bot className="h-10 w-10 text-primary" />,
      className: "md:col-span-1 md:row-span-1",
    },
    {
      id: "nlp-copywriting",
      title: "Copy com GPT-4o",
      description: "Textos que convertem, gerados por IA.",
      icon: <FileText className="h-8 w-8 text-muted-foreground" />,
      className: "md:col-span-1 md:row-span-1",
    },
    {
      id: "predictive-lead-scoring",
      title: "Lead Scoring Preditivo",
      description: "Identifica leads quentes antes deles saberem.",
      icon: <Target className="h-8 w-8 text-muted-foreground" />,
      className: "md:col-span-1 md:row-span-1",
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display">O Futuro da Conversão é Agora</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Ferramentas de IA construídas para performance máxima.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <GlassCard key={feature.id} custom={index + 1} className={`group flex flex-col ${feature.className}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl md:text-2xl font-bold font-display text-foreground">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground flex-grow">{feature.description}</p>
                {feature.className.includes("md:col-span-2") && (
                  <Button variant="link" className="mt-6 p-0 text-primary self-start">
                    Ver demonstração <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
