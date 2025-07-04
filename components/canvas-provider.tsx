"use client"

import { Canvas } from "@react-three/fiber"
import { View } from "@react-three/drei"
import { type ReactNode, useEffect, useState } from "react"

interface CanvasProviderProps {
  children: ReactNode
}

export function CanvasProvider({ children }: CanvasProviderProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: -1,
        }}
        camera={{ position: [0, 0, 5] }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 1, 2]} intensity={0.5} />
        <View.Port />
      </Canvas>
    </>
  )
}
