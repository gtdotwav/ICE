"use client"

import { motion } from "framer-motion"

type Option = { text: string; value: string; score?: any; nextStep?: number }

type QuickReplyProps = {
  options: Option[]
  onSelect: (option: Option) => void
  disabled?: boolean
}

export const QuickReply = ({ options, onSelect, disabled }: QuickReplyProps) => {
  if (!options || options.length === 0) return null

  return (
    <motion.div
      className="flex flex-wrap gap-2 justify-end pt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {options.map((option, index) => (
        <motion.button
          key={option.value}
          onClick={() => onSelect(option)}
          disabled={disabled}
          className="px-4 py-2 text-sm font-semibold text-primary border border-primary/50 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
        >
          {option.text}
        </motion.button>
      ))}
    </motion.div>
  )
}
