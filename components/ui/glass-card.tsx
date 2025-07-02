"use client"

import { motion, type MotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

// Um componente reutilizável para o efeito de "glassmorphism".
// Combina `backdrop-blur` com um fundo semi-transparente e bordas sutis.
// O uso de `motion.div` permite que ele seja animado facilmente com Framer Motion.
// A propriedade `custom` é usada para criar animações escalonadas (staggered).
type GlassCardProps = HTMLAttributes<HTMLDivElement> &
  MotionProps & {
    custom?: number
  }

export function GlassCard({ className, children, custom, ...props }: GlassCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.98 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: [0.25, 1, 0.5, 1], // Curva de easing suave
      },
    }),
  }

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-ice-quantum-700/50 bg-ice-quantum-800/30 p-8 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-ai-cyan/50",
        className,
      )}
      variants={cardVariants}
      custom={custom}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
