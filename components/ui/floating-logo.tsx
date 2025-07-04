"use client"

import { useState, useEffect } from "react"
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

  useEffect(() => {
    if (!showOnScroll) return

    const handleScroll = () => {
      const scrolled = window.scrollY > 100
      setIsVisible(scrolled)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showOnScroll])

  // Position classes
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  }

  // Size classes
  const sizeClasses = {
    sm: "h-10 w-10 p-2",
    md: "h-12 w-12 p-2.5",
    lg: "h-16 w-16 p-3",
  }

  const logoSizes = {
    sm: { width: 24, height: 24 },
    md: { width: 28, height: 28 },
    lg: { width: 40, height: 40 },
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed z-50 transition-all duration-300 ease-in-out",
        "glass-card backdrop-blur-sm border border-white/10 rounded-xl",
        "hover:scale-110 hover:shadow-lg hover:shadow-primary/20",
        "animate-fade-in cursor-pointer",
        positionClasses[position],
        sizeClasses[size],
        className,
      )}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <Image
        src="/ice-logo.png"
        alt="IceFunnel"
        width={logoSizes[size].width}
        height={logoSizes[size].height}
        className="object-contain"
        priority
      />
    </div>
  )
}
