"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Send, CheckCircle, XCircle, FileText, ImageIcon, Video, Mail } from "lucide-react"

type AutomationType = "copywriter" | "images" | "videos" | "email"

interface WebhookTestData {
  copywriter: {
    prompt: string
    copyType: string
    targetAudience: string
    tone: string
    productName: string
    length: string
  }
  images: {
    description: string
    style: string
    dimensions: string
    format: string
    quantity: number
  }
  videos: {
    script: string
    duration: string
    style: string
    voiceType: string
    includeMusic: boolean
  }
  email: {
    description: string
    emailType: string
    targetAudience: string
    tone: string
    callToAction: string
  }
}

const initialData: WebhookTestData = {
  copywriter: {
    prompt: "Crie um texto persuasivo para landing page",
    copyType: "landing-page",
    targetAudience: "empreendedores",
    tone: "persuasivo",
    productName: "HIAS FLOW",
    length: "médio",
  },
  images: {
    description: "Imagem de hero para landing page de SaaS",
    style: "moderno",
    dimensions: "1920x1080",
    format: "PNG",
    quantity: 1,
  },
  videos: {
    script: "Vídeo explicativo sobre automação de funis",
    duration: "60",
    style: "profissional",
    voiceType: "feminina",
    includeMusic: false,
  },
  email: {
    description: "Email de boas-vindas para novos usuários",
    emailType: "welcome",
    targetAudience: "novos-usuarios",
    tone: "amigável",
    callToAction: "Começar agora",
  },
}

export function WebhookTestButton() {
  const [activeTab, setActiveTab] = useState<AutomationType>("copywriter")
  const [formData, setFormData] = useState<WebhookTestData>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()

  const updateFormData = (type: AutomationType, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }))
  }

  const simulateWebhook = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const webhookData = {
        event: "ai_automation.requested",
        requestId,
        userId: "user_123",
        timestamp: new Date().toISOString(),
        automation: {
          type: activeTab,
          context: formData[activeTab],
        },
        callback: {
          url: process.env.AI_AUTOMATION_WEBHOOK_URL || "https://webhook.site/test",
          secret: process.env.AI_AUTOMATION_WEBHOOK_SECRET || "test_secret",
        },
      }

      const response = await fetch("/api/webhooks/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookData),
      })

      const responseData = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          data: responseData,
          webhook: webhookData,
        })
        toast({
          title: "Webhook enviado com sucesso!",
          description: `Simulação de ${activeTab} executada com sucesso.`,
        })
      } else {
        throw new Error(responseData.error || "Erro desconhecido")
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      })
      toast({
        variant: "destructive",
        title: "Erro ao enviar webhook",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderCopywriterForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea
          id="prompt"
          value={formData.copywriter.prompt}
          onChange={(e) => updateFormData("copywriter", "prompt", e.target.value)}
          placeholder="Descreva o que você quer que a IA escreva..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="copyType">Tipo de Copy</Label>
          <Select
            value={formData.copywriter.copyType}
            onValueChange={(value) => updateFormData("copywriter", "copyType", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="landing-page">Landing Page</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="ad-copy">Anúncio</SelectItem>
              <SelectItem value="social-media">Redes Sociais</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tone">Tom</Label>
          <Select
            value={formData.copywriter.tone}
            onValueChange={(value) => updateFormData("copywriter", "tone", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="persuasivo">Persuasivo</SelectItem>
              <SelectItem value="amigável">Amigável</SelectItem>
              <SelectItem value="profissional">Profissional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="targetAudience">Público-alvo</Label>
          <Input
            id="targetAudience"
            value={formData.copywriter.targetAudience}
            onChange={(e) => updateFormData("copywriter", "targetAudience", e.target.value)}
            placeholder="Ex: empreendedores"
          />
        </div>
        <div>
          <Label htmlFor="productName">Nome do Produto</Label>
          <Input
            id="productName"
            value={formData.copywriter.productName}
            onChange={(e) => updateFormData("copywriter", "productName", e.target.value)}
            placeholder="Ex: HIAS FLOW"
          />
        </div>
      </div>
    </div>
  )

  const renderImagesForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="description">Descrição da Imagem</Label>
        <Textarea
          id="description"
          value={formData.images.description}
          onChange={(e) => updateFormData("images", "description", e.target.value)}
          placeholder="Descreva a imagem que você quer gerar..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="style">Estilo</Label>
          <Select value={formData.images.style} onValueChange={(value) => updateFormData("images", "style", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="moderno">Moderno</SelectItem>
              <SelectItem value="minimalista">Minimalista</SelectItem>
              <SelectItem value="corporativo">Corporativo</SelectItem>
              <SelectItem value="criativo">Criativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="dimensions">Dimensões</Label>
          <Select
            value={formData.images.dimensions}
            onValueChange={(value) => updateFormData("images", "dimensions", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1920x1080">1920x1080 (16:9)</SelectItem>
              <SelectItem value="1080x1080">1080x1080 (1:1)</SelectItem>
              <SelectItem value="1080x1350">1080x1350 (4:5)</SelectItem>
              <SelectItem value="1200x630">1200x630 (OG)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="format">Formato</Label>
          <Select value={formData.images.format} onValueChange={(value) => updateFormData("images", "format", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PNG">PNG</SelectItem>
              <SelectItem value="JPG">JPG</SelectItem>
              <SelectItem value="WEBP">WEBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="quantity">Quantidade</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max="10"
            value={formData.images.quantity}
            onChange={(e) => updateFormData("images", "quantity", Number.parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  )

  const renderVideosForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="script">Script/Descrição</Label>
        <Textarea
          id="script"
          value={formData.videos.script}
          onChange={(e) => updateFormData("videos", "script", e.target.value)}
          placeholder="Descreva o vídeo que você quer criar..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duração (segundos)</Label>
          <Input
            id="duration"
            type="number"
            min="15"
            max="300"
            value={formData.videos.duration}
            onChange={(e) => updateFormData("videos", "duration", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="videoStyle">Estilo</Label>
          <Select value={formData.videos.style} onValueChange={(value) => updateFormData("videos", "style", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="profissional">Profissional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="animado">Animado</SelectItem>
              <SelectItem value="explicativo">Explicativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="voiceType">Tipo de Voz</Label>
          <Select
            value={formData.videos.voiceType}
            onValueChange={(value) => updateFormData("videos", "voiceType", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masculina">Masculina</SelectItem>
              <SelectItem value="feminina">Feminina</SelectItem>
              <SelectItem value="neutra">Neutra</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <input
            type="checkbox"
            id="includeMusic"
            checked={formData.videos.includeMusic}
            onChange={(e) => updateFormData("videos", "includeMusic", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="includeMusic">Incluir música de fundo</Label>
        </div>
      </div>
    </div>
  )

  const renderEmailForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="emailDescription">Descrição</Label>
        <Textarea
          id="emailDescription"
          value={formData.email.description}
          onChange={(e) => updateFormData("email", "description", e.target.value)}
          placeholder="Descreva o email que você quer criar..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="emailType">Tipo de Email</Label>
          <Select
            value={formData.email.emailType}
            onValueChange={(value) => updateFormData("email", "emailType", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="welcome">Boas-vindas</SelectItem>
              <SelectItem value="promotional">Promocional</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="emailTone">Tom</Label>
          <Select value={formData.email.tone} onValueChange={(value) => updateFormData("email", "tone", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amigável">Amigável</SelectItem>
              <SelectItem value="profissional">Profissional</SelectItem>
              <SelectItem value="persuasivo">Persuasivo</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="emailTargetAudience">Público-alvo</Label>
          <Input
            id="emailTargetAudience"
            value={formData.email.targetAudience}
            onChange={(e) => updateFormData("email", "targetAudience", e.target.value)}
            placeholder="Ex: novos usuários"
          />
        </div>
        <div>
          <Label htmlFor="callToAction">Call to Action</Label>
          <Input
            id="callToAction"
            value={formData.email.callToAction}
            onChange={(e) => updateFormData("email", "callToAction", e.target.value)}
            placeholder="Ex: Começar agora"
          />
        </div>
      </div>
    </div>
  )

  const automationIcons = {
    copywriter: FileText,
    images: ImageIcon,
    videos: Video,
    email: Mail,
  }

  const automationLabels = {
    copywriter: "Copywriter IA",
    images: "Gerador de Imagens",
    videos: "Criador de Vídeos",
    email: "Otimizador de Email",
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Teste de Webhooks de IA
        </CardTitle>
        <CardDescription>
          Simule o envio de webhooks para cada tipo de automação de IA disponível no sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AutomationType)}>
          <TabsList className="grid w-full grid-cols-4">
            {Object.entries(automationLabels).map(([key, label]) => {
              const Icon = automationIcons[key as AutomationType]
              return (
                <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value="copywriter" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Copywriter IA</h3>
            </div>
            {renderCopywriterForm()}
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Gerador de Imagens</h3>
            </div>
            {renderImagesForm()}
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Video className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Criador de Vídeos</h3>
            </div>
            {renderVideosForm()}
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Otimizador de Email</h3>
            </div>
            {renderEmailForm()}
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Simulação</Badge>
            <span className="text-sm text-muted-foreground">Ambiente de teste</span>
          </div>
          <Button onClick={simulateWebhook} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

        {result && (
          <Card className={`mt-4 ${result.success ? "border-green-200" : "border-red-200"}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                {result.success ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Webhook Enviado com Sucesso
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    Erro no Envio do Webhook
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.success ? (
                  <>
                    <div>
                      <Label className="text-sm font-medium">Dados Enviados:</Label>
                      <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto">
                        {JSON.stringify(result.webhook, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Resposta do Servidor:</Label>
                      <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  </>
                ) : (
                  <div>
                    <Label className="text-sm font-medium text-red-600">Erro:</Label>
                    <p className="mt-1 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                      {result.error}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
