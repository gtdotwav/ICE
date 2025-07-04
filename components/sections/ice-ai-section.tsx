"use client"
import { Hologram } from "@/components/three/hologram-scene"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useRef } from "react"
import { View, PerspectiveCamera } from "@react-three/drei"

export function IceAiSection() {
  const viewRef = useRef<HTMLDivElement>(null)

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">ICE AI</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Construa, visualize e implante com o poder da IA
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Nossa plataforma de IA generativa permite que você descreva seus funis de marketing em linguagem natural e
              veja-os ganhar vida em tempo real. Gere código, visualize designs e implante com um único clique.
            </p>
            <Button size="lg">
              Comece a construir com IA
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          {/* This div is the placeholder in the DOM for the 3D view */}
          <div ref={viewRef} className="h-[400px] md:h-[500px] lg:h-[600px] w-full" />
        </div>
      </div>
      {/* The View component portals its contents into the main Canvas, tracked to the ref div */}
      <View track={viewRef}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 1, 2]} intensity={0.5} />
        <Hologram />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={25} />
      </View>
    </section>
  )
}
