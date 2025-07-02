"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { TorusKnot, Stars, Float } from "@react-three/drei"
import * as THREE from "three"

export function HologramScene() {
  const { viewport, mouse } = useThree()
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      const x = (mouse.x * viewport.width) / 600 // Reduzido para movimento mais sutil
      const y = (mouse.y * viewport.height) / 600
      groupRef.current.rotation.y += 0.0005 // Rotação mais lenta
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, x, 0.02)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, y, 0.02)
    }
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight color="#00F0FF" position={[-8, 3, 8]} intensity={15} />
      <pointLight color="#8B5CF6" position={[8, -3, 8]} intensity={15} />
      <Stars radius={150} depth={80} count={3000} factor={3} saturation={0} fade speed={0.5} />
      <group ref={groupRef}>
        <Float speed={0.8} rotationIntensity={0.6} floatIntensity={0.8}>
          <TorusKnot args={[1.2, 0.4, 200, 32]} scale={0.8} position={[0, 0, -2]}>
            <meshStandardMaterial
              color="#6BB7E7"
              emissive="#00F0FF"
              emissiveIntensity={0.6}
              metalness={0.9}
              roughness={0.1}
              wireframe
              transparent
              opacity={0.95}
            />
          </TorusKnot>
        </Float>
      </group>
    </>
  )
}
