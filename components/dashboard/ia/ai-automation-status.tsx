"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Clock, AlertCircle, Download, Copy, Sparkles, Zap, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AutomationStatus {
  request_id: string
  status: 'processing' | 'completed' | 'failed'
  estimated_completion?: string
  result?: {
    content?: string
    files?: string[]
  }
  automation_type: string
}

interface AIAutomationStatusProps {
  requestId: string
  onComplete?: () => void
}

export function AIAutomationStatus({ requestId, onComplete }: AIAutomationStatusProps) {
  const [status, setStatus] = useState<AutomationStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/webhooks/ai-automation/status/${requestId}`)
        const data = await response.json()
        
        setStatus(data)
        
        if (data.status === 'completed' || data.status === 'failed') {
          setIsLoading(false)
          onComplete?.()
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error)
        setIsLoading(false)
      }
    }

    // Verificar status inicial
    checkStatus()

    // Polling a cada 5 segundos se ainda estiver processando
    const interval = setInterval(() => {
      if (status?.status === 'processing') {
        checkStatus()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [requestId, status?.status, onComplete])

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: 'Copiado!',
      description: 'Conteúdo copiado para a área de transferência'
    })
  }

  const downloadFile = (fileUrl: string) => {
    window.open(fileUrl, '_blank')
  }

  if (!status) {
    return (
      <Card className="w-full max-w-3xl mx-auto glass-card border-primary/20 shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <motion.div 
              className="rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-muted-foreground">Carregando status...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full max-w-3xl mx-auto glass-card border-primary/20 shadow-2xl">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <span className="gradient-text">Status da Automação</span>
            </div>
            <Badge 
              variant={
                status.status === 'completed' ? 'default' : 
                status.status === 'processing' ? 'secondary' : 
                'destructive'
              }
              className={`px-3 py-1 ${
                status.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                status.status === 'processing' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {status.status === 'completed' ? (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Concluída
                </div>
              ) : status.status === 'processing' ? (
                <div className="flex items-center gap-1">
                  <motion.div
                    className="h-2 w-2 bg-blue-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  Processando
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Falhou
                </div>
              )}
            </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          {status.status === 'processing' && (
            <>
              <Clock className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium">Processando sua solicitação...</p>
                <p className="text-sm text-muted-foreground">
                  Nossa IA está trabalhando para você
                </p>
              </div>
            </>
          )}

          {status.status === 'completed' && (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="font-medium">Automação concluída com sucesso!</p>
                <p className="text-sm text-muted-foreground">
                  Resultado disponível abaixo
                </p>
              </div>
            </>
          )}

          {status.status === 'failed' && (
            <>
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div className="flex-1">
                <p className="font-medium">Erro no processamento</p>
                <p className="text-sm text-muted-foreground">
                  Tente novamente ou entre em contato com o suporte
                </p>
              </div>
            </>
          )}
        </div>

        {status.status === 'processing' && (
          <div className="space-y-2">
            <Progress value={66} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {status.estimated_completion && 
                `Conclusão estimada: ${new Date(status.estimated_completion).toLocaleTimeString('pt-BR')}`
              }
            </p>
          </div>
        )}

        {status.status === 'completed' && status.result && (
          <div className="space-y-4">
            {status.result.content && (
              <div className="p-4 bg-muted/20 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
        <CardContent className="space-y-6">
          <motion.div 
            className="flex items-center gap-4 p-4 glass-card border border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
                    variant="ghost"
                    size="sm"
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
            </motion.div>
                  <p className="font-semibold text-lg">Processando sua solicitação...</p>
                    Copiar
                  </Button>
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
                <p className="text-sm whitespace-pre-wrap">{status.result.content}</p>
                <div className="p-6 glass-card border border-green-500/20 bg-green-500/5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-green-500/20">
                        <FileText className="h-4 w-4 text-green-500" />
                      </div>
                      Resultado Gerado
                    </h4>
            {status.result.files && status.result.files.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Arquivos Gerados</h4>
                <div className="grid gap-2">
                      className="hover:bg-green-500/20 hover:scale-110 transition-all duration-200"
                  {status.result.files.map((fileUrl, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Arquivo {index + 1}</span>
                      <Button
                        variant="outline"
                  <div className="bg-background/50 p-4 rounded-lg border border-white/10">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{status.result.content}</p>
                  </div>
                        onClick={() => downloadFile(fileUrl)}
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                <div className="p-2 rounded-lg bg-red-500/20">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/20">
                      <Download className="h-4 w-4 text-purple-500" />
                    </div>
                    Arquivos Gerados
                  </h4>
                  <div className="grid gap-3">
                  <p className="font-semibold text-lg text-red-400">Erro no processamento</p>
                      <motion.div 
                        key={index} 
                        className="flex items-center justify-between p-4 glass-card border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-purple-500/20">
                            <FileText className="h-4 w-4 text-purple-500" />
                          </div>
                          <span className="font-medium">Arquivo {index + 1}</span>
                        </div>
                  ))}
                </div>
              </div>
            )}
                          className="hover:bg-purple-500/20 hover:scale-105 transition-all duration-200"
          </motion.div>
        )}

        <div className="text-xs text-muted-foreground">
                      </motion.div>
              className="space-y-4 p-4 glass-card border border-blue-500/20 bg-blue-500/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            </motion.div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progresso estimado</span>
          <div className="text-xs text-muted-foreground p-3 glass-card border border-white/10 font-mono">
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span>ID da Solicitação: {status.request_id}</span>
            </div>
          </div>
              <Progress value={66} className="h-3" />
              <p className="text-xs text-muted-foreground text-center">
      </Card>
    </motion.div>
  )
}