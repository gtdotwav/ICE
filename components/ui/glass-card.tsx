"use client"

import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import type React from "react"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  className?: string
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const cardVariants = {
    initial: { opacity: 0, y: 40, scale: 0.98 },
    inView: (custom: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: custom * 0.1,
        ease: [0.25, 1, 0.5, 1],
      },
    }),
  }

  return (
    <motion.div
      onMouseMove={(e) => {
        const { left, top } = e.currentTarget.getBoundingClientRect()
        mouseX.set(e.clientX - left)
        mouseY.set(e.clientY - top)
      }}
      variants={cardVariants}
      initial="initial"
      whileInView="inView"
      viewport={{ once: true, amount: 0.3 }}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border p-6 md:p-8",
        "border-white/10 bg-black/20 backdrop-blur-lg",
        "transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-primary/10",
        className,
      )}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              hsl(var(--primary) / 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
