"use client"

import { useEffect, useRef, useReducer } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useConversationFlow } from "@/hooks/useConversationFlow"
import { chatReducer, initialState } from "@/lib/chat-reducer"
import { MessageBubble } from "./MessageBubble"
import { TypingIndicator } from "./TypingIndicator"
import { QuickReply } from "./QuickReply"
import { chatFlow } from "@/lib/chat-flow"
import { X } from "lucide-react"

type ChatContainerProps = {
  onClose: () => void
}

export const ChatContainer = ({ onClose }: ChatContainerProps) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  const { messages, isTyping, currentStep } = state
  const { handleUserResponse } = useConversationFlow(state, dispatch)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages, isTyping])

  const currentOptions = chatFlow[currentStep as keyof typeof chatFlow]?.options || []

  return (
    <div className="fixed inset-0 bg-ice-background/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-lg h-[90vh] max-h-[700px] bg-background/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="p-4 border-b border-border flex justify-between items-center">
          <h1 className="text-lg font-bold text-foreground">ICEFUNNEL AI</h1>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </header>

        <div ref={scrollAreaRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
          <AnimatePresence>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>
          {isTyping && (
            <MessageBubble
              message={{ id: "typing", sender: "bot", content: <TypingIndicator />, timestamp: Date.now() }}
            />
          )}
        </div>

        <footer className="p-4 border-t border-border">
          <QuickReply options={currentOptions} onSelect={handleUserResponse} />
        </footer>
      </motion.div>
    </div>
  )
}
