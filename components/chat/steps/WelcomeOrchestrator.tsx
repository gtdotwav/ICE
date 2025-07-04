type WelcomeOrchestratorProps = {
  source: "Google Ads" | "LinkedIn" | "Organic" | "Direct"
}

const messages = {
  "Google Ads": "Olá! Percebi que você veio do Google Ads buscando otimização de conversão. Você está no lugar certo.",
  LinkedIn:
    "Bem-vindo(a) do LinkedIn! Profissionais como você merecem ferramentas de ponta. Vamos ver como podemos te ajudar.",
  Organic: "Que bom que nos encontrou! Prepare-se para descobrir o futuro da otimização de funis.",
  Direct: "❄️ Bem-vindo(a) de volta! É ótimo ter você aqui para explorar o futuro das conversões.",
}

export const WelcomeOrchestrator = ({ source }: WelcomeOrchestratorProps) => {
  return (
    <div className="space-y-3">
      <p className="font-bold text-lg">{messages[source]}</p>
      <p>
        Eu sou a IA da IceFunnel, e nos próximos 60 segundos, vou te mostrar como podemos transformar seus resultados.
        Vamos começar?
      </p>
    </div>
  )
}
