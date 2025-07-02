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
import { useIsMobile } from "@/hooks/use-mobile"
import { Drawer, DrawerContent } from "@/components/ui/drawer"

type ChatContainerProps = {
  onClose: () => void
}

export const ChatContainer = ({ onClose }: ChatContainerProps) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  const { messages, isTyping, currentStep } = state
  const { handleUserResponse } = useConversationFlow(state, dispatch)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages, isTyping])

  const currentOptions = chatFlow[currentStep as keyof typeof chatFlow]?.options || []

  const ChatContent = (
    <>
      <header className="p-4 border-b border-border flex justify-between items-center flex-shrink-0">
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

      <footer className="p-4 border-t border-border flex-shrink-0">
        <QuickReply options={currentOptions} onSelect={handleUserResponse} />
      </footer>
    </>
  )

  if (isMobile === undefined) {
    return null // Evita mismatch de SSR
  }

  if (isMobile) {
    return (
      <Drawer open onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="h-[95vh] bg-background/80 backdrop-blur-xl flex flex-col outline-none">
          {ChatContent}
        </DrawerContent>
      </Drawer>
    )
  }

  // Visão Desktop
  return (
    <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        className="w-full max-w-lg h-[90vh] max-h-[700px] bg-background/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {ChatContent}
      </motion.div>
    </div>
  )
}
