"use client"

import { Canvas } from "@react-three/fiber"
import { type ReactNode, useEffect, useRef, useState } from "react"

/**
 * One global <Canvas>. 3-D views elsewhere on the page use
 * @react-three/drei‘s <View track={ref}> to portal into it.
 */
export function CanvasProvider({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  //  Canvas must only render on the client.
  useEffect(() => setMounted(true), [])

  return (
    <div ref={rootRef} className="relative min-h-screen">
      {children}
      {mounted && (
        <Canvas eventSource={rootRef.current ?? undefined} className="fixed inset-0 -z-10 pointer-events-none" />
      )}
    </div>
  )
}
