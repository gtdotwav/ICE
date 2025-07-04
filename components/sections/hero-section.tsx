"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Cpu, BarChart } from "lucide-react"
import { AnimatedText } from "@/components/animated-text"
import type { ModalType } from "@/components/home-page"
import Link from "next/link"
import { magicLogin } from "@/app/actions/auth"

type HeroSectionProps = {
  onOpenModal: (type: ModalType) => void
  onOpenChatbot: () => void
}

export function HeroSection({ onOpenModal, onOpenChatbot }: HeroSectionProps) {
  const features = [
    { icon: <Bot className="h-5 w-5 text-primary" />, text: "IA Preditiva" },
    { icon: <Cpu className="h-5 w-5 text-primary" />, text: "Automação" },
    { icon: <BarChart className="h-5 w-5 text-primary" />, text: "Analytics" },
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
    <header className="relative flex items-center justify-center min-h-screen w-full overflow-hidden">
      {/* Removido o Canvas daqui - agora está no AnimatedGradient global */}

      <div className="relative flex items-center min-h-screen w-full px-4 md:px-8 bg-gradient-to-r from-background via-background/70 to-transparent">
        <motion.div
          className="container mx-auto text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter">
            <AnimatedText text="Funis com I.A. que" el="span" className="block text-foreground" />
            <motion.span className="text-primary">
              <AnimatedText text="congelam a concorrência." el="span" />
            </motion.span>
          </motion.h1>
          <motion.p className="mt-6 max-w-xl text-lg md:text-xl text-muted-foreground" variants={itemVariants}>
            Inteligência Artificial aplicada em cada etapa. ROI previsível por machine learning para escalar seus
            resultados.
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap gap-4" variants={itemVariants}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border rounded-full backdrop-blur-sm"
              >
                {feature.icon}
                <span className="font-medium text-foreground">{feature.text}</span>
              </div>
            ))}
          </motion.div>
          <motion.div className="mt-10 flex flex-col sm:flex-row gap-4" variants={itemVariants}>
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all duration-300 group shadow-[0_0_20px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.8)]"
            >
              <Link href="/lista-espera">
                Ativar IA Agora
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => onOpenModal("demoVideo")}>
              Ver IA em Ação
            </Button>
            <form action={magicLogin}>
              <Button type="submit" size="lg" variant="secondary" className="w-full sm:w-auto">
                Acessar como Teste
              </Button>
            </form>
            <Button size="lg" variant="ghost" onClick={onOpenChatbot} className="hidden sm:flex">
              <Bot className="mr-2 h-5 w-5" />
              Falar com IA
            </Button>
          </motion.div>
        </motion.div>
      </div>
      {/* Floating Action Button for mobile */}
      <Button
        onClick={onOpenChatbot}
        className="sm:hidden fixed bottom-6 right-6 z-30 h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 flex items-center justify-center p-0"
        aria-label="Falar com IA"
      >
        <Bot className="h-8 w-8" />
      </Button>
    </header>
  )
}
