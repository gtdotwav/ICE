"use client"

import dynamic from "next/dynamic"

const AnimatedGradient = dynamic(() => import("./animated-gradient").then((m) => m.AnimatedGradient), {
  ssr: false,
})

export default function AnimatedGradientClient() {
  return <AnimatedGradient />
}
