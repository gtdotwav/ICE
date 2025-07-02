// Este arquivo definirá as 12 etapas do funil.
// Por uma questão de brevidade, vamos esboçar as primeiras etapas.
// A lógica completa será implementada no hook `useConversationFlow`.

export const chatFlow = {
  0: {
    name: "LANDING_INTELIGENTE",
    // A lógica será tratada no hook para detectar UTMs
  },
  1: {
    name: "DIAGNOSTICO_COMPORTAMENTAL",
    message: "Antes de tudo, como você chegou até aqui hoje?",
    options: [
      { text: "Procurando solução para baixas conversões", value: "low-conversions", score: { need: 20 } },
      { text: "Comparando ferramentas de funil", value: "comparing", score: { engagement: 10 } },
      { text: "Indicação de alguém", value: "referral", score: { authority: 5 } },
      { text: "Curiosidade sobre IA em marketing", value: "curiosity", score: { engagement: 5 } },
    ],
  },
  2: {
    name: "MAPEAMENTO_DE_DOR",
    message: "Qual sua situação atual?",
    options: [
      { text: "CRÍTICA: Perdendo dinheiro todo dia", value: "critical", score: { urgency: 50, timeline: 40 } },
      { text: "IMPORTANTE: Preciso melhorar em 30 dias", value: "important", score: { urgency: 30, timeline: 25 } },
      { text: "EXPLORATÓRIA: Buscando oportunidades", value: "exploratory", score: { urgency: 15 } },
      { text: "ESTRATÉGICA: Planejando para 2025", value: "strategic", score: { urgency: 20, timeline: 10 } },
    ],
  },
  3: {
    name: "QUALIFICACAO_TECNICA",
    message: "Para te dar a solução certa, qual o seu nível de familiaridade com programação e APIs?",
    options: [
      { text: "Sou desenvolvedor(a)", value: "developer", score: { tech: 30 } },
      { text: "Conhecimento básico / No-code", value: "low-code", score: { tech: 10 } },
      { text: "Foco em marketing/gestão", value: "non-technical", score: { need: 10 } },
    ],
  },
  4: {
    name: "TRANQUILIZACAO",
    // Mensagem condicional, sem opções diretas aqui
  },
  5: {
    name: "APRESENTACAO_SOLUCAO",
    message:
      "Com base no que você me disse, o plano Scale AI parece ideal. Ele oferece o poder da nossa IA avançada para otimizar seus funis automaticamente.",
    options: [
      { text: "Como funciona a 'IA Avançada'?", value: "ask-about-ai" },
      { text: "Ver outros planos", value: "ask-other-options" },
      { text: "Quero testar agora", value: "start-now" },
    ],
  },
  // ... As outras 6 etapas seriam definidas aqui
}

export const TOTAL_STEPS = 12
