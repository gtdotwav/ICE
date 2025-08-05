"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import type { JSX } from "react/jsx-runtime"

type AnimatedTextProps = {
  text: string
  el?: keyof JSX.IntrinsicElements
  className?: string
}

export function AnimatedText({ text, el: Wrapper = "p", className }: AnimatedTextProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: 0.5, once: true })

  const defaultAnimations = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.05,
      },
    }),
  }

  let charCount = 0

  return (
    <Wrapper className={className}>
      <span className="sr-only">{text}</span>
      <motion.span ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} aria-hidden>
        {text.split(" ").map((word, wordIndex, arr) => (
          <span key={wordIndex} className="inline-block">
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={charIndex}
                className="inline-block text-sky-200"
                variants={defaultAnimations}
                custom={charCount++}
              >
                {char}
              </motion.span>
            ))}
            {wordIndex < arr.length - 1 && (
              <motion.span className="inline-block" variants={defaultAnimations} custom={charCount++}>
                &nbsp;
              </motion.span>
            )}
          </span>
        ))}
      </motion.span>
    </Wrapper>
  )
}
