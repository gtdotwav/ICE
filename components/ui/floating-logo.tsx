"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface FloatingLogoProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  size?: "sm" | "md" | "lg"
  showOnScroll?: boolean
  className?: string
}

export function FloatingLogo({
  position = "top-right",
  size = "md",
  showOnScroll = true,
  className,
}: FloatingLogoProps) {
  const [isVisible, setIsVisible] = useState(!showOnScroll)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    if (!showOnScroll) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setIsVisible(currentScrollY > 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showOnScroll])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const sizeClasses = {
    sm: "w-10 h-10 p-2",
    md: "w-12 h-12 p-2.5",
    lg: "w-14 h-14 p-3",
  }

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  }

  const logoSizes = {
    sm: 24,
    md: 28,
    lg: 32,
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className={cn(
            "fixed z-50 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg hover:bg-white/20 transition-all duration-300 cursor-pointer",
            sizeClasses[size],
            positionClasses[position],
            className,
          )}
          style={{
            transform: `translateY(${Math.min(scrollY * 0.1, 20)}px)`,
          }}
        >
          <Image
            src="/ice-logo.png"
            alt="IceFunnel"
            width={logoSizes[size]}
            height={logoSizes[size]}
            className="object-contain drop-shadow-sm"
          />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
