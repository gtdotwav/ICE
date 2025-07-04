"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface FloatingLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  showOnScroll?: boolean
}

export function FloatingLogo({
  className,
  size = "md",
  position = "top-left",
  showOnScroll = false,
}: FloatingLogoProps) {
  const [isVisible, setIsVisible] = useState(!showOnScroll)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll visibility
  useEffect(() => {
    if (!showOnScroll) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const shouldShow = scrollTop > 100 // Show after scrolling 100px
      setIsVisible(shouldShow)
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showOnScroll])

  // Size configurations
  const sizeConfig = {
    sm: { width: 40, height: 40, containerSize: "h-12 w-12" },
    md: { width: 48, height: 48, containerSize: "h-14 w-14" },
    lg: { width: 56, height: 56, containerSize: "h-16 w-16" },
  }

  // Position configurations
  const positionConfig = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  }

  const config = sizeConfig[size]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            // Base positioning and z-index
            "fixed z-50",
            positionConfig[position],
            // Glass morphism container
            "glass-card backdrop-blur-xl border border-white/20",
            "rounded-2xl p-2",
            config.containerSize,
            // Hover effects
            "hover:scale-110 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20",
            "transition-all duration-300 ease-out",
            // Scroll-based styling
            isScrolled && "bg-background/60",
            className,
          )}
        >
          {/* Logo container with subtle glow effect */}
          <div className="relative h-full w-full flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/10 rounded-xl blur-sm opacity-50" />
            <Image
              src="/ice-logo.png"
              alt="IceFunnel"
              width={config.width}
              height={config.height}
              priority
              className="relative z-10 object-contain drop-shadow-sm"
            />
          </div>

          {/* Subtle pulse animation on hover */}
          <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
