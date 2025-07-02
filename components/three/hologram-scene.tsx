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
      const x = (mouse.x * viewport.width) / 100
      const y = (mouse.y * viewport.height) / 100
      groupRef.current.rotation.y += 0.001
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, x, 0.05)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, y, 0.05)
    }
  })

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight color="#00F0FF" position={[-5, 2, 5]} intensity={15} />
      <pointLight color="#8B5CF6" position={[5, -2, 5]} intensity={15} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <group ref={groupRef}>
        <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1.5}>
          <TorusKnot args={[1, 0.3, 200, 32]} scale={1.2}>
            <meshStandardMaterial
              color="#6BB7E7"
              emissive="#00F0FF"
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.1}
              wireframe
            />
          </TorusKnot>
        </Float>
      </group>
    </>
  )
}
