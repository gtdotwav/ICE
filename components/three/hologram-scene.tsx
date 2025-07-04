"use client"

import { Canvas as ThreeCanvas, useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import { useRef, useMemo, useEffect } from "react"
import * as THREE from "three"
import { gsap } from "gsap"

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
void main() {
  vUv = uv;
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
uniform float uScanline;
uniform sampler2D uTexture;
uniform vec3 uColor;
varying vec2 vUv;
varying vec3 vNormal;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  float time = uTime * 0.2;
  vec2 uv = vUv;

  // Glitch effect
  float glitch = random(uv + time) * 0.05;
  uv.y += glitch;

  // Scanline effect
  float scanline = sin((uv.y + uScanline) * 200.0) * 0.02;
  
  // Fresnel effect
  float fresnel = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
  fresnel = pow(fresnel, 2.0);

  vec4 texColor = texture2D(uTexture, uv);
  vec3 finalColor = texColor.rgb * uColor;

  // Combine effects
  finalColor += scanline;
  finalColor += fresnel * 0.3;
  
  float alpha = texColor.a * fresnel * 2.0;
  alpha = clamp(alpha, 0.0, 1.0);

  gl_FragColor = vec4(finalColor, alpha);
}
`

// Create the geometry once and reuse it
const icosahedronGeometry = new THREE.IcosahedronGeometry(2, 20)

export const Hologram = () => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const texture = useTexture("/placeholder-logo.png")

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScanline: { value: 0 },
      uTexture: { value: texture },
      uColor: { value: new THREE.Color("#00ffff") },
    }),
    [texture],
  )

  useEffect(() => {
    if (materialRef.current) {
      gsap.to(materialRef.current.uniforms.uScanline, {
        value: 1.5,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    }
  }, [])

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
    }
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1
      meshRef.current.rotation.y += delta * 0.15
    }
  })

  return (
    // Use a group with dispose={null} to prevent R3F from disposing the shared geometry
    <group dispose={null}>
      <mesh ref={meshRef} geometry={icosahedronGeometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

export function HologramScene() {
  return (
    <ThreeCanvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 1, 2]} intensity={0.5} />
      <Hologram />
    </ThreeCanvas>
  )
}
