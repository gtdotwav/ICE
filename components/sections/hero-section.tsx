"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Button } from "@/components/ui/button"
import { HologramScene } from "@/components/three/hologram-scene"
import { ArrowRight, Bot, Cpu, BarChart } from "lucide-react"
import { AnimatedText } from "@/components/animated-text"
import type { ModalType } from "@/app/page"

type HeroSectionProps = {
  onOpenModal: (type: ModalType) => void
  onOpenChatbot: () => void
}

export function HeroSection({ onOpenModal, onOpenChatbot }: HeroSectionProps) {
  const features = [
    { icon: <Bot className="h-5 w-5 text-ai-cyan" />, text: "IA Preditiva" },
    { icon: <Cpu className="h-5 w-5 text-ai-cyan" />, text: "Automação Gelada" },
    { icon: <BarChart className="h-5 w-5 text-ai-cyan" />, text: "Analytics Quântico" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-ice-quantum-950" />}>
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <HologramScene />
          </Canvas>
        </Suspense>
      </div>

      <div className="relative z-10 grid md:grid-cols-2 items-center min-h-screen px-4 md:px-8 bg-gradient-to-r from-ice-quantum-950/95 via-ice-quantum-950/70 to-transparent">
        <motion.div
          className="container mx-auto text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter">
            <AnimatedText text="Funis com I.A. que" el="span" className="block text-white" />
            <span className="text-transparent bg-clip-text bg-gradient-frost from-ai-cyan to-ai-purple">
              <AnimatedText text="congelam a concorrência." el="span" />
            </span>
          </motion.h1>
          <motion.p className="mt-6 max-w-xl text-lg md:text-xl text-ice-quantum-300" variants={itemVariants}>
            Inteligência Artificial aplicada em cada etapa. ROI previsível por machine learning para escalar seus
            resultados.
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap gap-4" variants={itemVariants}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-ice-quantum-800/50 border border-ice-quantum-700 rounded-full backdrop-blur-sm"
              >
                {feature.icon}
                <span className="font-medium text-ice-quantum-200">{feature.text}</span>
              </div>
            ))}
          </motion.div>
          <motion.div className="mt-10 flex flex-col sm:flex-row gap-4" variants={itemVariants}>
            <Button
              size="lg"
              onClick={() => onOpenModal("signUp")}
              className="bg-gradient-frost font-bold hover:opacity-90 transition-opacity duration-300 group shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] text-teal-200"
            >
              Ativar IA Agora
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onOpenModal("demoVideo")}
              className="border-ai-cyan text-ai-cyan bg-ai-cyan/10 hover:bg-ai-cyan/20 hover:text-ai-cyan backdrop-blur-sm"
            >
              Ver IA em Ação
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={onOpenChatbot}
              className="border-steel-gray/50 text-polar-white bg-steel-gray/10 hover:bg-steel-gray/20 hover:text-white backdrop-blur-sm"
            >
              <Bot className="mr-2 h-5 w-5" />
              Falar com IA
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
