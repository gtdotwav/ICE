"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Message } from "@/stores/aiToolsStore"
import { Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Highlight } from "prism-react-renderer"

export function MessageBubble({ message }: { message: Message }) {
  const isBot = message.sender === "bot"

  return (
    <div className={cn("flex items-start gap-3", !isBot && "flex-row-reverse")}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={isBot ? "/placeholder-logo.png" : ""} />
        <AvatarFallback>{isBot ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}</AvatarFallback>
      </Avatar>
      <div
        className={cn("max-w-[80%] rounded-lg p-3 text-sm", isBot ? "bg-muted" : "bg-primary text-primary-foreground")}
      >
        {typeof message.content === "string" ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "")
                return !inline && match ? (
                  <div className="my-2 overflow-hidden rounded-md">
                    <Highlight code={String(children).replace(/\n$/, "")} language={match[1] as any}>
                      {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <pre
                          className={className + " !bg-[#1E1E1E] p-4 text-xs overflow-x-auto"}
                          style={{ ...style, margin: 0 }}
                        >
                          {tokens.map((line, i) => {
                            const { key: lineKey, ...lineProps } = getLineProps({ line, key: i })
                            return (
                              <div key={lineKey} {...lineProps}>
                                {line.map((token, key) => {
                                  const { key: tokenKey, ...tokenProps } = getTokenProps({ token, key: key })
                                  return <span key={tokenKey} {...tokenProps} />
                                })}
                              </div>
                            )
                          })}
                        </pre>
                      )}
                    </Highlight>
                  </div>
                ) : (
                  <code className={cn(className, "bg-black/10 rounded-sm px-1 py-0.5 font-mono text-xs")} {...props}>
                    {children}
                  </code>
                )
              },
              p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
            }}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          message.content
        )}
      </div>
    </div>
  )
}
