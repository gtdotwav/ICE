"use client"

import { motion } from "framer-motion"

export function TypingIndicator() {
  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -4, 0],
      transition: {
        duration: 0.8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.div className="flex gap-1.5 items-center" aria-label="Bot is typing">
      <motion.span
        className="w-2 h-2 bg-ice-blue/50 rounded-full"
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotVariants.animate.transition, delay: 0 }}
      />
      <motion.span
        className="w-2 h-2 bg-ice-blue/50 rounded-full"
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotVariants.animate.transition, delay: 0.2 }}
      />
      <motion.span
        className="w-2 h-2 bg-ice-blue/50 rounded-full"
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotVariants.animate.transition, delay: 0.4 }}
      />
    </motion.div>
  )
}
