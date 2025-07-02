"use client"

import { useState, useEffect, useCallback } from "react"
import { nanoid } from "nanoid"
import type { ReactNode } from "react"
import { TechQualificationStep } from "@/components/chatbot/steps/tech-qualification-step"
import { NoCodeReassurance } from "@/components/chatbot/steps/no-code-reassurance"
import { ZeroCodeReinforcement } from "@/components/chatbot/steps/zero-code-reinforcement"
import { ZeroCodeGuarantee } from "@/components/chatbot/steps/zero-code-guarantee"

export type Message = {
  id: string
  sender: "bot" | "user"
  content: ReactNode
  step?: string
}

export type Option = {
  text: string
  value: string
  step: string
}

type TechLevel = "none" | "basic" | "advanced"

const chatFlow: Record<string, any> = {
  start: {
    messages: [
      {
        content:
          "❄️ Olá! Sou o Arctic Assistant do ICEFUNNEL. Vou te mostrar como congelar suas taxas de conversão no máximo!",
      },
    ],
    options: [
      { text: "Conhecer a Plataforma", value: "discover", step: "educational-funnel" },
      { text: "Ver Demo", value: "demo", step: "demo-flow" },
      { text: "Falar com Especialista", value: "contact", step: "persona-segmentation" },
    ],
  },
  "educational-funnel": {
    messages: [
      { content: "🧊 ICEFUNNEL transforma dados quentes em insights cristalinos." },
      { content: "💎 Visualizações árticas que revelam gargalos invisíveis." },
      { content: "❄️ Automação fria que elimina atrito do seu funil." },
      { content: "Qual seu maior desafio com conversões?" },
    ],
    options: [
      { text: "Baixa taxa de conversão", value: "low-conversion", step: "tech-qualification" },
      { text: "Dados confusos", value: "confusing-data", step: "tech-qualification" },
      { text: "Processo manual", value: "manual-process", step: "tech-qualification" },
      { text: "Falta de insights", value: "no-insights", step: "tech-qualification" },
    ],
  },
  "tech-qualification": {
    messages: [{ content: <TechQualificationStep /> }],
    options: [
      { text: "💻 Sim, programo", value: "advanced", step: "tech-reassurance" },
      { text: "❌ Não sei programar", value: "none", step: "tech-reassurance" },
      { text: "🤔 Sei o básico", value: "basic", step: "tech-reassurance" },
    ],
  },
  "tech-reassurance": {
    // Messages are dynamically generated based on techLevel
    nextStep: "zero-code-reinforcement",
  },
  "zero-code-reinforcement": {
    messages: [
      { content: <ZeroCodeReinforcement /> },
      { content: "Agora que você sabe que é 100% sem código, qual resultado você quer alcançar primeiro?" },
    ],
    options: [
      { text: "Dobrar minhas conversões", value: "double-conversions", step: "persona-segmentation" },
      { text: "Automatizar meu funil", value: "automate-funnel", step: "persona-segmentation" },
      { text: "Entender meus dados", value: "understand-data", step: "persona-segmentation" },
      { text: "Integrar minhas ferramentas", value: "integrate-tools", step: "persona-segmentation" },
    ],
  },
  "persona-segmentation": {
    messages: [{ content: "Para personalizar sua experiência Arctic, você é:" }],
    options: [
      { text: "👤 Pessoa Física", value: "individual", step: "freelancer-flow" },
      { text: "🏢 Empresa", value: "company", step: "company-flow" },
    ],
  },
  "freelancer-flow": {
    messages: [
      { content: "❄️ Perfeito para quem quer resultados sem complicação técnica!" },
      { content: "Nossos benefícios para você: Dashboard intuitivo, IA que trabalha 24/7, e suporte humanizado." },
      { content: "Quantos clientes você atende por mês?" },
    ],
    options: [
      { text: "1-5 clientes", value: "1-5", step: "freelancer-cta" },
      { text: "6-15 clientes", value: "6-15", step: "freelancer-cta" },
      { text: "16+ clientes", value: "16+", step: "freelancer-cta" },
    ],
  },
  "freelancer-cta": {
    messages: [
      { content: "Lembre-se: nossa IA faz todo trabalho pesado. Você só acompanha os resultados!" },
      { content: "Vamos começar?" },
    ],
    options: [
      { text: "Liberar Acesso GRATUITO - 14 dias com IA completa", value: "start-trial", step: "freelancer-form" },
    ],
  },
  "company-flow": {
    messages: [
      { content: "🏢 Ideal para equipes que querem escalar sem depender de devs!" },
      {
        content:
          "Benefícios para sua equipe: IA colaborativa, relatórios executivos automáticos, e zero dependência técnica.",
      },
      { content: "Qual o tamanho da sua empresa?" },
    ],
    options: [
      { text: "Startup (2-10)", value: "startup", step: "company-qualification" },
      { text: "Scale-up (11-50)", value: "scale-up", step: "company-qualification" },
      { text: "Enterprise (51+)", value: "enterprise", step: "company-qualification" },
    ],
  },
  "company-qualification": {
    messages: [
      {
        content:
          "Sua equipe inteira pode usar, mesmo quem nunca viu código na vida! Quanto vocês gastam por mês tentando resolver problemas técnicos?",
      },
    ],
    options: [
      { text: "Até R$2.000", value: "2k", step: "company-cta" },
      { text: "R$2.000-10.000", value: "10k", step: "company-cta" },
      { text: "R$10.000+", value: "10k+", step: "company-cta" },
    ],
  },
  "company-cta": {
    messages: [{ content: "Vamos agendar uma demonstração para ver como podemos ajudar." }],
    options: [{ text: "Agendar Demo com IA ao Vivo", value: "book-demo", step: "company-form" }],
  },
  "freelancer-form": {
    messages: [{ content: "Ótimo! Só preciso de algumas informações para criar seu acesso." }],
  },
  "company-form": {
    messages: [{ content: "Excelente! Por favor, preencha os dados para agendarmos sua demonstração personalizada." }],
  },
  confirmation: {
    messages: [
      { content: "🎉 Perfeito! Sua jornada ZERO-CODE começa agora." },
      { content: "🤖 Nossa IA Arctic já está preparando seu ambiente personalizado." },
      { content: <ZeroCodeGuarantee /> },
    ],
  },
}

export const useChatbotLogic = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [options, setOptions] = useState<Option[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [techLevel, setTechLevel] = useState<TechLevel | null>(null)
  const [persona, setPersona] = useState<"individual" | "company" | null>(null)

  const addBotMessage = useCallback((content: ReactNode, step?: string, delay = 500) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: nanoid(), sender: "bot", content, step }])
      setIsTyping(false)
    }, delay)
  }, [])

  const processStep = useCallback((stepKey: string) => {
    const step = chatFlow[stepKey]
    if (!step) return

    setIsTyping(true)
    let delay = 500
    step.messages?.forEach((msg: { content: ReactNode }, index: number) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: nanoid(), sender: "bot", content: msg.content, step: stepKey }])
        if (index === step.messages.length - 1) {
          setIsTyping(false)
          setOptions(step.options || [])
        }
      }, delay)
      delay += 1000
    })

    if (!step.messages) {
      setIsTyping(false)
      setOptions(step.options || [])
    }
  }, [])

  useEffect(() => {
    // Initial load
    processStep("start")
  }, [processStep])

  const handleOptionSelect = (option: Option) => {
    // Add user message
    setMessages((prev) => [...prev, { id: nanoid(), sender: "user", content: option.text }])
    setOptions([])

    if (option.step === "tech-reassurance") {
      const selectedTechLevel = option.value as TechLevel
      setTechLevel(selectedTechLevel)
      addBotMessage(<NoCodeReassurance level={selectedTechLevel} />, "tech-reassurance", 1000)
      setTimeout(() => processStep(chatFlow[option.step].nextStep), 2000)
    } else if (option.step === "freelancer-flow" || option.step === "company-flow") {
      setPersona(option.value as "individual" | "company")
      processStep(option.step)
    } else {
      processStep(option.step)
    }
  }

  const handleSubmitForm = (data: any, type: "freelancer" | "company") => {
    setOptions([])
    const userMessage = type === "freelancer" ? "Formulário de acesso enviado!" : "Formulário de demonstração enviado!"
    setMessages((prev) => [...prev, { id: nanoid(), sender: "user", content: userMessage }])

    // Add specific confirmation message based on persona
    const confirmationMessage =
      type === "freelancer"
        ? "✅ Acesso liberado! Enviamos um tutorial de 2 minutos para o seu email."
        : "✅ Demo agendada! Enviamos uma análise prévia da sua operação para o seu email."

    addBotMessage(confirmationMessage, "confirmation-specific", 500)
    setTimeout(() => processStep("confirmation"), 1500)
  }

  return { messages, options, isTyping, handleOptionSelect, handleSubmitForm }
}
