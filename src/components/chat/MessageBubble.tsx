"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Message } from "@/lib/chat-reducer"
import { Bot } from "lucide-react"

const Avatar = ({ sender }: { sender: "bot" | "user" }) => {
  if (sender === "user") return null
  return (
    <motion.div
      className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 border-2 border-background shadow-lg"
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
    >
      <Bot className="w-5 h-5 text-primary-foreground" />
    </motion.div>
  )
}

export const MessageBubble = ({ message }: { message: Message }) => {
  const isBot = message.sender === "bot"
  const CustomComponent = message.component

  return (
    <motion.div
      className={cn("flex items-end gap-3 w-full", isBot ? "justify-start" : "justify-end")}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      layout
    >
      {isBot && <Avatar sender="bot" />}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-base shadow-md",
          isBot
            ? "bg-secondary text-secondary-foreground rounded-bl-none"
            : "bg-primary text-primary-foreground rounded-br-none font-medium",
        )}
      >
        {CustomComponent ? <CustomComponent {...message.componentProps} /> : message.content}
      </div>
    </motion.div>
  )
}
