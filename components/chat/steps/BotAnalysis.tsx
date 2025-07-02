"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BrainCircuit, CheckCircle, Target } from "lucide-react"

const analysisSteps = [
  { text: "Analisando suas respostas...", icon: <BrainCircuit className="h-5 w-5" /> },
  { text: "Cruzando com 2.5M de decisões/dia...", icon: <Target className="h-5 w-5" /> },
  { text: "Personalizando solução ideal...", icon: <CheckCircle className="h-5 w-5" /> },
]

export const BotAnalysis = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnalysis((prev) => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1
        }
        clearInterval(interval)
        return prev
      })
    }, 1200) // Aumenta o tempo para dar mais peso à análise

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-3 p-2">
      {analysisSteps.map((step, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-3 text-sm"
          initial={{ opacity: 0.3, x: -10 }}
          animate={{
            opacity: currentAnalysis >= index ? 1 : 0.3,
            x: currentAnalysis >= index ? 0 : -10,
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-shrink-0">
            {currentAnalysis > index ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <div className="relative flex h-5 w-5 items-center justify-center">
                {currentAnalysis === index && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/75" />
                )}
                {step.icon}
              </div>
            )}
          </div>
          <span>{step.text}</span>
        </motion.div>
      ))}
    </div>
  )
}
