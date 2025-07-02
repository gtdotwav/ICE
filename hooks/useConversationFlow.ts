"use client"

import type React from "react"
import { useEffect, useCallback } from "react"
import { chatFlow, TOTAL_STEPS } from "@/lib/chat-flow"
import { WelcomeOrchestrator } from "@/components/chat/steps/WelcomeOrchestrator"
import type { ChatState, ChatAction } from "@/lib/chat-reducer"

// Simulação de um serviço de personalização
const personalizationService = {
  getTrafficSource: (): "Google Ads" | "LinkedIn" | "Organic" | "Direct" => {
    const sources: ["Google Ads", "LinkedIn", "Organic", "Direct"] = ["Google Ads", "LinkedIn", "Organic", "Direct"]
    return sources[Math.floor(Math.random() * sources.length)]
  },
}

export const useConversationFlow = (state: ChatState, dispatch: React.Dispatch<ChatAction>) => {
  const { currentStep, messages, profile } = state

  const addBotMessage = useCallback(
    (content: React.ReactNode, delay = 500, component?: React.ComponentType<any>, componentProps?: any) => {
      dispatch({ type: "SET_TYPING", payload: true })
      setTimeout(() => {
        dispatch({ type: "ADD_MESSAGE", payload: { sender: "bot", content, component, componentProps } })
        dispatch({ type: "SET_TYPING", payload: false })
      }, delay)
    },
    [dispatch],
  )

  const processCurrentStep = useCallback(() => {
    if (currentStep >= TOTAL_STEPS) {
      addBotMessage("Nossa conversa chegou ao fim por enquanto. Obrigado!")
      return
    }

    const stepConfig = chatFlow[currentStep as keyof typeof chatFlow]
    if (!stepConfig) {
      // Fallback para caso uma etapa não esteja definida
      addBotMessage("Parece que chegamos ao fim do nosso fluxo de demonstração. Obrigado!")
      return
    }

    switch (currentStep) {
      case 0: // LANDING_INTELIGENTE
        const source = personalizationService.getTrafficSource()
        dispatch({ type: "UPDATE_PROFILE", payload: { source } })
        addBotMessage("", 100, WelcomeOrchestrator, { source })
        setTimeout(() => dispatch({ type: "NEXT_STEP" }), 3000)
        break

      case 1: // DIAGNOSTICO_COMPORTAMENTAL
      case 2: // MAPEAMENTO_DE_DOR
      case 3: // QUALIFICACAO_TECNICA
      case 5: // APRESENTACAO_SOLUCAO
        addBotMessage(stepConfig.message, 1000)
        break

      case 4: // TRANQUILIZACAO (etapa condicional)
        const techLevel = profile.techLevel
        let reassuranceMessage = ""
        if (techLevel === "developer") {
          reassuranceMessage =
            "Excelente. Você vai adorar nossa API robusta, documentação completa e SDKs para as principais linguagens. A integração é rápida e poderosa."
        } else {
          // non-technical ou low-code
          reassuranceMessage =
            "Perfeito. O IceFunnel foi desenhado para todos. Nossa IA cuida do complexo, e você pode integrar tudo com apenas alguns cliques, sem precisar de código."
        }
        addBotMessage(reassuranceMessage, 1000)
        setTimeout(() => dispatch({ type: "NEXT_STEP" }), 3500) // Auto-avanço para a próxima etapa
        break

      default:
        addBotMessage(`Estamos na etapa ${currentStep}: ${stepConfig?.name || "Desconhecida"}.`, 1000)
        setTimeout(() => dispatch({ type: "NEXT_STEP" }), 2000)
        break
    }
  }, [currentStep, addBotMessage, dispatch, profile])

  useEffect(() => {
    // Inicia o fluxo apenas na primeira vez
    if (messages.length === 0 && currentStep === 0) {
      processCurrentStep()
    }
  }, [messages.length, currentStep, processCurrentStep])

  const handleUserResponse = (option: { text: string; value: string; score?: any }) => {
    dispatch({ type: "ADD_MESSAGE", payload: { sender: "user", content: option.text } })

    if (option.score) {
      dispatch({ type: "UPDATE_SCORE", payload: option.score })
    }

    // Atualiza o perfil do usuário com base na resposta
    if (currentStep === 1) dispatch({ type: "UPDATE_PROFILE", payload: { painPoint: option.value } })
    if (currentStep === 2) dispatch({ type: "UPDATE_PROFILE", payload: { urgencyLevel: option.value } })
    if (currentStep === 3) dispatch({ type: "UPDATE_PROFILE", payload: { techLevel: option.value } })

    dispatch({ type: "NEXT_STEP" })
    setTimeout(processCurrentStep, 500)
  }

  return { handleUserResponse }
}
