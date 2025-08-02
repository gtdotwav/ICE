"use client"

import type React from "react"
import { useEffect, useCallback, useRef } from "react"
import { chatFlow, TOTAL_STEPS } from "@/lib/chat-flow"
import { WelcomeOrchestrator } from "@/components/chat/steps/WelcomeOrchestrator"
import { BotAnalysis } from "@/components/chat/steps/BotAnalysis"
import type { ChatState, ChatAction } from "@/lib/chat-reducer"
import { API } from "@/lib/api-client"

// --- Helper Functions for contextual text ---
const personalizationService = {
  getTrafficSource: (): "Google Ads" | "LinkedIn" | "Organic" | "Direct" => {
    const sources: ["Google Ads", "LinkedIn", "Organic", "Direct"] = ["Google Ads", "LinkedIn", "Organic", "Direct"]
    return sources[Math.floor(Math.random() * sources.length)]
  },
}

const getOptionText = (step: number, value: string) => {
  const stepConfig = chatFlow[step as keyof typeof chatFlow]
  if (!stepConfig || !("options" in stepConfig)) return ""
  const option = stepConfig.options.find((o) => o.value === value)
  return option ? option.text.toLowerCase() : ""
}

// --- Main Hook ---
export const useConversationFlow = (state: ChatState, dispatch: React.Dispatch<ChatAction>, onClose: () => void) => {
  const { currentStep, profile } = state
  const processedSteps = useRef(new Set<number>())

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
    if (currentStep >= TOTAL_STEPS) return
    if (processedSteps.current.has(currentStep)) return // Evita processamento duplicado

    processedSteps.current.add(currentStep)

    const stepConfig = chatFlow[currentStep as keyof typeof chatFlow]
    if (!stepConfig) {
      addBotMessage("Ocorreu um erro. Reiniciando a conversa.")
      setTimeout(() => dispatch({ type: "RESET" }), 2000)
      return
    }

    // Logic for each step
    switch (currentStep) {
      case 0: {
        const source = personalizationService.getTrafficSource()
        dispatch({ type: "UPDATE_PROFILE", payload: { source } })
        addBotMessage("", 100, WelcomeOrchestrator, { source })
        setTimeout(() => {
          processedSteps.current.delete(0) // Permite reprocessar se necessário
          dispatch({ type: "SET_STEP", payload: 1 })
        }, 4000)
        break
      }
      case 2: {
        const painPointText = getOptionText(1, profile.painPoint)
        addBotMessage(`Entendido, seu foco é ${painPointText}. E qual o nível de urgência para resolver isso?`, 1000)
        break
      }
      case 4: {
        const techLevelText = getOptionText(3, profile.techLevel)
        addBotMessage(
          `Perfeito. Com base no seu perfil de "${techLevelText}", estou analisando a melhor solução...`,
          500,
        )
        setTimeout(() => addBotMessage("", 100, BotAnalysis), 1000)
        setTimeout(() => {
          processedSteps.current.delete(4)
          dispatch({ type: "SET_STEP", payload: 5 })
        }, 5000)
        break
      }
      case 5: {
        const techLevel = profile.techLevel
        const reassuranceMessage =
          techLevel === "developer"
            ? "Excelente. Nossa API foi construída para desenvolvedores. A integração é simples e o poder, imenso."
            : "Perfeito. A IceFunnel foi projetada para ser poderosa e acessível, sem precisar de código."
        addBotMessage(reassuranceMessage, 1000)
        setTimeout(() => {
          processedSteps.current.delete(5)
          dispatch({ type: "SET_STEP", payload: 6 })
        }, 3500)
        break
      }
      case 6: {
        const painPoint = getOptionText(1, profile.painPoint)
        const urgency = getOptionText(2, profile.urgencyLevel)
        const solutionMessage = `Analisei suas respostas. Para o desafio de ${painPoint}, com urgência ${urgency}, o plano **Scale AI** é o ponto de partida ideal para você.`
        addBotMessage(solutionMessage, 1500)
        break
      }
      default: {
        if (stepConfig.message) {
          addBotMessage(stepConfig.message, 1000)
        }
        break
      }
    }
  }, [currentStep, addBotMessage, dispatch, profile])

  // Efeito controlado que só roda quando o step muda
  useEffect(() => {
    processCurrentStep()
  }, [currentStep]) // Removido 'messages' das dependências para evitar loop

  // Efeito inicial apenas para o primeiro step
  useEffect(() => {
    if (currentStep === 0 && !processedSteps.current.has(0)) {
      processCurrentStep()
    }
  }, []) // Array vazio - roda apenas uma vez

  const handleUserResponse = (option: { text: string; value: string; score?: any; nextStep?: number }) => {
    if (option.value === "go-home") {
      onClose()
      return
    }

    dispatch({ type: "SET_INPUT_DISABLED", payload: true })
    dispatch({ type: "ADD_MESSAGE", payload: { sender: "user", content: option.text } })

    if (option.score) dispatch({ type: "UPDATE_SCORE", payload: option.score })
    if (currentStep === 1) dispatch({ type: "UPDATE_PROFILE", payload: { painPoint: option.value } })
    if (currentStep === 2) dispatch({ type: "UPDATE_PROFILE", payload: { urgencyLevel: option.value } })
    if (currentStep === 3) dispatch({ type: "UPDATE_PROFILE", payload: { techLevel: option.value } })

    const nextStep = option.nextStep || currentStep + 1
    setTimeout(() => {
      dispatch({ type: "SET_STEP", payload: nextStep })
    }, 500)
  }

  const handleFormSubmit = (value: string) => {
    dispatch({ type: "SET_INPUT_DISABLED", payload: true })
    dispatch({ type: "ADD_MESSAGE", payload: { sender: "user", content: value } })
    dispatch({ type: "UPDATE_PROFILE", payload: { email: value } })

    // Capturar lead via API
    const leadData = { ...profile, email: value }
    API.qualifyLead({
      email: value,
      name: leadData.name || 'Usuário Chat',
      score: 90, // Score alto para leads do chat
      criteria: ['chat_interaction', leadData.painPoint, leadData.urgencyLevel],
      source: 'chatbot',
      tags: [leadData.painPoint, leadData.urgencyLevel, leadData.techLevel]
    }).catch(console.error)

    const nextStep = currentStep + 1
    setTimeout(() => {
      dispatch({ type: "SET_STEP", payload: nextStep })
    }, 500)
  }

  return { handleUserResponse, handleFormSubmit }
}
