"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AnimatedText } from "@/components/animated-text"
import { DemoVideoPopup } from "@/components/popups/demo-video-popup"
import { ArrowRight, Play, Sparkles } from "lucide-react"

export default function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/40" />

      {/* Interactive Mouse Glow - Hidden on mobile */}
      <div
        className="absolute pointer-events-none opacity-20 transition-opacity duration-500 hidden sm:block"
        style={{
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
          width: 300,
          height: 300,
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 60%)",
          borderRadius: "50%",
        }}
      />

      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="text-center">
          {/* Logo and Brand - Mobile Optimized */}
          <div className="flex items-center justify-center mb-6 sm:mb-8 animate-fade-in">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-500 w-full max-w-sm sm:max-w-none sm:w-auto">
              <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4">
                <div className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
                  <Image
                    src="/ice-logo.png"
                    alt="IceFunnel"
                    width={64}
                    height={64}
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                    IceFunnel
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground/80">AI-Powered Engine</p>
                </div>
              </div>
            </div>
          </div>

          {/* Beta Badge - Mobile Optimized */}
          <div className="flex justify-center mb-6 sm:mb-8 animate-slide-up px-4">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="backdrop-blur-sm bg-primary/10 border border-primary/20 rounded-full px-4 sm:px-6 py-2 hover:bg-primary/15 transition-all duration-300 cursor-pointer hover:scale-105 w-full max-w-xs sm:max-w-none sm:w-auto"
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-primary">Beta Exclusivo • Acesso de Teste</span>
              </div>
            </button>
          </div>

          {/* Main Headline - Mobile Optimized */}
          <div className="mb-6 sm:mb-8 animate-slide-up animation-delay-200 px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="gradient-text block sm:inline">Funis com IA que</span>
              <br className="hidden sm:block" />
              <span className="block sm:inline mt-2 sm:mt-0">
                <AnimatedText text="Congelam a Concorrência" className="gradient-primary" delay={0.5} />
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
              Inteligência Artificial aplicada em cada etapa do seu funil para um{" "}
              <span className="text-primary font-semibold">ROI previsível</span> e{" "}
              <span className="text-primary font-semibold">crescimento escalável</span>.
            </p>
          </div>

          {/* CTA Buttons - Mobile Optimized */}
          <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 animate-slide-up animation-delay-400 px-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/25 w-full sm:w-auto min-h-[48px]"
              onClick={() => (window.location.href = "/lista-espera")}
            >
              Entrar na Lista VIP
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="glass-button border-white/20 hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300 bg-transparent w-full sm:w-auto min-h-[48px]"
              onClick={() => setIsVideoOpen(true)}
            >
              <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Ver Demo
            </Button>
          </div>

          {/* Social Proof - Mobile Optimized */}
          <div className="animate-fade-in animation-delay-600 px-4">
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Já escolhido por mais de 500+ empreendedores
            </p>
            <div className="flex justify-center items-center gap-2">
              <div className="flex -space-x-1 sm:-space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-background flex items-center justify-center text-xs font-semibold"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground ml-2">+495 outros</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Video Popup */}
      <DemoVideoPopup
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
      />
    </section>
  )
}

// Named export for compatibility
export { HeroSection }
