"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play, X } from "lucide-react"

interface DemoVideoPopupProps {
  isOpen: boolean
  onClose: () => void
  videoUrl?: string
}

export function DemoVideoPopup({ isOpen, onClose, videoUrl }: DemoVideoPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-2xl w-[95vw] sm:w-full p-4 sm:p-6">
        <DialogHeader className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-bold gradient-text">Demo IceFunnel IA</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/10">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground text-center">
            Veja como nossa IA otimiza um funil em tempo real.
          </p>
        </DialogHeader>

        <div className="mt-4 sm:mt-6">
          {/* Video Placeholder */}
          <div className="aspect-video w-full bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg sm:rounded-xl border border-border/50 flex flex-col items-center justify-center gap-3 sm:gap-4 p-6 sm:p-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Play className="h-6 w-6 sm:h-8 sm:w-8 text-primary ml-1" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Demo em Breve</h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
                Estamos preparando uma demonstração incrível da nossa IA em ação.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-4 sm:mt-6 text-center">
            <Button
              onClick={() => {
                onClose()
                window.location.href = "/lista-espera"
              }}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-medium"
            >
              Quero ser notificado
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
