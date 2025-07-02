"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Zap, Clock } from "lucide-react"
import { GlassCard } from "../ui/glass-card"

export function ProblemSection() {
  return (
    <section className="py-20 md:py-32 px-4">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display">Seus funis estão no século passado.</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-ice-quantum-300">
            Enquanto seus concorrentes usam IA para prever, otimizar e converter em escala.
          </p>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Card da Esquerda: Funil Tradicional */}
          <GlassCard custom={1} className="space-y-6 text-left">
            <h3 className="text-2xl font-bold font-display text-ice-quantum-400">Funil Tradicional</h3>
            <div className="flex items-center gap-4 text-red-400">
              <TrendingDown className="h-8 w-8" />
              <span className="text-4xl font-bold">2%</span>
              <span>Conversão</span>
            </div>
            <div className="flex items-center gap-4 text-yellow-400">
              <Clock className="h-8 w-8" />
              <span className="text-4xl font-bold">30 dias</span>
              <span>Para otimizar</span>
            </div>
            <p className="text-ice-quantum-400">Baseado em achismos, testes A/B lentos e ROI incerto.</p>
          </GlassCard>

          {/* Card da Direita: IceFunnel com IA */}
          <GlassCard
            custom={2}
            className="space-y-6 text-left border-ai-cyan bg-gradient-to-br from-ai-cyan/10 to-ai-purple/10 shadow-[0_0_40px_rgba(0,240,255,0.2)]"
          >
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-neural opacity-10 animate-spin-slow" />
            <h3 className="text-2xl font-bold font-display text-white">IceFunnel com IA</h3>
            <div className="flex items-center gap-4 text-ai-green">
              <TrendingUp className="h-8 w-8" />
              <span className="text-4xl font-bold">18%</span>
              <span>Conversão</span>
            </div>
            <div className="flex items-center gap-4 text-ai-cyan">
              <Zap className="h-8 w-8" />
              <span className="text-4xl font-bold">7 dias</span>
              <span>Para ROI</span>
            </div>
            <p className="text-ice-quantum-200">Otimização 24/7, previsões precisas e crescimento garantido.</p>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
