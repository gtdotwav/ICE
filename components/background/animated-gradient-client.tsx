"use client"

import dynamic from "next/dynamic"

// 1️⃣  Dynamically import the real AnimatedGradient and turn off SSR.
//     This file itself is a Client Component, so using next/dynamic here is allowed.
const AnimatedGradient = dynamic(() => import("./animated-gradient").then((m) => m.AnimatedGradient ?? m.default), {
  ssr: false,
})

export default function AnimatedGradientClient() {
  // Forward all props in case you later add configurability.
  return <AnimatedGradient />
}
