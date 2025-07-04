"use client"

import { motion } from "framer-motion"

export function TrustBar() {
  const metrics = [
    { metric: "2.5M", label: "Decisões por IA/dia" },
    { metric: "99.9%", label: "Uptime Garantido" },
    { metric: "GPT-4o", label: "Powered by OpenAI" },
    { metric: "15ms", label: "Resposta da IA" },
    { metric: "94%", label: "Precisão Preditiva" },
  ]

  const duplicatedMetrics = [...metrics, ...metrics]

  return (
    <section className="py-8 bg-secondary/50 border-y border-border">
      <div className="w-full overflow-hidden">
        <div className="relative w-full h-10 flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10" />
          <motion.div
            className="flex gap-16"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            {duplicatedMetrics.map((item, index) => (
              <div key={index} className="flex items-baseline gap-3 whitespace-nowrap">
                <span className="text-3xl font-bold font-display text-primary">{item.metric}</span>
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
