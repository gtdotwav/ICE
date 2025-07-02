import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ArcticAvatar } from "./arctic-avatar"

type ChatMessageProps = {
  sender: "bot" | "user"
  children: ReactNode
}

export function ChatMessage({ sender, children }: ChatMessageProps) {
  const isBot = sender === "bot"

  return (
    <div className={cn("flex items-end gap-2", isBot ? "justify-start" : "justify-end")}>
      {isBot && <ArcticAvatar />}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm md:text-base",
          isBot
            ? "bg-ice-blue/10 text-polar-white rounded-bl-none border border-ice-blue/20"
            : "bg-ice-blue text-petroleum-blue rounded-br-none font-medium",
        )}
      >
        {children}
      </div>
    </div>
  )
}
