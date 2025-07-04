"use client"

import { View } from "@react-three/drei"
import { useRef } from "react"
import { Hologram } from "@/components/three/hologram-scene"
import { AnimatedText } from "@/components/animated-text"

export function IceAiSection() {
  const viewRef = useRef<HTMLDivElement>(null)

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <AnimatedText>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Powered by ICE AI
              </h2>
            </AnimatedText>
            <AnimatedText delay={0.2}>
              <p className="text-xl text-muted-foreground">
                Nossa inteligência artificial revolucionária analisa comportamentos, otimiza conversões e personaliza
                experiências em tempo real.
              </p>
            </AnimatedText>
            <AnimatedText delay={0.4}>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Análise preditiva de comportamento</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Otimização automática de funis</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Personalização em tempo real</span>
                </li>
              </ul>
            </AnimatedText>
          </div>

          <div className="relative h-[400px] w-full">
            <div ref={viewRef} className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/10 to-blue-600/10">
              <View track={viewRef}>
                <Hologram />
              </View>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
