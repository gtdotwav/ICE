import FunnelPromptBuilder from "@/components/funnel-prompt/prompt-builder"

export const metadata = {
  title: "Gerador de Prompt v2 — Funis",
  description: "Construa e copie o prompt completo para LP, Checkout e LP+VSL+Checkout com Didática LP v2.",
}

export default function Page() {
  return <FunnelPromptBuilder />
}
