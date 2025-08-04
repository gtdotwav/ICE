"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAIAutomation } from '@/hooks/use-ai-automation'
import { FileText, ImageIcon, Video, Mail, Send, Sparkles } from 'lucide-react'

interface AIAutomationFormProps {
  type: 'copywriter' | 'images' | 'videos' | 'email'
  onClose: () => void
}

const automationConfig = {
  copywriter: {
    title: 'Copywriter IA',
    icon: FileText,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/20',
    fields: [
      { key: 'copyType', label: 'Tipo de Copy', type: 'select', options: ['headline', 'landing_page', 'ad_copy', 'email_subject'] },
      { key: 'targetAudience', label: 'Público-alvo', type: 'text' },
      { key: 'tone', label: 'Tom', type: 'select', options: ['professional', 'casual', 'urgent', 'persuasive'] },
      { key: 'productName', label: 'Nome do Produto', type: 'text' },
      { key: 'length', label: 'Tamanho', type: 'select', options: ['short', 'medium', 'long'] }
    ]
  },
  images: {
    title: 'Gerador de Imagens',
    icon: ImageIcon,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/20',
    fields: [
      { key: 'style', label: 'Estilo', type: 'select', options: ['professional', 'creative', 'minimalist'] },
      { key: 'dimensions', label: 'Dimensões', type: 'select', options: ['1024x1024', '1200x630', '800x600'] },
      { key: 'format', label: 'Formato', type: 'select', options: ['png', 'jpg'] },
      { key: 'quantity', label: 'Quantidade', type: 'number', min: 1, max: 5 }
    ]
  },
  videos: {
    title: 'Criador de Vídeos',
    icon: Video,
    color: 'text-red-500',
    bgColor: 'bg-red-500/20',
    fields: [
      { key: 'duration', label: 'Duração (segundos)', type: 'number', min: 15, max: 300 },
      { key: 'style', label: 'Estilo', type: 'select', options: ['promotional', 'educational', 'testimonial'] },
      { key: 'voiceType', label: 'Tipo de Voz', type: 'select', options: ['professional', 'casual', 'energetic'] },
      { key: 'includeMusic', label: 'Incluir Música', type: 'boolean' }
    ]
  },
  email: {
    title: 'Otimizador de Email',
    icon: Mail,
    color: 'text-green-500',
    bgColor: 'bg-green-500/20',
    fields: [
      { key: 'emailType', label: 'Tipo de Email', type: 'select', options: ['marketing', 'transactional', 'newsletter'] },
      { key: 'targetAudience', label: 'Público-alvo', type: 'text' },
      { key: 'tone', label: 'Tom', type: 'select', options: ['professional', 'casual', 'urgent'] },
      { key: 'callToAction', label: 'Call to Action', type: 'text' }
    ]
  }
}

export function AIAutomationForm({ type, onClose }: AIAutomationFormProps) {
  const config = automationConfig[type]
  const [prompt, setPrompt] = useState('')
  const [context, setContext] = useState<Record<string, any>>({})
  const { requestAutomation, isLoading } = useAIAutomation('current-user-id') // Em produção, obter do contexto de auth

  const handleContextChange = (key: string, value: any) => {
    setContext(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      return
    }

    const requestId = await requestAutomation({
      type,
      prompt: prompt.trim(),
      context,
      userEmail: 'usuario@exemplo.com' // Em produção, obter do contexto de auth
    })

    if (requestId) {
      onClose()
    }
  }

  const IconComponent = config.icon

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <IconComponent className={`h-5 w-5 ${config.color}`} />
          </div>
          {config.title}
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
            IA Avançada
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prompt Principal */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Descreva o que você precisa</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Ex: ${this.getPlaceholderByType(type)}`}
              rows={4}
              className="resize-none"
              required
            />
          </div>

          {/* Campos de Contexto */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Configurações Avançadas
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  
                  {field.type === 'select' && field.options ? (
                    <Select
                      value={context[field.key] || ''}
                      onValueChange={(value) => handleContextChange(field.key, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {this.formatOptionLabel(option)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'number' ? (
                    <Input
                      id={field.key}
                      type="number"
                      min={field.min}
                      max={field.max}
                      value={context[field.key] || ''}
                      onChange={(e) => handleContextChange(field.key, parseInt(e.target.value))}
                    />
                  ) : field.type === 'boolean' ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={field.key}
                        checked={context[field.key] || false}
                        onChange={(e) => handleContextChange(field.key, e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor={field.key}>Sim</Label>
                    </div>
                  ) : (
                    <Input
                      id={field.key}
                      type="text"
                      value={context[field.key] || ''}
                      onChange={(e) => handleContextChange(field.key, e.target.value)}
                      placeholder={`Digite ${field.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-between pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            
            <Button type="submit" disabled={isLoading || !prompt.trim()}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Processando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Solicitar Automação
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )

  private getPlaceholderByType(type: string): string {
    switch (type) {
      case 'copywriter':
        return 'Crie um headline persuasivo para um curso de marketing digital para iniciantes'
      case 'images':
        return 'Banner promocional para Black Friday com cores vibrantes e call-to-action'
      case 'videos':
        return 'Vídeo promocional de 30 segundos para lançamento de produto'
      case 'email':
        return 'Subject line para newsletter semanal sobre dicas de vendas'
      default:
        return 'Descreva o que você precisa...'
    }
  }

  private formatOptionLabel(option: string): string {
    return option.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }
}