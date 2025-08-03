"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Cookie, Settings, Shield, BarChart, Target, X } from "lucide-react"
import { cookieManager, type CookieConsent } from "@/lib/cookie-manager"

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [consent, setConsent] = useState<Partial<CookieConsent>>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  })

  useEffect(() => {
    // Check if user has already given consent
    const existingConsent = cookieManager.getConsent()
    if (!existingConsent) {
      setShowBanner(true)
    } else {
      setConsent(existingConsent)
    }
  }, [])

  const handleAcceptAll = () => {
    const fullConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    }
    
    cookieManager.setConsent(fullConsent)
    setConsent(fullConsent)
    setShowBanner(false)
  }

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    }
    
    cookieManager.setConsent(necessaryOnly)
    setConsent(necessaryOnly)
    setShowBanner(false)
  }

  const handleCustomConsent = () => {
    cookieManager.setConsent(consent)
    setShowBanner(false)
    setShowSettings(false)
  }

  const cookieCategories = [
    {
      key: 'necessary' as keyof CookieConsent,
      title: 'Cookies Necessários',
      description: 'Essenciais para o funcionamento básico do site',
      icon: Shield,
      required: true,
      examples: ['Autenticação', 'Segurança', 'Preferências básicas']
    },
    {
      key: 'analytics' as keyof CookieConsent,
      title: 'Cookies de Analytics',
      description: 'Nos ajudam a entender como você usa o site',
      icon: BarChart,
      required: false,
      examples: ['Google Analytics', 'Métricas de performance', 'Heatmaps']
    },
    {
      key: 'marketing' as keyof CookieConsent,
      title: 'Cookies de Marketing',
      description: 'Usados para personalizar anúncios e campanhas',
      icon: Target,
      required: false,
      examples: ['Facebook Pixel', 'Google Ads', 'Remarketing']
    },
    {
      key: 'preferences' as keyof CookieConsent,
      title: 'Cookies de Preferências',
      description: 'Salvam suas configurações e preferências',
      icon: Settings,
      required: false,
      examples: ['Tema', 'Idioma', 'Layout personalizado']
    }
  ]

  return (
    <>
      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-lg border-t border-border shadow-2xl"
          >
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Cookie className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      Nós usamos cookies
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Utilizamos cookies para melhorar sua experiência, personalizar conteúdo e analisar nosso tráfego. 
                      Ao continuar navegando, você concorda com nossa{" "}
                      <a href="/privacy" className="text-primary hover:underline">
                        Política de Privacidade
                      </a>.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                    className="glass-button bg-transparent"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Personalizar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAcceptNecessary}
                    className="glass-button bg-transparent"
                  >
                    Apenas Necessários
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Aceitar Todos
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl glass-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              Configurações de Cookies
            </DialogTitle>
            <DialogDescription>
              Escolha quais tipos de cookies você permite. Você pode alterar essas configurações a qualquer momento.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {cookieCategories.map((category) => (
              <Card key={category.key} className="glass-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <category.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {category.title}
                          {category.required && (
                            <Badge variant="secondary" className="text-xs">
                              Obrigatório
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {category.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={consent[category.key] || false}
                      onCheckedChange={(checked) => 
                        setConsent(prev => ({ ...prev, [category.key]: checked }))
                      }
                      disabled={category.required}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-muted-foreground">
                    <strong>Exemplos:</strong> {category.examples.join(', ')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setShowSettings(false)}
              className="glass-button bg-transparent"
            >
              Cancelar
            </Button>
            <Button onClick={handleCustomConsent}>
              Salvar Preferências
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}