"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { FileText, ImageIcon, Video, Mail, Send, CheckCircle, Zap } from "lucide-react"

interface WebhookTestButtonProps {
  className?: string
}

export function WebhookTestButton({ className }: WebhookTestButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("copywriter")
  const [result, setResult] = useState<any>(null)
  const [showResult, setShowResult] = useState(false)
  const { toast } = useToast()

  // Estado para cada tipo de automação
  const [copywriterData, setCopywriterData] = useState({
    prompt: "Crie um headline persuasivo para um curso de marketing digital",
    copyType: "headline",
    targetAudience: "empreendedores iniciantes",
    tone: "persuasive",
    productName: "Marketing Pro",
    length: "medium",
  })

  const [imagesData, setImagesData] = useState({
    prompt: "Banner promocional para Black Friday com cores vibrantes",
    style: "professional",
    dimensions: "1200x630",
    format: "png",
    quantity: 1,
  })

  const [videosData, setVideosData] = useState({
    prompt: "Vídeo promocional de 30 segundos para lançamento de produto",
    duration: 30,
    style: "promotional",
    voiceType: "professional",
    includeMusic: true,
  })

  const [emailData, setEmailData] = useState({
    prompt: "Subject line para newsletter semanal sobre dicas de vendas",
    emailType: "newsletter",
    targetAudience: "profissionais de vendas",
    tone: "professional",
    callToAction: "Inscreva-se agora",
  })

  const handleCopywriterChange = (field: string, value: any) => {
    setCopywriterData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImagesChange = (field: string, value: any) => {
    setImagesData((prev) => ({ ...prev, [field]: value }))
  }

  const handleVideosChange = (field: string, value: any) => {
    setVideosData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEmailChange = (field: string, value: any) => {
    setEmailData((prev) => ({ ...prev, [field]: value }))
  }

  const getActiveData = () => {
    switch (activeTab) {
      case "copywriter":
        return {
          type: "copywriter",
          prompt: copywriterData.prompt,
          context: {
            copy_type: copywriterData.copyType,
            target_audience: copywriterData.targetAudience,
            tone: copywriterData.tone,
            product_name: copywriterData.productName,
            length: copywriterData.length,
          },
        }
      case "images":
        return {
          type: "images",
          prompt: imagesData.prompt,
          context: {
            style: imagesData.style,
            dimensions: imagesData.dimensions,
            format: imagesData.format,
            quantity: imagesData.quantity,
          },
        }
      case "videos":
        return {
          type: "videos",
          prompt: videosData.prompt,
          context: {
            duration: videosData.duration,
            style: videosData.style,
            voice_type: videosData.voiceType,
            include_music: videosData.includeMusic,
          },
        }
      case "email":
        return {
          type: "email",
          prompt: emailData.prompt,
          context: {
            email_type: emailData.emailType,
            target_audience: emailData.targetAudience,
            tone: emailData.tone,
            call_to_action: emailData.callToAction,
          },
        }
      default:
        return {
          type: "copywriter",
          prompt: "",
          context: {},
        }
    }
  }

  const simulateWebhook = async () => {
    setIsLoading(true)
    setShowResult(false)

    try {
      const data = getActiveData()

      // Preparar payload do webhook
      const webhookPayload = {
        event_type: "ai_automation_requested",
        request_id: `req_test_${Date.now()}`,
        user_id: "user_test_123",
        timestamp: new Date().toISOString(),
        automation_details: {
          type: data.type,
          prompt: data.prompt,
          context: data.context,
        },
        callback_config: {
          return_url: `${window.location.origin}/api/webhooks/ai-automation/callback`,
          user_interface_url: `${window.location.origin}/dashboard/ia`,
          notification_email: "test@example.com",
        },
      }

      // Enviar para o endpoint de teste
      const response = await fetch("/api/webhooks/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookPayload),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Webhook enviado com sucesso!",
          description: "Os dados foram enviados para o endpoint de teste.",
        })
        setResult(result)
        setShowResult(true)
      } else {
        throw new Error(result.error || "Erro ao enviar webhook")
      }
    } catch (error) {
      console.error("Erro ao simular webhook:", error)
      toast({
        title: "Erro ao enviar webhook",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao simular o webhook",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Teste de Webhook de IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="copywriter" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Copywriter</span>
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-1">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Imagens</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                <span className="hidden sm:inline">Vídeos</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Email</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="copywriter" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="copywriter-prompt">Prompt</Label>
                  <Textarea
                    id="copywriter-prompt"
                    value={copywriterData.prompt}
                    onChange={(e) => handleCopywriterChange("prompt", e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="copywriter-type">Tipo de Copy</Label>
                    <Select
                      value={copywriterData.copyType}
                      onValueChange={(value) => handleCopywriterChange("copyType", value)}
                    >
                      <SelectTrigger id="copywriter-type" className="mt-1">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="headline">Headline</SelectItem>
                        <SelectItem value="landing_page">Landing Page</SelectItem>
                        <SelectItem value="ad_copy">Ad Copy</SelectItem>
                        <SelectItem value="email_subject">Email Subject</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="copywriter-audience">Público-alvo</Label>
                    <Input
                      id="copywriter-audience"
                      value={copywriterData.targetAudience}
                      onChange={(e) => handleCopywriterChange("targetAudience", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="copywriter-tone">Tom</Label>
                    <Select
                      value={copywriterData.tone}
                      onValueChange={(value) => handleCopywriterChange("tone", value)}
                    >
                      <SelectTrigger id="copywriter-tone" className="mt-1">
                        <SelectValue placeholder="Selecione o tom" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Profissional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                        <SelectItem value="persuasive">Persuasivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="copywriter-product">Nome do Produto</Label>
                    <Input
                      id="copywriter-product"
                      value={copywriterData.productName}
                      onChange={(e) => handleCopywriterChange("productName", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="copywriter-length">Tamanho</Label>
                    <Select
                      value={copywriterData.length}
                      onValueChange={(value) => handleCopywriterChange("length", value)}
                    >
                      <SelectTrigger id="copywriter-length" className="mt-1">
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Curto</SelectItem>
                        <SelectItem value="medium">Médio</SelectItem>
                        <SelectItem value="long">Longo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="images-prompt">Descrição da Imagem</Label>
                  <Textarea
                    id="images-prompt"
                    value={imagesData.prompt}
                    onChange={(e) => handleImagesChange("prompt", e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="images-style">Estilo</Label>
                    <Select value={imagesData.style} onValueChange={(value) => handleImagesChange("style", value)}>
                      <SelectTrigger id="images-style" className="mt-1">
                        <SelectValue placeholder="Selecione o estilo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Profissional</SelectItem>
                        <SelectItem value="creative">Criativo</SelectItem>
                        <SelectItem value="minimalist">Minimalista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="images-dimensions">Dimensões</Label>
                    <Select
                      value={imagesData.dimensions}
                      onValueChange={(value) => handleImagesChange("dimensions", value)}
                    >
                      <SelectTrigger id="images-dimensions" className="mt-1">
                        <SelectValue placeholder="Selecione as dimensões" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1024x1024">1024x1024</SelectItem>
                        <SelectItem value="1200x630">1200x630</SelectItem>
                        <SelectItem value="800x600">800x600</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="images-format">Formato</Label>
                    <Select value={imagesData.format} onValueChange={(value) => handleImagesChange("format", value)}>
                      <SelectTrigger id="images-format" className="mt-1">
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpg">JPG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="images-quantity">Quantidade</Label>
                    <Input
                      id="images-quantity"
                      type="number"
                      min={1}
                      max={5}
                      value={imagesData.quantity}
                      onChange={(e) => handleImagesChange("quantity", Number.parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="videos-prompt">Script/Descrição do Vídeo</Label>
                  <Textarea
                    id="videos-prompt"
                    value={videosData.prompt}
                    onChange={(e) => handleVideosChange("prompt", e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="videos-duration">Duração (segundos)</Label>
                    <Input
                      id="videos-duration"
                      type="number"
                      min={15}
                      max={300}
                      value={videosData.duration}
                      onChange={(e) => handleVideosChange("duration", Number.parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="videos-style">Estilo</Label>
                    <Select value={videosData.style} onValueChange={(value) => handleVideosChange("style", value)}>
                      <SelectTrigger id="videos-style" className="mt-1">
                        <SelectValue placeholder="Selecione o estilo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="promotional">Promocional</SelectItem>
                        <SelectItem value="educational">Educacional</SelectItem>
                        <SelectItem value="testimonial">Depoimento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="videos-voice">Tipo de Voz</Label>
                    <Select
                      value={videosData.voiceType}
                      onValueChange={(value) => handleVideosChange("voiceType", value)}
                    >
                      <SelectTrigger id="videos-voice" className="mt-1">
                        <SelectValue placeholder="Selecione o tipo de voz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Profissional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="energetic">Energética</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 mt-8">
                    <input
                      type="checkbox"
                      id="videos-music"
                      checked={videosData.includeMusic}
                      onChange={(e) => handleVideosChange("includeMusic", e.target.checked)}
                      className="rounded border-primary/30 text-primary focus:ring-primary/50"
                    />
                    <Label htmlFor="videos-music">Incluir Música</Label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email-prompt">Descrição do Email</Label>
                  <Textarea
                    id="email-prompt"
                    value={emailData.prompt}
                    onChange={(e) => handleEmailChange("prompt", e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email-type">Tipo de Email</Label>
                    <Select
                      value={emailData.emailType}
                      onValueChange={(value) => handleEmailChange("emailType", value)}
                    >
                      <SelectTrigger id="email-type" className="mt-1">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="transactional">Transacional</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="email-audience">Público-alvo</Label>
                    <Input
                      id="email-audience"
                      value={emailData.targetAudience}
                      onChange={(e) => handleEmailChange("targetAudience", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-tone">Tom</Label>
                    <Select value={emailData.tone} onValueChange={(value) => handleEmailChange("tone", value)}>
                      <SelectTrigger id="email-tone" className="mt-1">
                        <SelectValue placeholder="Selecione o tom" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Profissional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="email-cta">Call to Action</Label>
                    <Input
                      id="email-cta"
                      value={emailData.callToAction}
                      onChange={(e) => handleEmailChange("callToAction", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          <div className="flex justify-end">
            <Button
              onClick={simulateWebhook}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {isLoading ? (
                <>
                  <motion.div className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Simular Webhook
                </>
              )}
            </Button>
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 border rounded-md bg-muted/30"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Webhook Enviado com Sucesso</h3>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                  Status 200
                </Badge>
              </div>
              <Separator className="my-2" />
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-2">Payload enviado:</p>
                <pre className="bg-black/80 p-4 rounded-md text-xs text-white overflow-auto max-h-60">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
