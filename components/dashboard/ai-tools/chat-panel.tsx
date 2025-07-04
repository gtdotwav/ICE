"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Send, Sparkles } from "lucide-react"
import { useAIToolsStore } from "@/stores/aiToolsStore"
import { MessageBubble } from "./message-bubble"
import { TypingIndicator } from "@/src/components/chat/TypingIndicator"
import { useRef, useEffect } from "react"

const quickPrompts = [
  "Criar Landing Page Responsiva",
  "Gerar Componente de Checkout",
  "Otimizar Formulário Mobile",
  "Adicionar Animações CSS",
]

export function ChatPanel() {
  const { messages, isTyping, userInput, setUserInput, sendMessage } = useAIToolsStore()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]")
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages, isTyping])

  const handleSendMessage = () => {
    if (userInput.trim()) {
      sendMessage(userInput)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setUserInput(prompt)
    sendMessage(prompt)
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex h-12 shrink-0 items-center border-b px-4">
        <h2 className="text-lg font-semibold">AI Tools</h2>
      </div>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="flex flex-col gap-4 p-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </ScrollArea>
      <div className="shrink-0 border-t p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <Button
              key={prompt}
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt(prompt)}
              className="text-xs"
            >
              <Sparkles className="mr-2 h-3 w-3 text-purple-500" />
              {prompt}
            </Button>
          ))}
        </div>
        <div className="relative">
          <Textarea
            placeholder="Descreva o componente que você quer criar..."
            className="min-h-[60px] resize-none pr-16"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={handleSendMessage}
            disabled={isTyping || !userInput.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
