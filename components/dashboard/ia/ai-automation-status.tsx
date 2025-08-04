"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
    // Simulate status check
    setTimeout(() => {
      setStatus({
        request_id: requestId,
        status: 'completed',
        automation_type: 'copywriter',
        result: {
          content: 'Exemplo de conteúdo gerado pela IA'
        }
      })
      setIsLoading(false)
      onComplete?.()
    }, 2000)
  }, [requestId, onComplete])

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: 'Copiado!',
      description: 'Conteúdo copiado para a área de transferência'
    })
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

        <CardContent className="space-y-6">
          {status.status === 'completed' && status.result && (
            <div className="space-y-4">
              {status.result.content && (
                <div className="p-4 bg-muted/20 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Conteúdo Gerado</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyContent(status.result!.content!)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar
                    </Button>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{status.result.content}</p>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            ID da Solicitação: {status.request_id}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}