import { Bot } from "lucide-react"

export function TechQualificationStep() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 font-bold">
        <Bot className="w-5 h-5 text-ice-blue" />
        <p>Antes de continuarmos...</p>
      </div>
      <p>Você sabe programar?</p>
    </div>
  )
}
