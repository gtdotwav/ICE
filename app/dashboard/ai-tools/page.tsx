import { AIToolsPage } from "@/components/dashboard/ai-tools/ai-tools-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Tools - IceFunnel",
  description: "Gere componentes e páginas com o poder da IA.",
}

export default function DashboardAIToolsPage() {
  return <AIToolsPage />
}
