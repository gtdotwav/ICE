"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, X, Sparkles, Zap, Target } from "lucide-react"
import Image from "next/image"

interface DemoVideoPopupProps {
  isOpen: boolean
  onClose: () => void
  videoUrl?: string
}

export function DemoVideoPopup({ isOpen, onClose, videoUrl }: DemoVideoPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-4xl w-[95vw] sm:w-full p-0 overflow-hidden">
        {/* Header */}
        <div className="relative p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-primary/5 to-blue-500/5">
          <DialogHeader className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-lg sm:text-xl font-bold gradient-text">IceFunnel IA em Ação</DialogTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground">Demonstração da Inteligência Artificial</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/10 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Zap className="h-3 w-3 mr-1" />
                IA Avançada
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                <Target className="h-3 w-3 mr-1" />
                ROI Otimizado
              </Badge>
              <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                Tempo Real
              </Badge>
            </div>
          </DialogHeader>
        </div>

        {/* Demo Content */}
        <div className="p-4 sm:p-6">
          {/* Main Demo Display */}
          <div className="relative mb-6">
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-border/50 bg-gradient-to-br from-background/50 to-muted/20 shadow-2xl">
              <Image
                src="/ice-funnel-demo.gif"
                alt="IceFunnel IA Demo - Inteligência Artificial otimizando funis em tempo real"
                width={800}
                height={450}
                className="w-full h-full object-cover"
                unoptimized
                priority
              />
            </div>

            {/* Overlay Info */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div className="backdrop-blur-md bg-black/20 rounded-lg px-3 py-2">
                <p className="text-white text-sm font-medium">🔴 AO VIVO</p>
              </div>
              <div className="backdrop-blur-md bg-black/20 rounded-lg px-3 py-2">
                <p className="text-white text-xs">IA Processando...</p>
              </div>
            </div>
          </div>

          {/* Features Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h4 className="font-semibold text-sm mb-1">IA Preditiva</h4>
              <p className="text-xs text-muted-foreground">Antecipa comportamentos</p>
            </div>

            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-500/20">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Target className="h-4 w-4 text-blue-400" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Otimização Auto</h4>
              <p className="text-xs text-muted-foreground">Ajustes em tempo real</p>
            </div>

            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-500/20">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center">
                <Zap className="h-4 w-4 text-green-400" />
              </div>
              <h4 className="font-semibold text-sm mb-1">ROI Máximo</h4>
              <p className="text-xs text-muted-foreground">Resultados garantidos</p>
            </div>
          </div>

          {/* Description */}
          <div className="text-center mb-6 p-4 rounded-lg bg-muted/20 border border-border/50">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Veja como nossa IA analisa, otimiza e escala seus funis automaticamente.
              <span className="text-primary font-medium"> Cada decisão é baseada em dados reais</span> para maximizar
              suas conversões e ROI.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => {
                onClose()
                window.location.href = "/lista-espera"
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/25"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Quero Acesso VIP
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                onClose()
                window.location.href = "/dashboard"
              }}
              className="border-primary/20 hover:bg-primary/5 px-6 py-3 rounded-lg font-medium hover:scale-105 transition-all duration-300"
            >
              <Play className="mr-2 h-4 w-4" />
              Testar Agora (Beta)
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="text-center p-3 rounded-lg bg-gradient-to-r from-primary/5 to-blue-500/5 border border-primary/10">
            <p className="text-xs text-muted-foreground">
              🚀 <span className="font-medium text-primary">Oferta Limitada:</span> Primeiros 100 usuários ganham acesso
              vitalício gratuito
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
