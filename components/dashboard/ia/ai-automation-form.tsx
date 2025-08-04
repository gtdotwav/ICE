"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { FileText, ImageIcon, Video, Mail, Send, Sparkles, Zap, Clock, Target, Wand2, CheckCircle } from 'lucide-react'

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
    borderColor: 'border-blue-500/30',
    gradientFrom: 'from-blue-500/20',
    gradientTo: 'to-cyan-500/20',
    estimatedTime: '30-60 segundos',
    description: 'Crie textos persuasivos que convertem',
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
    borderColor: 'border-purple-500/30',
    gradientFrom: 'from-purple-500/20',
    gradientTo: 'to-pink-500/20',
    estimatedTime: '2-3 minutos',
    description: 'Gere imagens únicas para suas campanhas',
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
    borderColor: 'border-red-500/30',
    gradientFrom: 'from-red-500/20',
    gradientTo: 'to-orange-500/20',
    estimatedTime: '5-10 minutos',
    description: 'Produza vídeos promocionais automaticamente',
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
    borderColor: 'border-green-500/30',
    gradientFrom: 'from-green-500/20',
    gradientTo: 'to-emerald-500/20',
    estimatedTime: '1-2 minutos',
    description: 'Otimize suas campanhas de email marketing',
    fields: [
      { key: 'emailType', label: 'Tipo de Email', type: 'select', options: ['marketing', 'transactional', 'newsletter'] },
      { key: 'targetAudience', label: 'Público-alvo', type: 'text' },
      { key: 'tone', label: 'Tom', type: 'select', options: ['professional', 'casual', 'urgent'] },
      { key: 'callToAction', label: 'Call to Action', type: 'text' }
    ]
  }
}

function formatOptionLabel(option: string): string {
  return option.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function getPlaceholderByType(type: string): string {
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

export function AIAutomationForm({ type, onClose }: AIAutomationFormProps) {
  const config = automationConfig[type]
  const [prompt, setPrompt] = useState('')
  const [context, setContext] = useState<Record<string, any>>({})
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const totalSteps = 3

  const handleContextChange = (key: string, value: any) => {
    setContext(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      return
    }

    setIsLoading(true)
    
    try {
      // Enviar solicitação para API
      const response = await fetch('/api/ai-automation/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          prompt,
          context,
          userId: 'current-user-id' // Em produção, obter do contexto de auth
        })
      })

      const result = await response.json()

      if (response.ok) {
        // Sucesso - mostrar mensagem e fechar
        onClose()
      } else {
        console.error('Erro na solicitação:', result.error)
      }
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const IconComponent = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className={`glass-card border-2 ${config.borderColor} shadow-2xl bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo}`}>
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-4 text-2xl">
              <div className={`p-3 rounded-xl ${config.bgColor} border ${config.borderColor} shadow-lg`}>
                <IconComponent className={`h-6 w-6 ${config.color}`} />
              </div>
              <div>
                <div className="gradient-text">{config.title}</div>
                <p className="text-sm text-muted-foreground font-normal mt-1">{config.description}</p>
              </div>
            </CardTitle>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                IA Avançada
              </Badge>
              <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1">
                <Clock className="h-3 w-3 mr-1" />
                {config.estimatedTime}
              </Badge>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="space-y-3 mt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progresso da Configuração</span>
              <span className="text-primary font-medium">{step} de {totalSteps}</span>
            </div>
            <Progress value={(step / totalSteps) * 100} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-8"
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Descreva sua Necessidade
                    </h3>
                    <p className="text-muted-foreground">Seja específico para obter os melhores resultados</p>
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="prompt" className="text-base font-semibold flex items-center gap-2">
                      <Wand2 className="h-4 w-4 text-primary" />
                      Prompt para IA
                    </Label>
                    <Textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={`Ex: ${getPlaceholderByType(type)}`}
                      rows={6}
                      className="resize-none glass-input border-primary/20 focus:border-primary/50 transition-all duration-300 text-base"
                      required
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{prompt.length} caracteres</span>
                      <span>Mínimo 20 caracteres recomendado</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Configurações Avançadas
                    </h3>
                    <p className="text-muted-foreground">Personalize os parâmetros para resultados otimizados</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {config.fields.map((field, index) => (
                      <motion.div 
                        key={field.key} 
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Label htmlFor={field.key} className="text-sm font-semibold">{field.label}</Label>
                        
                        {field.type === 'select' && field.options ? (
                          <Select
                            value={context[field.key] || ''}
                            onValueChange={(value) => handleContextChange(field.key, value)}
                          >
                            <SelectTrigger className="glass-input border-primary/20 focus:border-primary/50">
                              <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent className="glass-card border-primary/20">
                              {field.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {formatOptionLabel(option)}
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
                            className="glass-input border-primary/20 focus:border-primary/50"
                          />
                        ) : field.type === 'boolean' ? (
                          <div className="flex items-center space-x-3 p-3 glass-card border border-primary/20">
                            <input
                              type="checkbox"
                              id={field.key}
                              checked={context[field.key] || false}
                              onChange={(e) => handleContextChange(field.key, e.target.checked)}
                              className="rounded border-primary/30 text-primary focus:ring-primary/50"
                            />
                            <Label htmlFor={field.key} className="font-medium">Sim</Label>
                          </div>
                        ) : (
                          <Input
                            id={field.key}
                            type="text"
                            value={context[field.key] || ''}
                            onChange={(e) => handleContextChange(field.key, e.target.value)}
                            placeholder={`Digite ${field.label.toLowerCase()}`}
                            className="glass-input border-primary/20 focus:border-primary/50"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Revisão Final
                    </h3>
                    <p className="text-muted-foreground">Confirme os detalhes antes de enviar para a IA</p>
                  </div>

                  <div className="space-y-4">
                    <div className="glass-card p-4 border border-primary/20">
                      <h4 className="font-semibold mb-2">Prompt:</h4>
                      <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded-lg border">
                        {prompt}
                      </p>
                    </div>

                    {Object.keys(context).length > 0 && (
                      <div className="glass-card p-4 border border-primary/20">
                        <h4 className="font-semibold mb-3">Configurações:</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(context).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                              </span>
                              <span className="font-medium">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="glass-card p-4 border border-green-500/20 bg-green-500/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">Estimativa de Processamento</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Tempo estimado:</span>
                          <span className="font-medium ml-2">{config.estimatedTime}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Qualidade:</span>
                          <span className="font-medium ml-2 text-green-400">Premium</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    className="glass-button bg-transparent"
                  >
                    Cancelar
                  </Button>
                  {step > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(step - 1)}
                      className="glass-button bg-transparent"
                    >
                      Voltar
                    </Button>
                  )}
                </div>
                
                {step < totalSteps ? (
                  <Button 
                    type="button"
                    onClick={() => setStep(step + 1)}
                    disabled={step === 1 && !prompt.trim()}
                    className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-semibold px-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isLoading || !prompt.trim()}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-500/90 hover:to-emerald-500/90 text-white font-semibold px-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <motion.div 
                          className="rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Solicitar Automação
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.form>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}