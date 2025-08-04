"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Clock, AlertCircle, Download, Copy } from 'lucide-react'
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
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Status da Automação</span>
          <Badge variant={
            status.status === 'completed' ? 'default' : 
            status.status === 'processing' ? 'secondary' : 
            'destructive'
          }>
            {status.status === 'completed' ? 'Concluída' :
             status.status === 'processing' ? 'Processando' :
             'Falhou'}
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
                  <h4 className="font-medium">Resultado Gerado</h4>
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

            {status.result.files && status.result.files.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Arquivos Gerados</h4>
                <div className="grid gap-2">
                  {status.result.files.map((fileUrl, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Arquivo {index + 1}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(fileUrl)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          ID da Solicitação: {status.request_id}
        </div>
      </CardContent>
    </Card>
  )
}