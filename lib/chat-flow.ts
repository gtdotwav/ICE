// lib/chat-flow.ts
// O fluxo foi refinado. Mensagens que agora são geradas dinamicamente no hook
// foram removidas daqui para garantir que o conteúdo seja sempre contextual.

export const chatFlow = {
  0: {
    name: "LANDING_INTELIGENTE",
    // Etapa automática, a lógica de personalização inicial ocorre no hook.
  },
  1: {
    name: "DIAGNOSTICO_COMPORTAMENTAL",
    message: "Para que eu possa te ajudar melhor, qual o seu principal objetivo hoje?",
    options: [
      { text: "Resolver baixas conversões", value: "low-conversions", score: { need: 20 } },
      { text: "Analisar ferramentas de otimização", value: "comparing", score: { engagement: 10 } },
      { text: "Vim por uma indicação", value: "referral", score: { authority: 5 } },
      { text: "Explorar o uso de IA em marketing", value: "curiosity", score: { engagement: 5 } },
    ],
  },
  2: {
    name: "MAPEAMENTO_DE_DOR",
    // A mensagem para esta etapa agora é gerada dinamicamente no hook.
    options: [
      { text: "Crítico: Estou perdendo vendas agora", value: "critical", score: { urgency: 50, timeline: 40 } },
      { text: "Alto: Preciso de melhorias neste trimestre", value: "important", score: { urgency: 30, timeline: 25 } },
      { text: "Médio: Buscando otimizações futuras", value: "exploratory", score: { urgency: 15 } },
      { text: "Baixo: Apenas pesquisando para o futuro", value: "strategic", score: { urgency: 10, timeline: 5 } },
    ],
  },
  3: {
    name: "QUALIFICACAO_TECNICA",
    message: "Ótimo. E para eu saber a melhor forma de apresentar a solução, qual seu perfil?",
    options: [
      { text: "Desenvolvedor(a) / Equipe de TI", value: "developer", score: { tech: 30 } },
      { text: "Marketing / Growth (com No-Code)", value: "low-code", score: { tech: 10 } },
      { text: "Gestão / Estratégia (não-técnico)", value: "non-technical", score: { need: 10 } },
    ],
  },
  4: {
    name: "BOT_ANALYSIS",
    // Etapa automática de "pensamento" da IA.
  },
  5: {
    name: "TRANQUILIZACAO",
    // Mensagem condicional baseada no perfil técnico, gerada no hook.
  },
  6: {
    name: "APRESENTACAO_SOLUCAO",
    // Mensagem personalizada com base nas respostas anteriores, gerada no hook.
    options: [
      { text: "Como a IA funciona na prática?", value: "ask-about-ai", nextStep: 7 },
      { text: "Quais são os outros planos?", value: "ask-other-plans", nextStep: 8 },
      { text: "Gostei. Quero entrar na lista.", value: "start-now", nextStep: 9 },
    ],
  },
  7: {
    name: "EXPLICACAO_IA",
    message:
      "Nossa IA analisa milhões de pontos de dados em tempo real, prevendo o comportamento do usuário e ajustando headlines, CTAs e fluxos para maximizar a conversão de cada visitante. É como ter um time de cientistas de dados trabalhando 24/7 no seu funil.",
    options: [{ text: "Impressionante. Vamos continuar.", value: "continue", nextStep: 9 }],
  },
  8: {
    name: "COMPARATIVO_PLANOS",
    message:
      "Além do Scale AI, temos o **Starter AI** (para quem está começando) e o **Enterprise AI** (com IA customizada e suporte dedicado). O Scale AI oferece o melhor custo-benefício para crescimento acelerado.",
    options: [{ text: "O Scale AI parece ideal. Próximo passo.", value: "continue", nextStep: 9 }],
  },
  9: {
    name: "CAPTURA_LEAD",
    message:
      "Excelente escolha! Para garantir seu lugar na lista de espera e enviar um resumo personalizado da nossa conversa, por favor, informe seu melhor e-mail.",
    input_type: "email",
  },
  10: {
    name: "AGRADECIMENTO_FINAL",
    message:
      "❄️ Perfeito! Seu lugar está garantido. Nossa equipe de especialistas analisará seu perfil e entrará em contato em breve com os próximos passos. Você está a um passo de congelar sua concorrência.",
    options: [{ text: "Obrigado! Voltar ao site", value: "go-home" }],
  },
}

export const TOTAL_STEPS = Object.keys(chatFlow).length
