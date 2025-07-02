"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BrainCircuit, SlidersHorizontal } from "lucide-react"

export function IceAiSection() {
  const [funnels, setFunnels] = useState(1_234_567)
  const [structures, setStructures] = useState(8_765_432)

  useEffect(() => {
    const interval = setInterval(() => {
      setFunnels((prev) => prev + Math.floor(Math.random() * 15) + 1)
      setStructures((prev) => prev + Math.floor(Math.random() * 35) + 5)
    }, 1500) // Atualiza a cada 1.5 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 md:py-32 px-4">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display">Ice AI em Ação</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-ice-quantum-300">
            Nossa inteligência artificial trabalha 24/7 para congelar a concorrência. Veja os dados em tempo real.
          </p>
        </motion.div>

        <motion.div
          className="mt-16 max-w-4xl mx-auto p-8 rounded-2xl border border-ai-green/30 bg-gradient-to-br from-ai-green/10 to-transparent shadow-[0_0_60px_rgba(16,245,158,0.15)] backdrop-blur-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ai-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-ai-green"></span>
            </div>
            <span className="text-lg font-medium text-ai-green">Sistema Operacional</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-ice-quantum-800 border border-ice-quantum-700">
                <BrainCircuit className="h-8 w-8 text-ai-purple" />
              </div>
              <div>
                <p className="text-ice-quantum-400">Funis Analisados</p>
                <p className="text-3xl md:text-4xl font-bold font-display text-white">
                  {funnels.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-ice-quantum-800 border border-ice-quantum-700">
                <SlidersHorizontal className="h-8 w-8 text-ai-cyan" />
              </div>
              <div>
                <p className="text-ice-quantum-400">Estruturas Otimizadas</p>
                <p className="text-3xl md:text-4xl font-bold font-display text-white">
                  {structures.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
