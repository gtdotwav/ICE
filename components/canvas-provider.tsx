"use client"

import { Canvas } from "@react-three/fiber"
import { type ReactNode, useRef } from "react"

export function CanvasProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {children}
      {/* The shared canvas for all 3D views, positioned in the background */}
      <Canvas eventSource={containerRef} className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none" />
    </div>
  )
}
