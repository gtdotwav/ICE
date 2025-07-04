"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Clipboard, Download } from "lucide-react"
import { useAIToolsStore } from "@/stores/aiToolsStore"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Highlight } from "prism-react-renderer"

export function CodeViewer() {
  const { generatedCode } = useAIToolsStore()
  const { toast } = useToast()

  const cleanedHTML = generatedCode.html
    .replace(/<body.*?>|<\/body>|<style>.*?<\/style>|<head>.*?<\/head>|<html.*?>|<\/html>/gs, "")
    .trim()

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: "O código foi copiado para a área de transferência.",
    })
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <Tabs defaultValue="html" className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-1.5">
          <TabsList>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css" disabled>
              CSS
            </TabsTrigger>
            <TabsTrigger value="js" disabled>
              JavaScript
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleCopy(cleanedHTML)} aria-label="Copiar código">
              <Clipboard className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Exportar código">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <TabsContent value="html" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <Highlight code={cleanedHTML} language="html">
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className + " !bg-[#1E1E1E] p-4 text-xs"} style={{ ...style, margin: 0 }}>
                  {tokens.map((line, lineIndex) => {
                    const { key: lineKey, ...lineProps } = getLineProps({ line, key: lineIndex })
                    return (
                      <div key={lineKey} {...lineProps}>
                        {line.map((token, tokenIndex) => {
                          const { key: tokenKey, ...tokenProps } = getTokenProps({ token, key: tokenIndex })
                          return <span key={tokenKey} {...tokenProps} />
                        })}
                      </div>
                    )
                  })}
                </pre>
              )}
            </Highlight>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
