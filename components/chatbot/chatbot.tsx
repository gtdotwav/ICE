"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { useChatbotLogic } from "@/hooks/use-chatbot-logic"
import { ChatMessage } from "./chat-message"
import { ChatOptions } from "./chat-options"
import { FreelancerForm } from "./forms/freelancer-form"
import { CompanyForm } from "./forms/company-form"
import { TypingIndicator } from "./typing-indicator"
import { ArcticAvatar } from "./arctic-avatar"

type ChatbotProps = {
  isOpen: boolean
  onClose: () => void
}

export function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const { messages, options, isTyping, handleOptionSelect, handleSubmitForm } = useChatbotLogic()

  const renderStepContent = () => {
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage) return null

    if (lastMessage.step === "freelancer-form") {
      return <FreelancerForm onSubmit={(data) => handleSubmitForm(data, "freelancer")} />
    }
    if (lastMessage.step === "company-form") {
      return <CompanyForm onSubmit={(data) => handleSubmitForm(data, "company")} />
    }
    if (options.length > 0) {
      return <ChatOptions options={options} onSelect={handleOptionSelect} />
    }
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-4 right-4 z-50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div
            className="relative z-10 w-[calc(100vw-2rem)] h-[calc(100vh-5rem)] md:w-[400px] md:h-[600px] rounded-2xl border border-ice-blue/30 bg-petroleum-blue/80 shadow-2xl shadow-black/50 backdrop-blur-2xl flex flex-col overflow-hidden"
            layout
          >
            <header className="flex items-center justify-between p-4 border-b border-ice-blue/20">
              <div className="flex items-center gap-3">
                <ArcticAvatar />
                <div>
                  <h2 className="font-bold text-polar-white">Arctic Assistant</h2>
                  <p className="text-xs text-ice-blue flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ice-blue opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-ice-blue"></span>
                    </span>
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-steel-gray hover:text-polar-white hover:bg-ice-blue/20 transition-colors"
                aria-label="Fechar chatbot"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ChatMessage sender={msg.sender}>{msg.content}</ChatMessage>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ChatMessage sender="bot">
                    <TypingIndicator />
                  </ChatMessage>
                </motion.div>
              )}
            </div>

            <div className="p-4 border-t border-ice-blue/20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={messages.length}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
