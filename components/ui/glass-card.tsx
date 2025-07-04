"use client"

import { motion, type MotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

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
        ease: [0.25, 1, 0.5, 1],
      },
    }),
  }

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-secondary/30 p-8 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-primary/50",
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
