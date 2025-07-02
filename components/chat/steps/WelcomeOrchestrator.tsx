type WelcomeOrchestratorProps = {
  source: "Google Ads" | "LinkedIn" | "Organic" | "Direct"
}

const messages = {
  "Google Ads": "Vejo que você está buscando otimização de conversão...",
  LinkedIn: "Profissional como você merece ferramentas de nível enterprise...",
  Organic: "Que bom te encontrar! Você está no lugar certo para...",
  Direct: "❄️ Bem-vindo de volta ao futuro das conversões...",
}

export const WelcomeOrchestrator = ({ source }: WelcomeOrchestratorProps) => {
  return (
    <div className="space-y-2">
      <p>{messages[source]}</p>
      <p>Eu sou o assistente de IA do ICEFUNNEL, pronto para congelar sua concorrência.</p>
    </div>
  )
}
