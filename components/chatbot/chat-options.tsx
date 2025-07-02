"use client"

import { motion } from "framer-motion"
import type { Option } from "@/hooks/use-chatbot-logic"

type ChatOptionsProps = {
  options: Option[]
  onSelect: (option: Option) => void
}

export function ChatOptions({ options, onSelect }: ChatOptionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {options.map((option, index) => (
        <motion.button
          key={option.value}
          onClick={() => onSelect(option)}
          className="px-4 py-2 text-sm font-semibold text-ice-blue bg-ice-blue/10 border border-ice-blue/30 rounded-full hover:bg-ice-blue/20 transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.1 }}
        >
          {option.text}
        </motion.button>
      ))}
    </div>
  )
}
