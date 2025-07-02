"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { HologramScene } from "@/components/three/hologram-scene"

// Este componente cria um gradiente animado e sutil que fica no fundo da página.
// Agora inclui o HologramScene como fundo 3D em todo o site.
export function AnimatedGradient() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 h-full w-full bg-background">
      {/* Canvas 3D como fundo */}
      <div className="absolute inset-0 opacity-50">
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 8], fov: 35 }}
            style={{ background: "transparent" }}
            dpr={[1, 1.5]} // Limita DPR para performance
          >
            <HologramScene />
          </Canvas>
        </Suspense>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--secondary))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--secondary))_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-15" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
    </div>
  )
}
