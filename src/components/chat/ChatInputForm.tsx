"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"

type ChatInputFormProps = {
  inputType: "email" | "text"
  placeholder: string
  onSubmit: (value: string) => void
  disabled?: boolean
}

export const ChatInputForm = ({ inputType, placeholder, onSubmit, disabled }: ChatInputFormProps) => {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (disabled) return

    if (inputType === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setError("Por favor, insira um e-mail válido.")
        return
      }
    }

    if (!value.trim()) {
      setError("Este campo é obrigatório.")
      return
    }

    setError("")
    setIsSubmitting(true)
    // Simula uma pequena latência de rede
    setTimeout(() => {
      onSubmit(value)
      // O componente pai irá desabilitar o form via props
    }, 500)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex items-center gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-grow">
        <Input
          type={inputType}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          className="bg-background/50 border-border focus-visible:ring-primary"
        />
        {error && <p className="text-destructive text-xs mt-1 ml-1">{error}</p>}
      </div>
      <Button type="submit" size="icon" disabled={disabled || isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
      </Button>
    </motion.form>
  )
}
