"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import type { ReactNode } from "react"
import { useEffect } from "react"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  // Previne scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    // Cleanup
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Fecha modal com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full max-w-2xl rounded-lg border border-border bg-background/95 shadow-2xl shadow-black/50 backdrop-blur-2xl"
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={onClose}
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                aria-label="Fechar modal"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 pt-8">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
