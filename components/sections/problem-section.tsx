"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Zap, Clock } from "lucide-react"
import { GlassCard } from "../ui/glass-card"

export function ProblemSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display">Seus funis estão no século passado.</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Enquanto seus concorrentes usam IA para prever, otimizar e converter em escala.
          </p>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <GlassCard custom={1} className="space-y-6 text-left">
            <h3 className="text-2xl font-bold font-display text-muted-foreground">Funil Tradicional</h3>
            <div className="flex items-center gap-4 text-destructive">
              <TrendingDown className="h-8 w-8" />
              <span className="text-4xl font-bold">2%</span>
              <span>Conversão</span>
            </div>
            <div className="flex items-center gap-4 text-red-900">
              <Clock className="h-8 w-8" />
              <span className="text-4xl font-bold">30 dias</span>
              <span>Para otimizar</span>
            </div>
            <p className="text-muted-foreground">Baseado em achismos, testes A/B lentos e ROI incerto.</p>
          </GlassCard>

          <GlassCard
            custom={2}
            className="space-y-6 text-left border-primary/50 bg-primary/10 shadow-[0_0_40px_hsl(var(--primary)/0.2)]"
          >
            <h3 className="text-2xl font-bold font-display text-foreground">IceFunnel com IA</h3>
            <div className="flex items-center gap-4 text-primary">
              <TrendingUp className="h-8 w-8" />
              <span className="text-4xl font-bold">18%</span>
              <span>Conversão</span>
            </div>
            <div className="flex items-center gap-4 text-primary">
              <Zap className="h-8 w-8" />
              <span className="text-4xl font-bold">7 dias</span>
              <span>Para ROI</span>
            </div>
            <p className="text-foreground/90">Otimização 24/7, previsões precisas e crescimento garantido.</p>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
