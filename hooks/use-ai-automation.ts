"use client"

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import type { AIAutomationRequest } from '@/lib/webhooks/ai-automation-webhooks'

export interface AIAutomationHookResult {
  requestAutomation: (request: Omit<AIAutomationRequest, 'userId'>) => Promise<string | null>
  isLoading: boolean
  error: string | null
}

export function useAIAutomation(userId: string): AIAutomationHookResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const requestAutomation = async (request: Omit<AIAutomationRequest, 'userId'>): Promise<string | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai-automation/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...request,
          userId
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao solicitar automação')
      }

      toast({
        title: 'Automação Solicitada!',
        description: `Sua solicitação foi enviada. Tempo estimado: ${result.estimated_time}`
      })

      return result.request_id
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      })

      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    requestAutomation,
    isLoading,
    error
  }
}