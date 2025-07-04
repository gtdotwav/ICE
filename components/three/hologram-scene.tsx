"use client"

import { useFrame } from "@react-three/fiber"
import { Icosahedron, useTexture } from "@react-three/drei"
import { useRef, useMemo, useEffect } from "react"
import { gsap } from "gsap"
import * as THREE from "three"

/*────────────────── GLSL ──────────────────*/
const vertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main(){
    vUv = uv;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
  }`

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uScan;
  uniform sampler2D uTex;
  uniform vec3  uColor;
  varying vec2 vUv;
  varying vec3 vNormal;

  float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
  }

  void main(){
    vec2 uv = vUv;
    uv.y += rand(uv+uTime)*.04;          // glitch
    float scan = sin((uv.y+uScan)*200.)*.02;

    float fres = pow(1.- dot(vNormal, vec3(0.,0.,1.)), 2.);
    vec4 tex  = texture2D(uTex, uv);

    vec3 col = tex.rgb * uColor + scan + fres*.3;
    float a  = clamp(tex.a * fres*2., 0., 1.);

    gl_FragColor = vec4(col, a);
  }`

/*───────────────── Mesh ───────────────────*/
export function Hologram() {
  const mesh = useRef<any>(null!)
  const mat = useRef<any>(null!)
  const tex = useTexture("/placeholder-logo.png")

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScan: { value: 0 },
      uTex: { value: tex },
      uColor: { value: new THREE.Color("#00ffff") },
    }),
    [tex],
  )

  // perpetual scan-line animation
  useEffect(() => {
    if (mat.current)
      gsap.to(mat.current.uniforms.uScan, {
        value: 1.5,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
  }, [])

  useFrame((state, delta) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value = state.clock.getElapsedTime()
    }
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.1
      mesh.current.rotation.y += delta * 0.15
    }
  })

  return (
    <Icosahedron ref={mesh} args={[2, 20]} dispose={null}>
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </Icosahedron>
  )
}
