"use client"

import { motion } from "framer-motion"

export const TypingIndicator = () => {
  const dotVariants = {
    initial: { y: 0, scale: 0.8, opacity: 0.5 },
    animate: {
      y: [0, -5, 0],
      scale: [0.8, 1, 0.8],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.div className="flex gap-1.5 items-center px-4 py-3" aria-label="Bot is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2.5 h-2.5 bg-ice-primary/70 rounded-full"
          variants={dotVariants}
          initial="initial"
          animate="animate"
          custom={i}
          transition={{ ...dotVariants.animate.transition, delay: i * 0.2 }}
        />
      ))}
    </motion.div>
  )
}
