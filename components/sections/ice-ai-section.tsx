"use client"

import { useRef } from "react"
import { View } from "@react-three/drei"
import { Hologram } from "@/components/three/hologram-scene"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { AnimatedText } from "../animated-text"

export function IceAiSection() {
  const viewRef = useRef<HTMLDivElement>(null!)

  return (
    <section id="ice-ai" className="relative overflow-hidden bg-gray-900/50 py-20 md:py-32">
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div className="relative z-10 space-y-6 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
            <AnimatedText text="Powered by IceAI" />
          </h2>
          <p className="max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our advanced AI analyzes your business and generates high-converting funnels in minutes. Say goodbye to
            guesswork and hello to data-driven results.
          </p>
          <Button size="lg" variant="secondary">
            Explore AI Tools
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <div className="relative h-80 w-full md:h-96">
          <div ref={viewRef} className="absolute inset-0" />
          <View track={viewRef}>
            {/* Added lights to ensure the hologram is visible */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, -5, -5]} intensity={0.5} color="#00ffff" />
            <Hologram />
          </View>
        </div>
      </div>
    </section>
  )
}
