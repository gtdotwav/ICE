"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

type AnimatedTextProps = {
  text: string
  el?: keyof JSX.IntrinsicElements
  className?: string
}

export function AnimatedText({ text, el: Wrapper = "p", className }: AnimatedTextProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: 0.5, once: true })

  return (
    <Wrapper className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        ref={ref}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        aria-hidden
        className="inline-block bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent"
      >
        {text}
      </motion.span>
    </Wrapper>
  )
}
